/*
 * Interface du playground : choix de l'exercice, éditeur, entrées, console,
 * page et tests. L'exécution elle-même est l'affaire de moteur.js ; les
 * exercices sont déclarés dans ../exercices/.
 */
(function () {
  'use strict';

  const CLE = 'playground-intro-algo:';
  const $ = (selecteur) => document.querySelector(selecteur);

  // ---------------------------------------------------------------------------
  // Mémoire du navigateur. Elle peut manquer (navigation privée, réglages) :
  // le playground fonctionne alors, sans rien retenir d'une visite à l'autre.
  const memoire = {
    lire(id) {
      try {
        return JSON.parse(localStorage.getItem(CLE + id)) || {};
      } catch (e) {
        return {};
      }
    },
    // Si la mémoire est pleine, les plus anciens instantanés de code de
    // l'historique sont retirés (l'événement reste, sans son code), puis on
    // réessaie.
    ecrire(id, etat) {
      for (let essai = 0; essai < 5; essai++) {
        try {
          localStorage.setItem(CLE + id, JSON.stringify(etat));
          return true;
        } catch (e) {
          const avecCode = (etat.historique || []).filter((ev) => ev.code);
          if (avecCode.length <= 3) break;
          avecCode.slice(0, Math.ceil(avecCode.length / 2)).forEach((ev) => {
            delete ev.code;
            ev.codeRetire = true;
          });
        }
      }
      return false;
    },
  };

  // Lire, modifier et réécrire l'état d'un exercice, en une fois.
  function majEtat(id, modifier) {
    const etat = memoire.lire(id);
    modifier(etat);
    memoire.ecrire(id, etat);
    return etat;
  }

  // ---------------------------------------------------------------------------
  // Les exercices : deux bacs à sable, puis ceux des fichiers d'exercices.

  const HTML_BAC = [
    '<!doctype html>',
    '<html lang="fr">',
    '<head>',
    '  <meta charset="utf-8">',
    '  <style>',
    '    body { font-family: system-ui, sans-serif; margin: 1.5rem; }',
    '  </style>',
    '</head>',
    '<body>',
    '  <h1>Ma page</h1>',
    '  <input id="champ" placeholder="Tapez quelque chose">',
    '  <button id="bouton">Valider</button>',
    '  <p id="resultat"></p>',
    '</body>',
    '</html>',
    '',
  ].join('\n');

  const JS_BAC_PAGE = [
    'const champ = document.querySelector("#champ");',
    'const resultat = document.querySelector("#resultat");',
    '',
    'function valider() {',
    '  resultat.textContent = "Vous avez écrit : " + champ.value;',
    '}',
    '',
    'document.querySelector("#bouton").addEventListener("click", valider);',
    '',
  ].join('\n');

  const BACS = [
    {
      id: 'bac-console',
      titre: 'Bac à sable — console',
      mode: 'console',
      bac: true,
      enonce: '<p>Un espace libre pour essayer ce que vous voulez. <code>console.log()</code> affiche dans la console ; <code>lire("nom")</code> lit une valeur du panneau « Entrées ».</p>',
      entrees: { prenom: 'Ada', age: 36 },
      depart: '// Essayez ici ce que vous voulez, puis Exécuter (Ctrl+Entrée).\nconst prenom = lire("prenom");\nconst age = lire("age");\n\nconsole.log("Bonjour " + prenom + " !");\nconsole.log("Dans 10 ans, vous aurez " + (age + 10) + " ans.");\n',
      tests: [],
    },
    {
      id: 'bac-page',
      titre: 'Bac à sable — page',
      mode: 'page',
      bac: true,
      enonce: '<p>Un espace libre pour manipuler une page : le HTML dans l\'onglet <strong>HTML</strong>, le JavaScript dans l\'onglet <strong>JavaScript</strong>. La page s\'affiche dans l\'onglet <strong>Page</strong>, à droite.</p>',
      html: HTML_BAC,
      depart: JS_BAC_PAGE,
      tests: [],
    },
  ];

  const EXERCICES = window.EXERCICES || [];
  const tous = BACS.concat(EXERCICES);
  const vus = new Set();
  for (const ex of tous) {
    ex.id = String(ex.id);
    if (vus.has(ex.id)) console.warn('Playground : deux exercices portent le numéro ' + ex.id);
    vus.add(ex.id);
  }
  const chapitreDe = (ex) => ex.id.split('.')[0];

  // ---------------------------------------------------------------------------
  // Les entrées : « nom = valeur », une par ligne. Plusieurs valeurs séparées
  // par des virgules se lisent l'une après l'autre.

  function morceaux(texte) {
    const parties = [];
    let courant = '';
    let guillemet = null;
    for (const c of texte) {
      if (guillemet) {
        if (c === guillemet) guillemet = null;
        courant += c;
      } else if (c === '"' || c === '\'') {
        guillemet = c;
        courant += c;
      } else if (c === ',') {
        parties.push(courant);
        courant = '';
      } else {
        courant += c;
      }
    }
    parties.push(courant);
    return parties;
  }

  function valeurSimple(texte) {
    const s = texte.trim();
    if (/^"[\s\S]*"$/.test(s) || /^'[\s\S]*'$/.test(s)) return s.slice(1, -1);
    if (s === 'true') return true;
    if (s === 'false') return false;
    if (s !== '' && !Number.isNaN(Number(s))) return Number(s);
    return s;
  }

  function lireEntrees(texte) {
    const entrees = {};
    const erreurs = [];
    texte.split('\n').forEach((ligne, i) => {
      const l = ligne.trim();
      if (!l || l.startsWith('//') || l.startsWith('#')) return;
      const m = /^([A-Za-z_$][\w$]*)\s*=\s*(.*)$/.exec(l);
      if (!m) {
        erreurs.push('Entrées, ligne ' + (i + 1) + ' : écrivez « nom = valeur », par exemple « age = 17 ».');
        return;
      }
      const parties = morceaux(m[2]);
      entrees[m[1]] = parties.length > 1 ? parties.map(valeurSimple) : valeurSimple(m[2]);
    });
    return { entrees, erreurs };
  }

  function enTexte(v) {
    if (typeof v !== 'string') return String(v);
    const ambigu = v.includes(',') || v !== v.trim() || v === '' || v === 'true' || v === 'false' || !Number.isNaN(Number(v));
    return ambigu ? JSON.stringify(v) : v;
  }

  function texteEntrees(entrees) {
    return Object.keys(entrees || {})
      .map((k) => k + ' = ' + (Array.isArray(entrees[k]) ? entrees[k].map(enTexte).join(', ') : enTexte(entrees[k])))
      .join('\n');
  }

  // ---------------------------------------------------------------------------
  // Le thème : automatique (celui du système), sombre ou clair. Le choix est
  // retenu par le navigateur ; le <head> de index.html l'applique dès le
  // chargement, cette partie le tient à jour.

  const CLE_THEME = CLE + 'theme';
  const THEMES = {
    auto: { icone: '🌓', titre: 'Thème automatique, celui de votre système. Cliquer pour passer en sombre.' },
    sombre: { icone: '🌙', titre: 'Thème sombre. Cliquer pour passer en clair.' },
    clair: { icone: '☀️', titre: 'Thème clair. Cliquer pour revenir au thème automatique.' },
  };
  const THEME_SUIVANT = { auto: 'sombre', sombre: 'clair', clair: 'auto' };
  const systemeSombre = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  let choixTheme = 'auto';
  try {
    const retenu = localStorage.getItem(CLE_THEME);
    if (THEMES[retenu]) choixTheme = retenu;
  } catch (e) {
    // Mémoire indisponible : thème automatique.
  }

  const estSombre = () => choixTheme === 'sombre' || (choixTheme === 'auto' && !!systemeSombre && systemeSombre.matches);
  const themeEditeur = () => (estSombre() ? 'material-darker' : 'default');

  // ---------------------------------------------------------------------------
  // L'éditeur.

  const editeur = CodeMirror.fromTextArea($('#code'), {
    mode: 'javascript',
    theme: themeEditeur(),
    lineNumbers: true,
    tabSize: 2,
    indentUnit: 2,
    indentWithTabs: false,
    matchBrackets: true,
    autoCloseBrackets: true,
    autoCloseTags: true,
    styleActiveLine: true,
    extraKeys: {
      'Ctrl-Enter': () => executer(),
      'Cmd-Enter': () => executer(),
      'Ctrl-/': 'toggleComment',
      'Cmd-/': 'toggleComment',
      Tab: (cm) => (cm.somethingSelected() ? cm.indentSelection('add') : cm.replaceSelection('  ', 'end')),
      'Shift-Tab': (cm) => cm.indentSelection('subtract'),
    },
  });
  function appliquerTheme() {
    if (choixTheme === 'auto') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = choixTheme === 'sombre' ? 'dark' : 'light';
    const bouton = $('#btn-theme');
    bouton.textContent = THEMES[choixTheme].icone;
    bouton.title = THEMES[choixTheme].titre;
    bouton.setAttribute('aria-label', THEMES[choixTheme].titre);
    editeur.setOption('theme', themeEditeur());
  }

  $('#btn-theme').addEventListener('click', () => {
    choixTheme = THEME_SUIVANT[choixTheme];
    try {
      localStorage.setItem(CLE_THEME, choixTheme);
    } catch (e) {
      // Pas de mémoire : le choix vaut pour cette visite.
    }
    appliquerTheme();
  });
  if (systemeSombre && systemeSombre.addEventListener) systemeSombre.addEventListener('change', appliquerTheme);
  appliquerTheme();

  let courant = null;
  let docs = null;
  let ongletCode = 'js';
  let indicesVus = 0;
  let ligneMarquee = null;
  let occupe = false;
  let commence = false;
  let editeurSchema = null;

  const maintenant = () => new Date().toISOString();
  const aSchema = (ex) => ex.mode === 'reponse' && (ex.parties || []).includes('schema');

  // Le travail en cours, tel qu'il figurera dans le journal.
  function instantane() {
    if (courant.mode === 'reponse') {
      return { texte: docs.js.getValue(), schema: aSchema(courant) && editeurSchema ? editeurSchema.modele() : null };
    }
    const code = { js: docs.js.getValue() };
    if (courant.mode === 'page') code.html = docs.html.getValue();
    return code;
  }

  function sauver() {
    if (!courant || !docs) return;
    const travail = instantane();
    majEtat(courant.id, (etat) => {
      if (courant.mode === 'reponse') {
        etat.texte = travail.texte;
        if (aSchema(courant)) etat.schema = travail.schema;
      } else {
        etat.js = travail.js;
        etat.html = docs.html.getValue();
        etat.entrees = $('#entrees').value;
      }
      etat.indices = indicesVus;
    });
  }

  // L'historique de l'exercice : chaque essai, horodaté, avec le code tenté
  // quand il a changé depuis le précédent. C'est la matière du journal.
  function journaliser(evenement, avecCode) {
    if (!courant || courant.bac) return null;
    sauver();
    let ajoute = null;
    majEtat(courant.id, (etat) => {
      etat.historique = etat.historique || [];
      ajoute = Object.assign({ t: maintenant() }, evenement);
      if (avecCode) {
        const code = instantane();
        const texte = JSON.stringify(code);
        if (texte !== etat.dernierCode) {
          ajoute.code = code;
          etat.dernierCode = texte;
        } else {
          ajoute.codeInchange = true;
        }
      }
      etat.historique.push(ajoute);
    });
    commence = true;
    return ajoute;
  }

  // Le premier changement ouvre l'historique de l'exercice.
  function noterDebut() {
    if (!commence && courant && !courant.bac) journaliser({ type: 'debut' });
  }

  let minuterieSauvegarde = null;
  function sauverBientot() {
    clearTimeout(minuterieSauvegarde);
    minuterieSauvegarde = setTimeout(sauver, 400);
  }
  editeur.on('change', (cm, changement) => {
    effacerMarque();
    if (changement.origin !== 'setValue') noterDebut();
    sauverBientot();
  });
  $('#entrees').addEventListener('input', sauverBientot);
  window.addEventListener('beforeunload', sauver);

  function basculerCode(onglet) {
    effacerMarque();
    ongletCode = onglet;
    editeur.swapDoc(docs[onglet]);
    document.querySelectorAll('.onglets-code button').forEach((b) => b.classList.toggle('actif', b.dataset.doc === onglet));
    editeur.focus();
  }

  function effacerMarque() {
    if (ligneMarquee) {
      docs.js.removeLineClass(ligneMarquee, 'background', 'cm-ligne-erreur');
      ligneMarquee = null;
    }
  }

  function allerALigne(ligne) {
    if (!ligne) return;
    if (ongletCode !== 'js') basculerCode('js');
    effacerMarque();
    ligneMarquee = docs.js.addLineClass(ligne - 1, 'background', 'cm-ligne-erreur');
    editeur.setCursor({ line: ligne - 1, ch: 0 });
    editeur.scrollIntoView({ line: ligne - 1, ch: 0 }, 80);
    editeur.focus();
  }

  // ---------------------------------------------------------------------------
  // Le choix de l'exercice.

  const choix = $('#choix-exercice');

  function libelle(ex) {
    if (ex.bac) return ex.titre;
    return ex.id + '  ' + '⭐'.repeat(ex.niveau) + '  ' + ex.titre + (memoire.lire(ex.id).reussi ? '  ✅' : '');
  }

  function remplirChoix() {
    choix.innerHTML = '';
    const groupes = new Map();
    groupes.set('bac', { label: 'Bac à sable', exercices: BACS });
    for (const ex of EXERCICES) {
      const c = chapitreDe(ex);
      if (!groupes.has(c)) {
        const titre = (window.CHAPITRES || {})[Number(c)];
        groupes.set(c, { label: c.padStart(2, '0') + ' · ' + (titre || 'Chapitre ' + c), exercices: [] });
      }
      groupes.get(c).exercices.push(ex);
    }
    for (const { label, exercices } of groupes.values()) {
      const og = document.createElement('optgroup');
      og.label = label;
      for (const ex of exercices) {
        const o = document.createElement('option');
        o.value = ex.id;
        o.textContent = libelle(ex);
        og.appendChild(o);
      }
      choix.appendChild(og);
    }
    if (courant) choix.value = courant.id;
    const reussis = EXERCICES.filter((ex) => memoire.lire(ex.id).reussi).length;
    $('#progression').textContent = '✅ ' + reussis + ' / ' + EXERCICES.length;
    $('#progression').title = reussis + ' exercice(s) réussi(s) sur ' + EXERCICES.length;
  }

  function choisir(id) {
    const ex = tous.find((e) => e.id === id) || tous[0];
    if (courant && docs) sauver();
    courant = ex;
    const etat = memoire.lire(ex.id);
    const reponse = ex.mode === 'reponse';
    docs = {
      js: reponse
        ? CodeMirror.Doc(etat.texte != null ? etat.texte : ex.depart || '', 'text/plain')
        : CodeMirror.Doc(etat.js != null ? etat.js : ex.depart || '', 'javascript'),
      html: CodeMirror.Doc(etat.html != null ? etat.html : ex.html || '', 'htmlmixed'),
    };
    ligneMarquee = null;
    basculerCode('js');
    $('#entrees').value = etat.entrees != null ? etat.entrees : texteEntrees(ex.entrees);
    indicesVus = etat.indices || 0;
    commence = !!(etat.historique && etat.historique.length);

    const page = ex.mode === 'page';
    document.body.classList.toggle('mode-page', page);
    document.body.classList.toggle('mode-console', ex.mode === 'console');
    document.body.classList.toggle('mode-reponse', reponse);
    document.body.classList.toggle('avec-schema', aSchema(ex));
    $('#btn-tester').textContent = reponse ? '✓ J\'ai terminé' : '✓ Tester';
    $('#btn-tester').title = reponse ? 'Enregistrer votre réponse comme terminée' : 'Lancer les tests de l\'exercice';
    $('#btn-tester').disabled = !reponse && (!ex.tests || !ex.tests.length);
    $('#btn-executer').disabled = reponse;
    if (aSchema(ex)) {
      const modele = etat.schema || ex.schemaDepart || { noeuds: [], liens: [] };
      if (!editeurSchema) {
        editeurSchema = Schema.editeur($('#schema-conteneur'), {
          modele,
          surChangement: () => {
            noterDebut();
            sauverBientot();
          },
        });
      } else editeurSchema.charger(modele);
    }
    afficherRendu();

    afficherEnonce();
    viderConsole();
    $('#panneau-tests').innerHTML = '<p class="vide">Cliquez sur <strong>✓ Tester</strong> pour vérifier votre code.</p>';
    if (page) {
      $('#page-iframe').removeAttribute('srcdoc');
      $('#page-iframe').src = 'about:blank';
    }
    montrerPanneau('console');
    choix.value = ex.id;
    try {
      history.replaceState(null, '', '#' + ex.id);
    } catch (e) {
      // file:// peut refuser : le numéro d'exercice dans l'adresse est un confort.
    }
  }

  choix.addEventListener('change', () => choisir(choix.value));

  // ---------------------------------------------------------------------------
  // L'énoncé, les exemples et les indices.

  const echapper = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function exemples(ex) {
    const tests = (ex.tests || []).filter((t) => !t.verifier && !t.cache).slice(0, 3);
    if (!tests.length) return '';
    if (ex.mode === 'page') {
      const t = tests[0];
      return '<h3>Ce que vérifie le test « ' + echapper(t.nom || 'scénario 1') + ' »</h3><ol class="etapes">' +
        t.etapes.map((e) => '<li>' + echapper(Moteur.decrireEtape(e)) + '</li>').join('') + '</ol>';
    }
    if (ex.mode === 'fonction') {
      return '<h3>Exemples</h3><table><thead><tr><th>Appel</th><th>Résultat attendu</th></tr></thead><tbody>' +
        tests.map((t) => '<tr><td><code>' + echapper(Moteur.nomDuTest(t, ex)) + '</code></td><td><code>' +
          echapper(Moteur.formater(t.attendu, false)) + '</code></td></tr>').join('') + '</tbody></table>';
    }
    return '<h3>Exemples</h3><table><thead><tr><th>Entrées</th><th>Affichage attendu</th></tr></thead><tbody>' +
      tests.map((t) => '<tr><td>' + (texteEntrees(t.entrees).split('\n').map(echapper).join('<br>') || '<em>aucune</em>') +
        '</td><td><pre>' + echapper(t.sortie.join('\n')) + '</pre></td></tr>').join('') + '</tbody></table>';
  }

  function afficherEnonce() {
    const ex = courant;
    const reussi = memoire.lire(ex.id).reussi;
    const indices = ex.indices || [];
    let html = '';
    if (!ex.bac) {
      html += '<p class="entete"><span class="numero">Exercice ' + echapper(ex.id) + '</span> <span class="niveau" title="niveau">' +
        '⭐'.repeat(ex.niveau) + '</span>' + (reussi ? ' <span class="reussi">' + (ex.mode === 'reponse' ? '✅ rendu' : '✅ réussi') + '</span>' : '') + '</p>';
    }
    html += '<h2>' + echapper(ex.titre) + '</h2>' + (ex.enonce || '') + exemples(ex);
    if (indices.length) {
      html += '<div class="indices">' + indices.slice(0, indicesVus).map((t, i) =>
        '<p class="indice"><strong>💡 Indice ' + (i + 1) + '</strong> ' + t + '</p>').join('');
      if (indicesVus < indices.length) {
        html += '<button id="btn-indice" class="discret">💡 Indice ' + (indicesVus + 1) + ' / ' + indices.length + '</button>';
      }
      html += '</div>';
    }
    if (!ex.bac) {
      html += '<p class="renvoi">Énoncé détaillé et correction : chapitre ' + chapitreDe(ex).padStart(2, '0') + ' du support de cours.</p>';
    }
    $('#enonce-contenu').innerHTML = html;
    const bouton = $('#btn-indice');
    if (bouton) {
      bouton.addEventListener('click', () => {
        indicesVus += 1;
        sauver();
        journaliser({ type: 'indice', numero: indicesVus });
        afficherEnonce();
      });
    }
  }

  $('#btn-enonce').addEventListener('click', () => {
    const replie = document.body.classList.toggle('enonce-replie');
    $('#btn-enonce').setAttribute('aria-expanded', String(!replie));
    editeur.refresh();
  });

  // ---------------------------------------------------------------------------
  // Les panneaux de droite.

  function montrerPanneau(nom) {
    document.querySelectorAll('.onglets button').forEach((b) => {
      const actif = b.dataset.panneau === nom;
      b.classList.toggle('actif', actif);
      b.setAttribute('aria-selected', String(actif));
    });
    document.querySelectorAll('.panneau').forEach((p) => p.classList.toggle('actif', p.id === 'panneau-' + nom));
  }
  document.querySelectorAll('.onglets button').forEach((b) => b.addEventListener('click', () => montrerPanneau(b.dataset.panneau)));
  document.querySelectorAll('.onglets-code button').forEach((b) => b.addEventListener('click', () => basculerCode(b.dataset.doc)));

  const consoleEl = $('#panneau-console');

  function viderConsole() {
    consoleEl.innerHTML = '';
  }

  function ligneConsole(classe, contenu) {
    const div = document.createElement('div');
    div.className = 'ligne ' + classe;
    if (typeof contenu === 'string') div.textContent = contenu;
    else div.appendChild(contenu);
    consoleEl.appendChild(div);
    consoleEl.scrollTop = consoleEl.scrollHeight;
    return div;
  }

  // Une erreur : sa ligne (cliquable), son message, et son explication.
  function blocErreur(erreur) {
    const frag = document.createDocumentFragment();
    if (erreur.ligne) {
      const b = document.createElement('button');
      b.className = 'aller';
      b.textContent = 'Ligne ' + erreur.ligne;
      b.title = 'Aller à la ligne ' + erreur.ligne;
      b.addEventListener('click', () => allerALigne(erreur.ligne));
      frag.appendChild(b);
    }
    frag.appendChild(document.createTextNode(' ' + erreur.message));
    if (erreur.aide) {
      const aide = document.createElement('div');
      aide.className = 'aide';
      aide.textContent = '💡 ' + erreur.aide;
      frag.appendChild(aide);
    }
    return frag;
  }

  // ---------------------------------------------------------------------------
  // Exécuter.

  function occuper(oui) {
    occupe = oui;
    document.body.classList.toggle('occupe', oui);
    $('#btn-executer').disabled = oui || courant.mode === 'reponse';
    $('#btn-tester').disabled = oui || (courant.mode !== 'reponse' && (!courant.tests || !courant.tests.length));
  }

  const resumeErreur = (erreur) => (erreur ? erreur.message + (erreur.ligne ? ' (ligne ' + erreur.ligne + ')' : '') : null);

  async function executer() {
    if (occupe) return null;
    sauver();
    effacerMarque();
    viderConsole();
    const code = docs.js.getValue();

    if (courant.mode === 'reponse') return null;
    if (courant.mode === 'page') {
      journaliser({ type: 'execution' }, true);
      montrerPanneau('page');
      ligneConsole('systeme', '▶ Page chargée : les messages de console.log() s\'affichent ici.');
      Moteur.executerPage($('#page-iframe'), docs.html.getValue(), code, (m) => {
        if (m.type === 'log') ligneConsole('log ' + m.niveau, m.texte);
        else if (m.type === 'erreur') {
          ligneConsole('erreur', blocErreur(m.erreur));
          if (m.erreur.ligne) allerALigne(m.erreur.ligne);
          montrerPanneau('console');
        }
      });
      return null;
    }

    montrerPanneau('console');
    const { entrees, erreurs } = lireEntrees($('#entrees').value);
    if (erreurs.length) {
      erreurs.forEach((e) => ligneConsole('erreur', e));
      return null;
    }
    occuper(true);
    ligneConsole('systeme', '▶ Exécution…');
    const r = await Moteur.executerConsole(code, { entrees, surLog: (m) => ligneConsole('log ' + m.niveau, m.texte) });
    if (r.trop) ligneConsole('systeme', '… affichage interrompu : plus de 500 lignes.');
    if (r.erreur) {
      ligneConsole('erreur', blocErreur(r.erreur));
      if (r.erreur.ligne) allerALigne(r.erreur.ligne);
    } else if (r.delaiDepasse) {
      ligneConsole('erreur', blocErreur({ message: 'Arrêté au bout de 3 secondes.', aide: 'Le programme ne s\'arrêtait pas : boucle infinie ? Vérifiez que la condition de la boucle finit par devenir fausse.' }));
    } else {
      ligneConsole('systeme', r.logs.length ? '■ Terminé.' : '■ Terminé, sans rien afficher. Pour voir un résultat, utilisez console.log().');
    }
    journaliser({
      type: 'execution',
      entrees,
      resultat: { lignes: r.logs.length, erreur: resumeErreur(r.erreur), boucleInfinie: r.delaiDepasse || undefined },
    }, true);
    occuper(false);
    return r;
  }

  // ---------------------------------------------------------------------------
  // Les exercices sans test automatique : une réponse rédigée, ou un schéma.

  function afficherRendu() {
    if (courant.mode !== 'reponse') return;
    const etat = memoire.lire(courant.id);
    const chapitre = chapitreDe(courant).padStart(2, '0');
    const note = $('#note-reponse');
    note.textContent = '';
    const p = document.createElement('p');
    if (etat.reussi && etat.renduLe) {
      p.textContent = '✅ Réponse rendue le ' + new Date(etat.renduLe).toLocaleString('fr-FR') +
        '. Comparez-la maintenant avec la correction du support (chapitre ' + chapitre + '). Vous pouvez encore la modifier, puis cliquer de nouveau sur « J\'ai terminé ».';
    } else {
      p.textContent = 'Pas de test automatique pour cet exercice : ' +
        (aSchema(courant) ? 'dessinez le schéma ci-dessous, ' : '') +
        'écrivez votre réponse à gauche, puis cliquez sur « ✓ J\'ai terminé ». Comparez ensuite avec la correction du support (chapitre ' + chapitre + ').';
    }
    note.appendChild(p);
  }

  function rendre() {
    const etat = journaliser({ type: 'rendu' }, true) && majEtat(courant.id, (e) => {
      e.reussi = true;
      e.renduLe = maintenant();
      if (!e.reussiLe) e.reussiLe = e.renduLe;
    });
    if (etat) {
      remplirChoix();
      afficherEnonce();
      afficherRendu();
    }
    return etat;
  }

  // ---------------------------------------------------------------------------
  // Tester.

  function bloc(titre, texte) {
    return '<div class="bloc"><span class="etiquette">' + titre + '</span><pre>' + echapper(texte) + '</pre></div>';
  }

  async function tester() {
    if (occupe) return null;
    if (courant.mode === 'reponse') return rendre();
    if (!courant.tests || !courant.tests.length) return null;
    sauver();
    effacerMarque();
    occuper(true);
    montrerPanneau('tests');
    const panneau = $('#panneau-tests');
    panneau.innerHTML = '<p class="vide">⏳ Tests en cours…</p>';
    let resultats;
    try {
      resultats = await Moteur.tester(courant, docs.js.getValue(), docs.html.getValue());
    } catch (e) {
      panneau.innerHTML = '<p class="bilan ko">Les tests n\'ont pas pu tourner : ' + echapper(e.message) + '</p>';
      occuper(false);
      return null;
    }
    const reussis = resultats.filter((r) => r.ok).length;
    const tousOk = reussis === resultats.length;
    const exercice = courant;
    journaliser({
      type: 'test',
      reussis,
      total: resultats.length,
      echecs: resultats.filter((r) => !r.ok).slice(0, 3).map((r) => ({
        nom: r.nom,
        message: String(r.message || resumeErreur(r.erreur) || '').slice(0, 300),
      })),
    }, true);
    if (tousOk) {
      majEtat(exercice.id, (etat) => {
        etat.reussi = true;
        if (!etat.reussiLe) etat.reussiLe = maintenant();
      });
      remplirChoix();
      afficherEnonce();
    }

    let html = '<p class="bilan ' + (tousOk ? 'ok' : 'ko') + '">' + (tousOk
      ? '🎉 ' + reussis + ' / ' + resultats.length + ' tests réussis : exercice réussi !'
      : reussis + ' / ' + resultats.length + ' tests réussis. Lisez le premier ❌, corrigez, retestez.') + '</p>';
    if (tousOk) {
      const i = tous.indexOf(exercice);
      if (i >= 0 && i + 1 < tous.length) html += '<p><button id="btn-suivant" class="primaire">Exercice suivant →</button></p>';
    }
    resultats.forEach((r, i) => {
      html += '<div class="test ' + (r.ok ? 'ok' : 'ko') + '"><p class="nom">' + (r.ok ? '✅' : '❌') + ' ' + echapper(r.nom) + '</p>';
      if (!r.ok) {
        if (r.message) html += '<p class="message">' + echapper(r.message) + '</p>';
        if (r.erreur) html += '<div class="erreur-test" data-i="' + i + '"></div>';
        if (exercice.mode === 'console' && r.attendu && !r.erreur) {
          html += '<div class="comparaison">' + bloc('Attendu', r.attendu.join('\n')) + bloc('Obtenu', r.obtenu.join('\n') || '(rien)') + '</div>';
        }
        if (exercice.mode === 'fonction' && r.attendu !== undefined && r.obtenu !== undefined && !r.erreur) {
          html += '<div class="comparaison">' + bloc('Attendu', r.attendu) + bloc('Obtenu', r.obtenu) + '</div>';
        }
        if (r.affichages && r.affichages.length) html += bloc('Affiché pendant le test', r.affichages.join('\n'));
      }
      html += '</div>';
    });
    panneau.innerHTML = html;
    panneau.querySelectorAll('.erreur-test').forEach((el) => el.appendChild(blocErreur(resultats[Number(el.dataset.i)].erreur)));
    const suivant = $('#btn-suivant');
    if (suivant) suivant.addEventListener('click', () => choisir(tous[tous.indexOf(exercice) + 1].id));
    const premiere = resultats.find((r) => r.erreur && r.erreur.ligne);
    if (premiere) allerALigne(premiere.erreur.ligne);
    occuper(false);
    return resultats;
  }

  // ---------------------------------------------------------------------------
  // Le journal : tout le travail depuis le début, signé, à télécharger chaque
  // soir pour le déposer sur Moodle. La signature est l'affaire de signature.js.

  const TITRE_COURS = 'Introduction à la programmation et à l\'algorithmique';
  const CLE_APPRENANT = CLE + '_apprenant';
  const CLE_AUTO = CLE + '_auto-evaluation';

  function lireCle(cle, defaut) {
    try {
      return JSON.parse(localStorage.getItem(cle)) || defaut;
    } catch (e) {
      return defaut;
    }
  }
  function ecrireCle(cle, valeur) {
    try {
      localStorage.setItem(cle, JSON.stringify(valeur));
    } catch (e) {
      // Mémoire indisponible : le choix vaut pour cette visite.
    }
  }

  // Les textes « Je sais » reprennent ceux du support, `code` compris.
  const enCode = (texte) => echapper(texte).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*([^*]+)\*/g, '<em>$1</em>');

  function statut(ex, etat) {
    if (etat.reussi) return ex.mode === 'reponse' ? 'rendu' : 'réussi';
    return etat.historique && etat.historique.length ? 'commencé' : 'non commencé';
  }

  function construireJournal(nom) {
    const auto = lireCle(CLE_AUTO, { items: {}, historique: [] });
    const etapes = EXERCICES.map((ex) => {
      const etat = memoire.lire(ex.id);
      const historique = etat.historique || [];
      const etape = { id: ex.id, titre: ex.titre, chapitre: Number(chapitreDe(ex)), mode: ex.mode, niveau: ex.niveau, statut: statut(ex, etat) };
      if (etape.statut === 'non commencé') return etape;
      if (ex.mode === 'reponse') {
        etape.reponse = { texte: etat.texte != null ? etat.texte : '' };
        if (aSchema(ex)) etape.reponse.schema = etat.schema || null;
      } else {
        etape.code = { js: etat.js != null ? etat.js : '' };
        if (ex.mode === 'page') etape.code.html = etat.html != null ? etat.html : '';
      }
      const tests = historique.filter((e) => e.type === 'test');
      const dernier = tests[tests.length - 1];
      Object.assign(etape, {
        commenceLe: historique.length ? historique[0].t : undefined,
        reussiLe: etat.reussiLe,
        indices: { ouverts: etat.indices || 0, disponibles: (ex.indices || []).length },
        essais: { executions: historique.filter((e) => e.type === 'execution').length, tests: tests.length },
        dernierTest: dernier ? { t: dernier.t, reussis: dernier.reussis, total: dernier.total } : undefined,
        historique,
      });
      return etape;
    });
    const chapitres = Object.keys(window.JE_SAIS || {}).map(Number).sort((a, b) => a - b).map((n) => ({
      numero: n,
      titre: (window.CHAPITRES || {})[n] || '',
      items: window.JE_SAIS[n].map((texte, i) => {
        const coche = ((auto.items || {})[n] || [])[i] || {};
        return { texte, coche: !!coche.coche, t: coche.t };
      }),
    }));
    return {
      format: 'journal-intro-algo',
      version: 1,
      cours: TITRE_COURS,
      apprenant: { nom },
      genereLe: maintenant(),
      navigateur: navigator.userAgent,
      progression: {
        terminees: etapes.filter((e) => e.statut === 'réussi' || e.statut === 'rendu').length,
        commencees: etapes.filter((e) => e.statut !== 'non commencé').length,
        total: etapes.length,
      },
      etapes,
      autoEvaluation: { chapitres, historique: auto.historique || [] },
    };
  }

  function nomDeFichier(nom) {
    const morceau = nom.normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'apprenant';
    const d = new Date();
    const deux = (n) => String(n).padStart(2, '0');
    return 'journal-' + morceau + '-' + d.getFullYear() + '-' + deux(d.getMonth() + 1) + '-' + deux(d.getDate()) + '-' + deux(d.getHours()) + 'h' + deux(d.getMinutes()) + '.json';
  }

  function afficherBilanJournal() {
    const corps = $('#journal-bilan');
    corps.textContent = '';
    const groupes = new Map();
    for (const ex of EXERCICES) {
      const c = Number(chapitreDe(ex));
      if (!groupes.has(c)) groupes.set(c, { terminees: 0, commencees: 0, total: 0 });
      const g = groupes.get(c);
      const s = statut(ex, memoire.lire(ex.id));
      g.total++;
      if (s === 'réussi' || s === 'rendu') g.terminees++;
      else if (s === 'commencé') g.commencees++;
    }
    for (const [c, g] of groupes) {
      const ligne = document.createElement('tr');
      [String(c).padStart(2, '0') + ' · ' + ((window.CHAPITRES || {})[c] || ''), g.terminees + ' / ' + g.total, g.commencees ? String(g.commencees) : '—']
        .forEach((texte) => {
          const td = document.createElement('td');
          td.textContent = texte;
          ligne.appendChild(td);
        });
      corps.appendChild(ligne);
    }
  }

  function afficherAutoEvaluation() {
    const zone = $('#journal-auto');
    zone.textContent = '';
    const auto = lireCle(CLE_AUTO, { items: {}, historique: [] });
    for (const n of Object.keys(window.JE_SAIS || {}).map(Number).sort((a, b) => a - b)) {
      const items = window.JE_SAIS[n];
      const cochees = () => items.filter((_, i) => ((auto.items[n] || [])[i] || {}).coche).length;
      const details = document.createElement('details');
      const resume = document.createElement('summary');
      const majResume = () => {
        resume.textContent = String(n).padStart(2, '0') + ' · ' + ((window.CHAPITRES || {})[n] || '') + ' — ' + cochees() + ' / ' + items.length;
      };
      majResume();
      details.appendChild(resume);
      const liste = document.createElement('ul');
      items.forEach((texte, i) => {
        const li = document.createElement('li');
        const label = document.createElement('label');
        const caseACocher = document.createElement('input');
        caseACocher.type = 'checkbox';
        caseACocher.checked = !!((auto.items[n] || [])[i] || {}).coche;
        caseACocher.addEventListener('change', () => {
          const t = maintenant();
          auto.items[n] = auto.items[n] || [];
          auto.items[n][i] = { coche: caseACocher.checked, t };
          auto.historique = auto.historique || [];
          auto.historique.push({ t, chapitre: n, item: i, coche: caseACocher.checked });
          ecrireCle(CLE_AUTO, auto);
          majResume();
        });
        const span = document.createElement('span');
        span.innerHTML = ' Je sais ' + enCode(texte.replace(/[ ;.]+$/, ''));
        label.append(caseACocher, span);
        li.appendChild(label);
        liste.appendChild(li);
      });
      details.appendChild(liste);
      zone.appendChild(details);
    }
  }

  function ouvrirJournal() {
    sauver();
    $('#journal-nom').value = lireCle(CLE_APPRENANT, {}).nom || '';
    $('#journal-message').textContent = '';
    afficherBilanJournal();
    afficherAutoEvaluation();
    const d = $('#journal');
    if (typeof d.showModal === 'function') d.showModal();
    else d.setAttribute('open', '');
  }

  function journalSigne(nom) {
    sauver();
    return window.Signature.signerJournal(construireJournal(nom));
  }

  function telechargerJournal() {
    const message = $('#journal-message');
    const nom = $('#journal-nom').value.trim().replace(/\s+/g, ' ');
    if (!nom) {
      message.textContent = 'Indiquez d\'abord votre prénom et votre nom.';
      $('#journal-nom').focus();
      return;
    }
    if (!window.Signature) {
      message.textContent = 'Le module de signature (playground/signature.js) est introuvable : le journal ne peut pas être produit.';
      return;
    }
    ecrireCle(CLE_APPRENANT, { nom });
    const journal = journalSigne(nom);
    const fichier = nomDeFichier(nom);
    const lien = document.createElement('a');
    lien.href = URL.createObjectURL(new Blob([JSON.stringify(journal, null, 1)], { type: 'application/json' }));
    lien.download = fichier;
    document.body.appendChild(lien);
    lien.click();
    setTimeout(() => {
      URL.revokeObjectURL(lien.href);
      lien.remove();
    }, 2000);
    message.textContent = '✅ Journal téléchargé : ' + fichier + '. Déposez-le maintenant sur Moodle.';
  }

  $('#btn-journal').addEventListener('click', ouvrirJournal);
  $('#btn-telecharger').addEventListener('click', telechargerJournal);
  $('#journal-nom').addEventListener('change', () => ecrireCle(CLE_APPRENANT, { nom: $('#journal-nom').value.trim() }));
  $('#btn-fermer-journal').addEventListener('click', () => {
    const d = $('#journal');
    if (typeof d.close === 'function') d.close();
    else d.removeAttribute('open');
  });

  // ---------------------------------------------------------------------------
  // Les boutons, l'aide, le démarrage.

  $('#btn-executer').addEventListener('click', () => executer());
  $('#btn-tester').addEventListener('click', () => tester());
  $('#btn-reinitialiser').addEventListener('click', () => {
    if (!window.confirm('Revenir au départ de cet exercice ? Votre travail actuel sera perdu (il reste dans votre journal).')) return;
    docs.js.setValue(courant.depart || '');
    docs.html.setValue(courant.html || '');
    $('#entrees').value = texteEntrees(courant.entrees);
    if (aSchema(courant) && editeurSchema) editeurSchema.charger(courant.schemaDepart || { noeuds: [], liens: [] });
    sauver();
    journaliser({ type: 'reinitialisation' });
  });
  $('#btn-aide').addEventListener('click', () => {
    const d = $('#aide');
    if (typeof d.showModal === 'function') d.showModal();
    else d.setAttribute('open', '');
  });
  $('#btn-fermer-aide').addEventListener('click', () => {
    const d = $('#aide');
    if (typeof d.close === 'function') d.close();
    else d.removeAttribute('open');
  });
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && document.activeElement === $('#entrees')) {
      e.preventDefault();
      executer();
    }
  });
  window.addEventListener('hashchange', () => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id && (!courant || id !== courant.id)) choisir(id);
  });

  if (!EXERCICES.length) {
    console.warn('Playground : aucun exercice chargé. Les fichiers de ../exercices/ sont-ils bien à leur place ?');
  }
  remplirChoix();
  const demande = decodeURIComponent(location.hash.slice(1));
  choisir(demande && tous.some((e) => e.id === demande) ? demande : (EXERCICES[0] || BACS[0]).id);

  // Commandes utilisées par les tests automatisés du playground.
  window.playground = {
    exercices: () => tous.map((e) => e.id),
    choisir,
    ecrire(js, html) {
      docs.js.setValue(js);
      if (html !== undefined) docs.html.setValue(html);
    },
    entrees(texte) {
      $('#entrees').value = texte;
    },
    executer,
    tester,
    journal: journalSigne,
    schema: () => editeurSchema,
  };
})();
