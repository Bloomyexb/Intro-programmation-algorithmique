/*
 * Moteur du playground : exécute le code de l'apprenant et le confronte aux
 * tests d'un exercice.
 *
 * Trois modes d'exercice :
 * - « console » : le programme lit ses entrées avec lire() et affiche avec
 *   console.log() ; les tests comparent ce qu'il affiche à ce qui est attendu ;
 * - « fonction » : les tests appellent une fonction de l'apprenant et
 *   comparent ce qu'elle retourne ;
 * - « page » : le code manipule une page HTML ; les tests remplissent des
 *   champs, cliquent sur des boutons et lisent ce que la page affiche.
 *
 * Les deux premiers modes tournent dans un Web Worker, à l'écart de la page :
 * une boucle infinie n'y fige rien, le worker est arrêté au bout du délai. Le
 * mode page tourne dans une iframe isolée (sandbox).
 *
 * Le fichier ne touche pas au DOM à son chargement : l'outil de vérification
 * des corrigés (outils/verifier-corriges.mjs) le charge aussi sous Node, et
 * remplace le worker par un contexte `vm` grâce à Moteur.configurer().
 */
(function (racine) {
  'use strict';

  const DELAI_MS = 3000;
  const MAX_LIGNES = 500;
  const NOM_FICHIER = 'votre-code.js';

  // ---------------------------------------------------------------------------
  // Outils purs. Utilisés par le moteur, et recopiés tels quels dans le worker
  // ou l'iframe où tourne le code de l'apprenant : ils ne doivent dépendre de
  // rien d'extérieur.
  function outils() {
    // Une valeur telle que la console du playground l'affiche. Au premier
    // niveau, un texte s'affiche sans guillemets, comme avec console.log.
    function formater(valeur, brut, profondeur) {
      profondeur = profondeur || 0;
      if (typeof valeur === 'string') return brut ? valeur : JSON.stringify(valeur);
      if (valeur === null) return 'null';
      if (valeur === undefined) return 'undefined';
      if (typeof valeur === 'number') return Object.is(valeur, -0) ? '0' : String(valeur);
      if (typeof valeur === 'bigint') return valeur + 'n';
      if (typeof valeur === 'function') return '[fonction ' + (valeur.name || 'anonyme') + ']';
      if (typeof valeur !== 'object') return String(valeur);
      if (profondeur > 4) return '…';
      if (Array.isArray(valeur)) {
        return '[' + valeur.map((v) => formater(v, false, profondeur + 1)).join(', ') + ']';
      }
      if (valeur instanceof Error) return valeur.name + ': ' + valeur.message;
      if (typeof Element !== 'undefined' && valeur instanceof Element) {
        return '<' + valeur.tagName.toLowerCase() + (valeur.id ? ' id="' + valeur.id + '"' : '') + '>';
      }
      const cles = Object.keys(valeur);
      if (!cles.length) return '{}';
      return '{ ' + cles.map((c) => c + ': ' + formater(valeur[c], false, profondeur + 1)).join(', ') + ' }';
    }

    // Égalité de contenu : deux tableaux sont égaux s'ils contiennent les
    // mêmes valeurs dans le même ordre. Les nombres à virgule sont comparés à
    // un milliardième près, pour ne pas sanctionner un arrondi de calcul.
    function egal(a, b) {
      if (typeof a === 'number' && typeof b === 'number') {
        if (Number.isNaN(a) && Number.isNaN(b)) return true;
        return a === b || Math.abs(a - b) < 1e-9;
      }
      if (a === b) return true;
      if (Array.isArray(a) || Array.isArray(b)) {
        if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
        return a.every((v, i) => egal(v, b[i]));
      }
      if (a && b && typeof a === 'object' && typeof b === 'object') {
        const ka = Object.keys(a);
        const kb = Object.keys(b);
        return ka.length === kb.length && ka.every((k) => egal(a[k], b[k]));
      }
      return false;
    }

    return { formater, egal };
  }

  const { formater, egal } = outils();

  // ---------------------------------------------------------------------------
  // Ce qui tourne dans le worker, juste avant le code de l'apprenant : la
  // console, lire(), et l'exécution des tests de fonctions. Sérialisé par
  // toString() : rien n'y doit dépendre de la portée du moteur.
  function environnementConsole(config, outils) {
    const envoyer = (message) => self.postMessage(message);
    let lignes = 0;
    let capture = null;

    // Une erreur non rattrapée : on la transmet avec sa pile, qui dit dans
    // quelle ligne du code de l'apprenant elle s'est produite.
    if (self.addEventListener) {
      self.addEventListener('error', (e) => {
        e.preventDefault();
        envoyer({
          type: 'erreur',
          message: String(e.message || 'Erreur'),
          ligne: e.lineno,
          colonne: e.colno,
          pile: e.error && e.error.stack ? String(e.error.stack) : '',
        });
      });
    }

    function afficher(niveau, valeurs) {
      const texte = Array.prototype.map.call(valeurs, (v) => outils.formater(v, true)).join(' ');
      if (capture) {
        if (capture.length < 50) capture.push(texte);
        return;
      }
      lignes += 1;
      if (lignes <= config.maxLignes) envoyer({ type: 'log', niveau, texte });
      else if (lignes === config.maxLignes + 1) envoyer({ type: 'trop' });
    }
    ['log', 'info', 'debug', 'table', 'warn', 'error'].forEach((niveau) => {
      self.console[niveau] = function () {
        afficher(niveau, arguments);
      };
    });

    // LIRE du pseudo-code. Les valeurs viennent du panneau « Entrées », ou du
    // test en cours. Une entrée à plusieurs valeurs se lit valeur par valeur.
    const curseurs = {};
    self.lire = function lire(nom) {
      const entrees = config.entrees || {};
      if (arguments.length === 0) {
        throw new Error('lire() attend le nom de l\'entrée, entre guillemets : lire("age").');
      }
      if (!Object.prototype.hasOwnProperty.call(entrees, nom)) {
        const connues = Object.keys(entrees);
        throw new Error('lire("' + nom + '") : aucune entrée ne porte ce nom. ' + (connues.length
          ? 'Entrées disponibles : ' + connues.join(', ') + '.'
          : 'Ajoutez-la dans le panneau « Entrées », par exemple : ' + nom + ' = 12'));
      }
      const valeur = entrees[nom];
      if (!Array.isArray(valeur)) return valeur;
      const i = curseurs[nom] || 0;
      if (i >= valeur.length) {
        throw new Error('lire("' + nom + '") : plus rien à lire, les ' + valeur.length + ' valeurs prévues ont déjà été lues.');
      }
      curseurs[nom] = i + 1;
      return valeur[i];
    };
    self.alert = function () {
      throw new Error('alert() n\'existe pas dans la console du playground : affichez avec console.log().');
    };
    self.prompt = function () {
      throw new Error('prompt() n\'existe pas dans la console du playground : lisez une entrée avec lire("nom").');
    };
    self.confirm = self.prompt;

    function testerFonctions(tests) {
      tests.forEach((test, i) => {
        envoyer({ type: 'debut', i });
        const resultat = { type: 'test', i, ok: false };
        let f;
        try {
          f = (0, eval)(test.fonction);
        } catch (e) {
          f = undefined;
        }
        if (typeof f !== 'function') {
          resultat.message = f === undefined
            ? 'La fonction ' + test.fonction + ' est introuvable : vérifiez son nom, majuscules comprises.'
            : test.fonction + ' existe, mais ce n\'est pas une fonction.';
          envoyer(resultat);
          return;
        }
        const hasard = Math.random;
        if (test.hasard) {
          let k = 0;
          Math.random = () => test.hasard[k++ % test.hasard.length];
        }
        capture = [];
        try {
          if (test.verifier) {
            const verifier = (0, eval)('(' + test.verifier + ')');
            const r = verifier(f, outils);
            resultat.ok = r === true;
            if (!resultat.ok) resultat.message = typeof r === 'string' ? r : 'Le résultat ne convient pas.';
          } else {
            const args = JSON.parse(JSON.stringify(test.args || []));
            const obtenu = f.apply(null, args);
            resultat.obtenu = outils.formater(obtenu, false);
            resultat.ok = outils.egal(obtenu, test.attendu);
            if (resultat.ok && test.argsInchanges && !outils.egal(args, test.args)) {
              resultat.ok = false;
              resultat.message = 'Le résultat est juste, mais le tableau reçu a été modifié : la fonction doit en construire un nouveau.';
            }
            if (!resultat.ok && obtenu === undefined) {
              resultat.message = 'La fonction ne retourne rien (undefined). Avez-vous écrit return ? Afficher avec console.log ne suffit pas.';
            }
          }
        } catch (e) {
          resultat.erreur = {
            message: (e && e.name ? e.name + ': ' : '') + (e && e.message !== undefined ? e.message : String(e)),
            pile: e && e.stack ? String(e.stack) : '',
          };
        } finally {
          Math.random = hasard;
          resultat.affichages = capture;
          capture = null;
        }
        envoyer(resultat);
      });
    }

    return {
      terminer() {
        if (config.tests) testerFonctions(config.tests);
        envoyer({ type: 'fin' });
      },
    };
  }

  // Le script complet du worker : l'environnement, le code de l'apprenant,
  // puis l'appel qui lance les tests. `decalage` est le nombre de lignes qui
  // précèdent le code de l'apprenant : de quoi retrouver la ligne d'une erreur.
  function scriptConsole(code, config) {
    const prelude =
      "'use strict';\n" +
      'self.__playground = (' + environnementConsole.toString() + ')(' +
      JSON.stringify(config) + ', (' + outils.toString() + ')());\n';
    const decalage = (prelude.match(/\n/g) || []).length;
    return { source: prelude + code + '\n;self.__playground.terminer();\n', decalage };
  }

  // Lance un script dans un worker. Remplacé sous Node par Moteur.configurer().
  let lancer = function lancerDansUnWorker(source, delai, surMessage) {
    return new Promise((resolve) => {
      let url;
      let worker;
      try {
        url = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
        worker = new Worker(url);
      } catch (e) {
        resolve({ erreur: { message: 'Votre navigateur refuse de lancer le code (' + e.message + '). Essayez avec Chrome, Edge ou Firefox à jour.' } });
        return;
      }
      let fini = false;
      const terminer = (bilan) => {
        if (fini) return;
        fini = true;
        clearTimeout(minuterie);
        worker.terminate();
        URL.revokeObjectURL(url);
        resolve(bilan);
      };
      const minuterie = setTimeout(() => terminer({ delaiDepasse: true }), delai);
      worker.onmessage = (e) => {
        if (e.data && e.data.type === 'erreur') {
          terminer({ erreur: e.data });
          return;
        }
        surMessage(e.data);
        if (e.data && e.data.type === 'fin') terminer({});
      };
      worker.onerror = (e) => {
        e.preventDefault();
        terminer({ erreur: { message: String(e.message || 'Erreur'), ligne: e.lineno, colonne: e.colno } });
      };
    });
  };

  // ---------------------------------------------------------------------------
  // Les erreurs : retrouver la ligne dans le code de l'apprenant, et l'expliquer.

  const EXPLICATIONS = [
    [/^(\S+) is not defined/, (m) => '« ' + m[1] + ' » n\'existe pas. Faute de frappe (majuscules comprises) ? Variable jamais déclarée avec let ou const ?' +
      (m[1] === 'document' || m[1] === 'window' ? ' Ici, la page n\'existe pas : document n\'est disponible que dans les exercices en mode page.' : '')],
    [/^Cannot access '(.+)' before initialization/, (m) => '« ' + m[1] + ' » est utilisée avant d\'être déclarée : déplacez sa déclaration plus haut.'],
    [/^Assignment to constant variable/, () => 'Une constante (const) ne peut pas changer de valeur. Si elle doit changer, déclarez-la avec let.'],
    [/^Identifier '(.+)' has already been declared/, (m) => '« ' + m[1] + ' » est déclarée deux fois. Retirez le let ou le const de la seconde déclaration.'],
    [/^(.+) is not a function/, (m) => '« ' + m[1] + ' » n\'est pas une fonction : faute de frappe dans le nom, ou parenthèses en trop ?'],
    [/^Cannot read properties of (undefined|null) \(reading '(.+)'\)/, (m) => 'On lit « .' + m[2] + ' » sur une valeur ' + m[1] + '. La variable a-t-elle bien reçu une valeur ? L\'indice sort-il du tableau ?'],
    [/^Cannot set properties of (undefined|null)/, (m) => 'On modifie une propriété d\'une valeur ' + m[1] + '. Avec querySelector, vérifiez que le sélecteur correspond bien à un élément de la page.'],
    [/^Maximum call stack size exceeded/, () => 'La fonction s\'appelle elle-même sans fin. Le cas de base manque-t-il, ou n\'est-il jamais atteint ?'],
    [/^Invalid left-hand side in assignment/, () => 'À gauche d\'un = il faut une variable. Pour comparer, écrivez === ; pour affecter, la variable à gauche.'],
    [/^Unexpected end of input/, () => 'Le code s\'arrête trop tôt : il manque sans doute une accolade } ou une parenthèse ) fermante.'],
    [/^missing \) after argument list/, () => 'Il manque une parenthèse fermante, ou une virgule entre deux arguments, ou un + entre deux morceaux de texte.'],
    [/^Invalid or unexpected token/, () => 'Caractère inattendu : guillemet jamais refermé, ou guillemets typographiques (« » ’) copiés depuis un texte ?'],
    [/^Unexpected identifier/, () => 'Deux mots se suivent sans rien entre eux : un opérateur, une virgule ou une parenthèse manque, souvent juste avant.'],
    [/^Unexpected string/, () => 'Un texte entre guillemets arrive là où on ne l\'attend pas : un + ou une virgule oublié ?'],
    [/^Unexpected number/, () => 'Un nombre arrive là où on ne l\'attend pas : un opérateur ou une virgule oublié ?'],
    [/^Unexpected token '?else'?/, () => 'Un else sans if juste avant : vérifiez les accolades du if.'],
    [/^Unexpected token/, () => 'Erreur de syntaxe : une parenthèse, une accolade ou un guillemet manque ou est en trop, souvent sur cette ligne ou juste avant.'],
    [/^Unexpected reserved word|^Unexpected strict mode reserved word/, () => 'Un mot réservé du langage est utilisé comme nom de variable : choisissez un autre nom.'],
  ];

  function expliquer(message) {
    const texte = String(message).replace(/^Uncaught\s+/, '').replace(/^\w*Error:\s*/, '');
    for (const [motif, explication] of EXPLICATIONS) {
      const m = motif.exec(texte);
      if (m) return explication(m);
    }
    return '';
  }

  function localiser(erreur, decalage, code) {
    const nbLignes = code.split('\n').length;
    let ligne = erreur.ligne || null;
    let colonne = erreur.colonne || null;
    // Erreur levée dans une fonction : la pile dit où. On retient le premier
    // appel situé dans le code de l'apprenant (pas dans lire(), par exemple).
    if (erreur.pile) {
      for (const l of erreur.pile.split('\n')) {
        const m = /:(\d+):(\d+)\)?\s*$/.exec(l);
        if (m && +m[1] - decalage >= 1 && +m[1] - decalage <= nbLignes) {
          ligne = +m[1];
          colonne = +m[2];
          break;
        }
      }
    }
    let l = ligne ? ligne - decalage : null;
    if (l !== null && l > nbLignes) l = nbLignes;
    if (l !== null && l < 1) l = null;
    // « Error: » n'apprend rien : seuls les types d'erreur précis sont gardés.
    const message = String(erreur.message || 'Erreur').replace(/^Uncaught\s+/, '').replace(/^Error:\s*/, '');
    return { message, ligne: l, colonne: l ? colonne : null, aide: expliquer(message) };
  }

  // Une erreur de syntaxe dans une iframe est mal localisée par le navigateur.
  // Avant de charger une page, on fait donc lire le code par un worker, sans
  // l'exécuter : enveloppé dans une fonction jamais appelée.
  async function verifierSyntaxe(code) {
    const source = "'use strict';\nfunction __verificationSyntaxe() {\n" + code + "\n}\nself.postMessage({ type: 'fin' });\n";
    const bilan = await lancer(source, DELAI_MS, () => {});
    return bilan.erreur ? localiser(bilan.erreur, 2, code) : null;
  }

  // ---------------------------------------------------------------------------
  // Vérifications sur le texte du code : fonctions interdites, récursivité.

  function sansCommentaires(code) {
    return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\\])\/\/.*$/gm, '$1');
  }

  // Le corps d'une fonction déclarée par `function nom(…) {…}` ou
  // `const nom = (…) => …`, retrouvé en comptant les accolades.
  function corpsDe(code, nom) {
    const debut = new RegExp('function\\s+' + nom + '\\s*\\(|\\b' + nom + '\\s*=\\s*(?:function\\b|\\([^)]*\\)\\s*=>|[\\w$]+\\s*=>)').exec(code);
    if (!debut) return null;
    let i = debut.index + debut[0].length;
    const fleche = /=>$/.test(debut[0]);
    // Une fonction fléchée sans accolades : son corps va jusqu'au bout de la ligne.
    if (fleche && !/^\s*\{/.test(code.slice(i))) return code.slice(i).split('\n')[0];
    i = code.indexOf('{', i);
    if (i < 0) return null;
    let profondeur = 0;
    for (let j = i; j < code.length; j++) {
      if (code[j] === '{') profondeur++;
      else if (code[j] === '}' && --profondeur === 0) return code.slice(i + 1, j);
    }
    return code.slice(i + 1);
  }

  function verifierCode(code, exercice) {
    const texte = sansCommentaires(code);
    const problemes = [];
    for (const regle of exercice.interdit || []) {
      if (texte.includes(regle.texte)) problemes.push(regle.message || ('« ' + regle.texte + ' » est interdit dans cet exercice.'));
    }
    for (const nom of exercice.recursif || []) {
      const corps = corpsDe(texte, nom);
      if (corps === null) continue; // la fonction manque : les tests le diront
      if (!new RegExp('\\b' + nom + '\\s*\\(').test(corps)) {
        problemes.push('La fonction ' + nom + ' doit être récursive : elle doit s\'appeler elle-même.');
      }
    }
    return problemes;
  }

  // ---------------------------------------------------------------------------
  // Exécuter et tester en mode console ou fonction.

  async function executerConsole(code, options) {
    options = options || {};
    const config = { entrees: options.entrees || {}, maxLignes: MAX_LIGNES, tests: options.tests || null };
    const { source, decalage } = scriptConsole(code, config);
    const logs = [];
    const resultats = [];
    let trop = false;
    let enCours = -1;
    const bilan = await lancer(source, options.delai || DELAI_MS, (m) => {
      if (!m) return;
      if (m.type === 'log') {
        logs.push(m);
        if (options.surLog) options.surLog(m);
      } else if (m.type === 'trop') {
        trop = true;
      } else if (m.type === 'debut') {
        enCours = m.i;
      } else if (m.type === 'test') {
        if (m.erreur) m.erreur = localiser(m.erreur, decalage, code);
        resultats.push(m);
      }
    });
    return {
      logs,
      trop,
      resultats,
      enCours,
      delaiDepasse: !!bilan.delaiDepasse,
      erreur: bilan.erreur ? localiser(bilan.erreur, decalage, code) : null,
    };
  }

  const ERREUR_DELAI = 'Le programme ne s\'est pas arrêté au bout de 3 secondes : boucle infinie ? Vérifiez que la condition de la boucle finit par devenir fausse.';

  function nomDuTest(test, exercice) {
    if (test.nom) return test.nom;
    if (exercice.mode === 'fonction') {
      return (test.fonction || exercice.fonction) + '(' + (test.args || []).map((a) => formater(a, false)).join(', ') + ')';
    }
    const entrees = Object.keys(test.entrees || {});
    if (!entrees.length) return 'sans entrée';
    return 'avec ' + entrees.map((k) => {
      const v = test.entrees[k];
      return k + ' = ' + (Array.isArray(v) ? v.map((x) => formater(x, true)).join(', ') : formater(v, true));
    }).join(' ; ');
  }

  function comparerSorties(obtenu, attendu) {
    const o = obtenu.map((s) => s.replace(/\s+$/, ''));
    const a = attendu.map((s) => String(s).replace(/\s+$/, ''));
    const proche = (x) => x.toLowerCase().replace(/[\s.,;:!?'"«»]/g, '');
    for (let i = 0; i < Math.max(a.length, o.length); i++) {
      if (o[i] === undefined) return 'Il manque des lignes : on attendait encore « ' + a[i] + ' » (ligne ' + (i + 1) + ').';
      if (a[i] === undefined) return 'Ligne ' + (i + 1) + ' en trop : « ' + o[i] + ' ».';
      if (o[i] !== a[i]) {
        return 'Ligne ' + (i + 1) + ' : on attendait « ' + a[i] + ' », votre programme affiche « ' + o[i] + ' ».' +
          (proche(o[i]) === proche(a[i]) ? ' Presque : la différence tient aux espaces, aux majuscules ou à la ponctuation.' : '');
      }
    }
    return null;
  }

  async function testerSortie(code, exercice) {
    const resultats = [];
    for (const test of exercice.tests) {
      const r = await executerConsole(code, { entrees: test.entrees });
      const resultat = { nom: nomDuTest(test, exercice), ok: false, attendu: test.sortie, obtenu: r.logs.map((l) => l.texte) };
      if (r.delaiDepasse) resultat.message = ERREUR_DELAI;
      else if (r.erreur) resultat.erreur = r.erreur;
      else {
        resultat.message = comparerSorties(resultat.obtenu, test.sortie);
        resultat.ok = resultat.message === null;
      }
      resultats.push(resultat);
    }
    return resultats;
  }

  async function testerFonction(code, exercice) {
    const tests = exercice.tests.map((t) => ({
      fonction: t.fonction || exercice.fonction,
      args: t.args,
      attendu: t.attendu,
      argsInchanges: t.argsInchanges || exercice.argsInchanges || false,
      hasard: t.hasard || null,
      verifier: t.verifier ? String(t.verifier) : null,
    }));
    const r = await executerConsole(code, { tests });
    return exercice.tests.map((test, i) => {
      const resultat = { nom: nomDuTest(test, exercice), ok: false };
      if (!test.verifier) resultat.attendu = formater(test.attendu, false);
      const recu = r.resultats.find((x) => x.i === i);
      if (recu) {
        Object.assign(resultat, { ok: recu.ok, message: recu.message, obtenu: recu.obtenu, erreur: recu.erreur, affichages: recu.affichages });
      } else if (r.erreur) {
        resultat.erreur = r.erreur;
      } else if (r.delaiDepasse) {
        resultat.message = i === r.enCours
          ? 'La fonction ne s\'est pas arrêtée au bout de 3 secondes : boucle infinie, ou récursion sans fin ?'
          : 'Test non lancé : un test précédent ne s\'est pas arrêté.';
      } else {
        resultat.message = 'Test non lancé.';
      }
      return resultat;
    });
  }

  // ---------------------------------------------------------------------------
  // Le mode page : le code tourne dans une iframe isolée, avec le HTML de
  // l'exercice.

  // Ce qui tourne dans l'iframe, dans le <head>, avant tout le reste.
  // Sérialisé par toString() : rien n'y doit dépendre de la portée du moteur.
  function environnementPage(config, outils) {
    const envoyer = (m) => {
      m.jeton = config.jeton;
      parent.postMessage(m, '*');
    };
    const erreurs = [];
    ['log', 'info', 'debug', 'table', 'warn', 'error'].forEach((niveau) => {
      console[niveau] = function () {
        envoyer({ type: 'log', niveau, texte: Array.prototype.map.call(arguments, (v) => outils.formater(v, true)).join(' ') });
      };
    });
    window.addEventListener('error', (e) => {
      const erreur = {
        type: 'erreur',
        message: String(e.message || 'Erreur').replace(/^Uncaught\s+/, ''),
        ligne: e.filename === config.fichier ? e.lineno : null,
        colonne: e.filename === config.fichier ? e.colno : null,
      };
      erreurs.push(erreur);
      envoyer(erreur);
    });
    if (config.hasard) {
      let k = 0;
      Math.random = () => config.hasard[k++ % config.hasard.length];
    }
    if (config.etapes) {
      // Pendant un test, une boîte de dialogue bloquerait tout.
      window.alert = (m) => console.log('[alert] ' + m);
      window.prompt = () => null;
      window.confirm = () => true;
    }

    const normaliser = (s) => String(s).replace(/\s+/g, ' ').trim();
    function element(selecteur) {
      const el = document.querySelector(selecteur);
      if (!el) throw new Error('L\'élément ' + selecteur + ' est introuvable dans la page. Vérifiez l\'onglet HTML : l\'exercice en a besoin.');
      return el;
    }
    // Chaque étape : ['saisir', sélecteur, valeur], ['cliquer', sélecteur],
    // ['texte', sélecteur, attendu] (le texte affiché contient « attendu »),
    // ['vide', sélecteur] (l'élément n'affiche rien).
    function executerEtape(etape) {
      const [action, selecteur, valeur] = etape;
      const avant = erreurs.length;
      if (action === 'saisir') {
        const el = element(selecteur);
        el.value = valeur;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        return null;
      }
      if (action === 'cliquer') {
        element(selecteur).click();
        if (erreurs.length > avant) return { erreur: erreurs[erreurs.length - 1], message: 'Une erreur est survenue après le clic sur ' + selecteur + '.' };
        return null;
      }
      if (action === 'texte' || action === 'vide') {
        const lu = normaliser(element(selecteur).textContent);
        if (action === 'vide') return lu === '' ? null : { message: selecteur + ' devrait être vide, il affiche « ' + lu + ' ».' };
        if (lu.toLowerCase().includes(normaliser(valeur).toLowerCase())) return null;
        return { message: selecteur + ' affiche « ' + (lu || '(rien)') + ' » ; on attendait un texte contenant « ' + valeur + ' ».' };
      }
      return { message: 'Étape de test inconnue : ' + action };
    }

    function executerEtapes() {
      // Le code de l'apprenant a déjà tourné : une erreur à ce stade arrête le test.
      if (erreurs.length) {
        envoyer({ type: 'resultat', ok: false, erreur: erreurs[0], message: 'Le code s\'est arrêté sur une erreur avant même la première étape.' });
        return;
      }
      for (let i = 0; i < config.etapes.length; i++) {
        let probleme;
        try {
          probleme = executerEtape(config.etapes[i]);
        } catch (e) {
          probleme = { message: e.message };
        }
        if (probleme) {
          probleme.type = 'resultat';
          probleme.ok = false;
          probleme.etape = i;
          envoyer(probleme);
          return;
        }
      }
      envoyer({ type: 'resultat', ok: true });
    }

    return {
      // Appelé juste après le code de l'apprenant. Les étapes attendent la fin
      // du chargement : un code qui s'abonne à DOMContentLoaded ou à load doit
      // avoir eu le temps de s'installer.
      apres() {
        if (!config.etapes) return;
        if (document.readyState === 'complete') setTimeout(executerEtapes, 0);
        else window.addEventListener('load', () => setTimeout(executerEtapes, 0));
      },
    };
  }

  function construirePage(html, code, config) {
    const conf = JSON.stringify(Object.assign({ fichier: NOM_FICHIER }, config)).replace(/</g, '\\u003c');
    const tete = '<script>window.__playground = (' + environnementPage.toString() + ')(' + conf + ', (' + outils.toString() + ')());</' + 'script>';
    const corps =
      '<script>\'use strict\'; ' + code.replace(/<\/(script)/gi, '<\\/$1') + '\n//# sourceURL=' + NOM_FICHIER + '</' + 'script>' +
      '<script>window.__playground.apres();</' + 'script>';
    let doc = html && html.trim() ? html : '<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n</head>\n<body>\n</body>\n</html>';
    // Remplacements par fonction : le code peut contenir des « $ », que
    // replace() interpréterait dans une chaîne de remplacement.
    doc = /<head[^>]*>/i.test(doc) ? doc.replace(/<head[^>]*>/i, (m) => m + tete) : tete + doc;
    doc = /<\/body>/i.test(doc) ? doc.replace(/<\/body>(?![\s\S]*<\/body>)/i, () => corps + '</body>') : doc + corps;
    return doc;
  }

  let compteurJetons = 0;
  const nouveauJeton = () => 'pg-' + Date.now() + '-' + (++compteurJetons);

  // Affiche la page dans `iframe` et y lance le code. Les messages de la
  // console et les erreurs arrivent dans `surMessage`.
  async function executerPage(iframe, html, code, surMessage) {
    const syntaxe = await verifierSyntaxe(code);
    if (syntaxe) {
      surMessage({ type: 'erreur', erreur: syntaxe });
      return;
    }
    const jeton = nouveauJeton();
    if (iframe.__ecouteur) window.removeEventListener('message', iframe.__ecouteur);
    iframe.__ecouteur = (e) => {
      if (e.source !== iframe.contentWindow || !e.data || e.data.jeton !== jeton) return;
      const m = e.data;
      if (m.type === 'erreur') surMessage({ type: 'erreur', erreur: localiser(m, 0, code) });
      else surMessage(m);
    };
    window.addEventListener('message', iframe.__ecouteur);
    iframe.setAttribute('sandbox', 'allow-scripts allow-modals');
    iframe.srcdoc = construirePage(html, code, { jeton });
  }

  async function testerPage(code, html, exercice) {
    const syntaxe = await verifierSyntaxe(code);
    if (syntaxe) {
      return exercice.tests.map((test, i) => ({
        nom: test.nom || ('scénario ' + (i + 1)),
        ok: false,
        message: 'Le code contient une erreur de syntaxe : il ne peut pas être lancé.',
        erreur: syntaxe,
      }));
    }
    return exercice.tests.reduce((chaine, test, i) => chaine.then((resultats) => new Promise((resolve) => {
      const jeton = nouveauJeton();
      const iframe = document.createElement('iframe');
      iframe.setAttribute('sandbox', 'allow-scripts');
      iframe.setAttribute('aria-hidden', 'true');
      iframe.style.cssText = 'position:absolute;left:-10000px;top:0;width:800px;height:600px;border:0;';
      const resultat = { nom: test.nom || ('scénario ' + (i + 1)), ok: false, affichages: [] };
      let fini = false;
      const terminer = () => {
        if (fini) return;
        fini = true;
        clearTimeout(minuterie);
        window.removeEventListener('message', ecouteur);
        iframe.remove();
        resolve(resultats.concat(resultat));
      };
      const ecouteur = (e) => {
        if (e.source !== iframe.contentWindow || !e.data || e.data.jeton !== jeton) return;
        const m = e.data;
        if (m.type === 'log') {
          if (resultat.affichages.length < 50) resultat.affichages.push(m.texte);
        } else if (m.type === 'resultat') {
          resultat.ok = m.ok;
          if (!m.ok) {
            const etape = typeof m.etape === 'number' ? test.etapes[m.etape] : null;
            resultat.message = (etape ? 'Étape ' + (m.etape + 1) + ' (' + decrireEtape(etape) + ') : ' : '') + (m.message || '');
            if (m.erreur) resultat.erreur = localiser(m.erreur, 0, code);
          }
          terminer();
        }
      };
      const minuterie = setTimeout(() => {
        resultat.message = 'La page n\'a pas répondu au bout de 3 secondes : boucle infinie ?';
        terminer();
      }, DELAI_MS);
      window.addEventListener('message', ecouteur);
      iframe.srcdoc = construirePage(html, code, { jeton, hasard: test.hasard || null, etapes: test.etapes });
      document.body.appendChild(iframe);
    })), Promise.resolve([]));
  }

  function decrireEtape(etape) {
    const [action, selecteur, valeur] = etape;
    if (action === 'saisir') return 'saisir « ' + valeur + ' » dans ' + selecteur;
    if (action === 'cliquer') return 'cliquer sur ' + selecteur;
    if (action === 'texte') return selecteur + ' doit afficher « ' + valeur + ' »';
    if (action === 'vide') return selecteur + ' doit être vide';
    return action;
  }

  // ---------------------------------------------------------------------------
  // Point d'entrée commun : tester un code pour un exercice.

  async function tester(exercice, code, html) {
    const regles = verifierCode(code, exercice);
    let resultats;
    if (exercice.mode === 'page') resultats = await testerPage(code, html, exercice);
    else if (exercice.mode === 'fonction') resultats = await testerFonction(code, exercice);
    else resultats = await testerSortie(code, exercice);
    if (regles.length) resultats.unshift({ nom: 'Règles de l\'exercice', ok: false, message: regles.join(' ') });
    return resultats;
  }

  // Les fichiers d'exercices s'enregistrent par ces deux fonctions. `jeSais`
  // reprend la liste « Je sais… » qui termine le chapitre : l'auto-évaluation.
  racine.EXERCICES = racine.EXERCICES || [];
  racine.CHAPITRES = racine.CHAPITRES || {};
  racine.JE_SAIS = racine.JE_SAIS || {};
  racine.chapitre = function chapitre(numero, titre, jeSais) {
    racine.CHAPITRES[numero] = titre;
    if (jeSais) racine.JE_SAIS[numero] = jeSais;
  };
  racine.exercice = function exercice(definition) {
    racine.EXERCICES.push(Object.assign({ mode: 'console', niveau: 1 }, definition));
  };

  racine.Moteur = {
    DELAI_MS,
    formater,
    egal,
    expliquer,
    verifierCode,
    executerConsole,
    executerPage,
    tester,
    decrireEtape,
    nomDuTest,
    // Sous Node, l'outil de vérification fournit sa propre façon de lancer un script.
    configurer(options) {
      if (options.lancer) lancer = options.lancer;
    },
  };
})(typeof window !== 'undefined' ? window : globalThis);
