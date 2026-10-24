// Chapitre 10 — Mini-projet : le nombre mystère. Énoncés détaillés et corrigés :
// 10-Mini-projet-le-nombre-mystere.md

chapitre(10, 'Mini-projet : le nombre mystère');

const STYLE_JEU = [
  '  <style>',
  '    body { font-family: system-ui, sans-serif; margin: 1.5rem; max-width: 34rem; }',
  '    input, button { font: inherit; padding: 0.3rem 0.6rem; }',
  '    #message { font-size: 1.3rem; font-weight: bold; min-height: 1.5em; }',
  '  </style>',
];

const HTML_JEU_V1 = ['<!doctype html>', '<html lang="fr">', '<head>', '  <meta charset="utf-8">'].concat(STYLE_JEU, [
  '</head>',
  '<body>',
  '  <h1>Le nombre mystère</h1>',
  '  <p>J\'ai choisi un nombre entre 1 et 100. À vous de le trouver !</p>',
  '  <label for="proposition">Votre proposition</label>',
  '  <input id="proposition" type="number" min="1" max="100">',
  '  <button id="valider">Valider</button>',
  '  <p id="message"></p>',
  '  <p id="essais">Essais : 0</p>',
  '</body>',
  '</html>',
  '',
]).join('\n');

const HTML_JEU_V2 = ['<!doctype html>', '<html lang="fr">', '<head>', '  <meta charset="utf-8">'].concat(STYLE_JEU, [
  '</head>',
  '<body>',
  '  <h1>Le nombre mystère</h1>',
  '  <p>J\'ai choisi un nombre entre 1 et 100. À vous de le trouver !</p>',
  '  <label for="proposition">Votre proposition</label>',
  '  <input id="proposition" type="number" min="1" max="100">',
  '  <button id="valider">Valider</button>',
  '  <p id="message"></p>',
  '  <p id="essais">Essais : 0</p>',
  '  <p>Propositions : <span id="historique"></span></p>',
  '  <p id="record">Meilleur score : aucun</p>',
  '  <button id="rejouer">Nouvelle partie</button>',
  '</body>',
  '</html>',
  '',
]).join('\n');

const HTML_JEU_V3 = ['<!doctype html>', '<html lang="fr">', '<head>', '  <meta charset="utf-8">'].concat(STYLE_JEU, [
  '</head>',
  '<body>',
  '  <h1>L\'ordinateur devine</h1>',
  '  <p>Pensez à un nombre entre 1 et 100 : l\'ordinateur va le trouver.</p>',
  '  <p id="proposition"></p>',
  '  <button id="plusPetit">C\'est plus petit</button>',
  '  <button id="plusGrand">C\'est plus grand</button>',
  '  <button id="trouve">Trouvé !</button>',
  '  <p id="message"></p>',
  '</body>',
  '</html>',
  '',
]).join('\n');

const COMPARER_FOURNI = 'function comparer(proposition, secret) {\n  if (proposition < secret) {\n    return "trop petit";\n  }\n  if (proposition > secret) {\n    return "trop grand";\n  }\n  return "gagné";\n}\n';

exercice({
  id: '10.1',
  titre: 'Comparer',
  niveau: 1,
  mode: 'fonction',
  fonction: 'comparer',
  enonce: '<p>Écrivez <code>comparer(proposition, secret)</code>, qui retourne <code>"trop petit"</code>, <code>"trop grand"</code> ou <code>"gagné"</code>.</p>',
  depart: 'function comparer(proposition, secret) {\n\n}\n\nconsole.log(comparer(20, 43));\n',
  tests: [
    { args: [20, 43], attendu: 'trop petit' },
    { args: [50, 43], attendu: 'trop grand' },
    { args: [43, 43], attendu: 'gagné' },
    { args: [42, 43], attendu: 'trop petit' },
    { args: [44, 43], attendu: 'trop grand' },
    { args: [1, 1], attendu: 'gagné' },
  ],
  indices: [
    'Trois cas, trois return : proposition < secret, proposition > secret, et sinon c\'est gagné.',
    'Attention à l\'orthographe exacte des textes retournés : "trop petit", "trop grand", "gagné".',
  ],
});

exercice({
  id: '10.2',
  titre: 'Tirer un nombre au hasard',
  niveau: 1,
  mode: 'fonction',
  fonction: 'tirerNombre',
  enonce: '<p>Écrivez <code>tirerNombre(min, max)</code>, qui retourne un entier au hasard entre <code>min</code> et <code>max</code>, <strong>bornes comprises</strong>. <code>Math.random()</code> retourne un nombre de 0 (compris) à 1 (exclu).</p>',
  depart: 'function tirerNombre(min, max) {\n\n}\n\nconsole.log(tirerNombre(1, 100));\nconsole.log(tirerNombre(1, 100));\nconsole.log(tirerNombre(1, 100));\n',
  tests: [
    { nom: 'Math.random() vaut 0 : le plus petit nombre', fonction: 'tirerNombre', args: [1, 100], attendu: 1, hasard: [0] },
    { nom: 'Math.random() vaut 0.9999 : le plus grand nombre', fonction: 'tirerNombre', args: [1, 100], attendu: 100, hasard: [0.9999] },
    { nom: 'Math.random() vaut 0.42 : 43', fonction: 'tirerNombre', args: [1, 100], attendu: 43, hasard: [0.42] },
    { nom: 'Math.random() vaut 0.5, entre 10 et 20 : 15', fonction: 'tirerNombre', args: [10, 20], attendu: 15, hasard: [0.5] },
    {
      nom: '5 000 tirages entre 1 et 6 : toujours un entier de 1 à 6, et chaque valeur sort',
      verifier: function (f) {
        const vus = {};
        for (let i = 0; i < 5000; i++) {
          const n = f(1, 6);
          if (!Number.isInteger(n)) return 'tirerNombre(1, 6) a retourné ' + n + ' : ce n\'est pas un entier. Pensez à Math.floor.';
          if (n < 1 || n > 6) return 'tirerNombre(1, 6) a retourné ' + n + ', en dehors des bornes.';
          vus[n] = true;
        }
        for (let v = 1; v <= 6; v++) {
          if (!vus[v]) return 'Sur 5 000 tirages, tirerNombre(1, 6) n\'a jamais retourné ' + v + ' : une borne est sans doute exclue.';
        }
        return true;
      },
    },
    { nom: 'tirerNombre(5, 5) retourne toujours 5', verifier: function (f) { for (let i = 0; i < 100; i++) { if (f(5, 5) !== 5) return 'tirerNombre(5, 5) devrait toujours retourner 5.'; } return true; } },
  ],
  indices: [
    'Entre min et max, il y a max - min + 1 valeurs possibles.',
    'Math.random() * (max - min + 1) donne un nombre de 0 à (max - min + 1) exclu ; Math.floor en fait un entier.',
    'Il reste à décaler le résultat de min : … + min.',
  ],
});

exercice({
  id: '10.3',
  titre: 'La page du jeu (v1)',
  niveau: 2,
  mode: 'page',
  enonce: '<p>Recopiez vos fonctions <code>comparer</code> et <code>tirerNombre</code>, puis faites fonctionner le jeu. Au chargement, le secret est tiré avec <code>tirerNombre(1, 100)</code>. À chaque clic sur <code>#valider</code> : <code>#essais</code> affiche <code>Essais : 3</code> ; <code>#message</code> affiche <code>50 : trop grand</code>, ou <code>Gagné ! Le nombre était 43.</code></p>' +
    '<p>Les tests fixent le hasard : <code>Math.random()</code> y vaut 0.42, donc le secret vaut 43.</p>',
  html: HTML_JEU_V1,
  depart: '// Recopiez ici vos fonctions comparer et tirerNombre (étapes 10.1 et 10.2).\n\n\n// L\'état du jeu : le secret et le nombre d\'essais.\n\n\n// Appelée à chaque clic sur Valider.\nfunction valider() {\n\n}\n\ndocument.querySelector("#valider").addEventListener("click", valider);\n',
  tests: [
    {
      nom: 'une partie complète (secret : 43)',
      hasard: [0.42],
      etapes: [
        ['saisir', '#proposition', '50'], ['cliquer', '#valider'], ['texte', '#message', '50 : trop grand'], ['texte', '#essais', 'Essais : 1'],
        ['saisir', '#proposition', '20'], ['cliquer', '#valider'], ['texte', '#message', '20 : trop petit'], ['texte', '#essais', 'Essais : 2'],
        ['saisir', '#proposition', '43'], ['cliquer', '#valider'], ['texte', '#message', 'Gagné ! Le nombre était 43.'], ['texte', '#essais', 'Essais : 3'],
      ],
    },
    {
      nom: 'gagné du premier coup (secret : 100)',
      hasard: [0.9999],
      etapes: [['saisir', '#proposition', '100'], ['cliquer', '#valider'], ['texte', '#message', 'Gagné ! Le nombre était 100.'], ['texte', '#essais', 'Essais : 1']],
    },
    {
      nom: 'le secret ne change pas entre deux propositions',
      hasard: [0.42, 0.9999, 0.01],
      etapes: [['saisir', '#proposition', '60'], ['cliquer', '#valider'], ['saisir', '#proposition', '43'], ['cliquer', '#valider'], ['texte', '#message', 'Gagné']],
    },
  ],
  indices: [
    'Déclarez let secret = tirerNombre(1, 100); et let essais = 0; en dehors de valider : elles doivent survivre d\'un clic à l\'autre.',
    'Dans valider : lire le champ avec Number(…value), essais++, puis const resultat = comparer(proposition, secret);',
    'Si resultat === "gagné", affichez le message de victoire ; sinon proposition + " : " + resultat. Dans les deux cas, mettez #essais à jour.',
  ],
});

exercice({
  id: '10.4',
  titre: 'Un jeu plus complet (v2)',
  niveau: 2,
  mode: 'page',
  enonce: '<p>Partez de votre version 1, et ajoutez : l\'<strong>historique</strong> des propositions dans <code>#historique</code> (<code>50, 20, 43</code>, avec <code>historique.join(", ")</code>) ; la <strong>nouvelle partie</strong> au clic sur <code>#rejouer</code> (nouveau secret, essais à 0, historique vidé, message effacé) ; le <strong>meilleur score</strong> dans <code>#record</code> : <code>Meilleur score : 3</code>.</p>' +
    '<p>Les tests fixent le hasard : premier secret 43, puis 8. Tirez le secret avec <code>tirerNombre(1, 100)</code> au chargement et à chaque nouvelle partie.</p>',
  html: HTML_JEU_V2,
  depart: '// Recopiez ici votre version 1, puis ajoutez l\'historique, la nouvelle partie et le meilleur score.\n// Conseil : une fonction nouvellePartie() qui remet tout l\'état à zéro,\n// appelée au chargement et au clic sur #rejouer.\n\n',
  tests: [
    {
      nom: 'l\'historique des propositions',
      hasard: [0.42, 0.07],
      etapes: [['saisir', '#proposition', '50'], ['cliquer', '#valider'], ['saisir', '#proposition', '20'], ['cliquer', '#valider'], ['texte', '#historique', '50, 20'], ['texte', '#message', '20 : trop petit']],
    },
    {
      nom: 'gagner, établir un record, rejouer et le battre',
      hasard: [0.42, 0.07],
      etapes: [
        ['saisir', '#proposition', '50'], ['cliquer', '#valider'], ['saisir', '#proposition', '20'], ['cliquer', '#valider'],
        ['saisir', '#proposition', '43'], ['cliquer', '#valider'], ['texte', '#message', 'Gagné'], ['texte', '#record', 'Meilleur score : 3'],
        ['cliquer', '#rejouer'], ['texte', '#essais', 'Essais : 0'], ['vide', '#historique'], ['vide', '#message'],
        ['saisir', '#proposition', '8'], ['cliquer', '#valider'], ['texte', '#message', 'Le nombre était 8'], ['texte', '#record', 'Meilleur score : 1'],
      ],
    },
    {
      nom: 'un moins bon score ne remplace pas le record',
      hasard: [0.42, 0.42],
      etapes: [
        ['saisir', '#proposition', '43'], ['cliquer', '#valider'], ['texte', '#record', 'Meilleur score : 1'],
        ['cliquer', '#rejouer'], ['saisir', '#proposition', '50'], ['cliquer', '#valider'], ['saisir', '#proposition', '43'], ['cliquer', '#valider'],
        ['texte', '#message', 'Gagné'], ['texte', '#record', 'Meilleur score : 1'],
      ],
    },
  ],
  indices: [
    'L\'historique est un tableau : let historique = []; puis historique.push(proposition) à chaque clic, et historique.join(", ") pour l\'afficher.',
    'Une fonction nouvellePartie() qui tire le secret, remet essais à 0, vide l\'historique et efface le message. Appelez-la au chargement, et reliez-la au bouton #rejouer.',
    'Le record part de null (pas encore de partie gagnée). À la victoire : if (record === null || essais < record) { record = essais; … }',
  ],
});

exercice({
  id: '10.5',
  titre: 'La stratégie de l\'ordinateur (v3)',
  niveau: 3,
  mode: 'fonction',
  fonction: 'devinerParDichotomie',
  enonce: '<p>Écrivez <code>devinerParDichotomie(secret, min, max)</code> : l\'ordinateur propose le milieu <code>Math.floor((min + max) / 2)</code>, interroge <code>comparer</code>, resserre l\'intervalle, et recommence jusqu\'à gagner. La fonction retourne le <strong>tableau des propositions</strong>. La fonction <code>comparer</code> est fournie.</p>',
  depart: COMPARER_FOURNI + '\nfunction devinerParDichotomie(secret, min, max) {\n  const propositions = [];\n\n  return propositions;\n}\n\nconsole.log(devinerParDichotomie(43, 1, 100));\n',
  tests: [
    { args: [43, 1, 100], attendu: [50, 25, 37, 43] },
    { args: [50, 1, 100], attendu: [50] },
    { args: [1, 1, 100], attendu: [50, 25, 12, 6, 3, 1] },
    { args: [100, 1, 100], attendu: [50, 75, 88, 94, 97, 99, 100] },
    { args: [7, 1, 10], attendu: [5, 8, 6, 7] },
    {
      nom: 'tous les secrets de 1 à 100, en 7 propositions au plus',
      verifier: function (f) {
        for (let secret = 1; secret <= 100; secret++) {
          const p = f(secret, 1, 100);
          if (!Array.isArray(p)) return 'La fonction doit retourner le tableau des propositions de l\'ordinateur.';
          if (p[p.length - 1] !== secret) return 'Pour le secret ' + secret + ', la dernière proposition est ' + p[p.length - 1] + ' : ce devrait être le secret.';
          if (p.length > 7) return 'Pour le secret ' + secret + ', l\'ordinateur a fait ' + p.length + ' propositions ; par dichotomie, 7 suffisent toujours entre 1 et 100.';
        }
        return true;
      },
    },
  ],
  indices: [
    'Une boucle while qui continue tant que le résultat n\'est pas "gagné".',
    'À chaque tour : calculer le milieu, l\'ajouter au tableau avec push, puis appeler comparer(proposition, secret).',
    '"trop petit" : min = proposition + 1. "trop grand" : max = proposition - 1.',
  ],
});

exercice({
  id: '10.6',
  titre: 'La page où l\'ordinateur devine (v3)',
  niveau: 3,
  mode: 'page',
  enonce: '<p>Le joueur pense à un nombre ; l\'ordinateur propose dans <code>#proposition</code> (<code>Je propose : 50</code>), le joueur répond avec <code>#plusPetit</code>, <code>#plusGrand</code> ou <code>#trouve</code>. <code>#trouve</code> affiche dans <code>#message</code> : <code>J\'ai trouvé en 7 essais !</code>. Si l\'intervalle devient vide (<code>min > max</code>), <code>#message</code> affiche <code>Vous avez triché !</code></p>' +
    '<p>Milieu : <code>Math.floor((min + max) / 2)</code>.</p>',
  html: HTML_JEU_V3,
  depart: '// L\'état : l\'intervalle encore possible, la dernière proposition, le nombre d\'essais.\nlet min = 1;\nlet max = 100;\n\n// Proposer le milieu de l\'intervalle (ou dénoncer la triche).\nfunction proposer() {\n\n}\n\n',
  tests: [
    {
      nom: 'le joueur pense à 70',
      etapes: [
        ['texte', '#proposition', 'Je propose : 50'], ['cliquer', '#plusGrand'],
        ['texte', '#proposition', 'Je propose : 75'], ['cliquer', '#plusPetit'],
        ['texte', '#proposition', 'Je propose : 62'], ['cliquer', '#plusGrand'],
        ['texte', '#proposition', 'Je propose : 68'], ['cliquer', '#plusGrand'],
        ['texte', '#proposition', 'Je propose : 71'], ['cliquer', '#plusPetit'],
        ['texte', '#proposition', 'Je propose : 69'], ['cliquer', '#plusGrand'],
        ['texte', '#proposition', 'Je propose : 70'], ['cliquer', '#trouve'],
        ['texte', '#message', 'J\'ai trouvé en 7 essais !'],
      ],
    },
    {
      nom: 'trouvé du premier coup',
      etapes: [['texte', '#proposition', 'Je propose : 50'], ['cliquer', '#trouve'], ['texte', '#message', 'J\'ai trouvé en 1 essai']],
    },
    {
      nom: 'le joueur triche',
      etapes: [
        ['cliquer', '#plusPetit'], ['cliquer', '#plusPetit'], ['cliquer', '#plusPetit'], ['cliquer', '#plusPetit'], ['cliquer', '#plusPetit'],
        ['texte', '#proposition', 'Je propose : 1'], ['cliquer', '#plusPetit'], ['texte', '#message', 'Vous avez triché !'],
      ],
    },
  ],
  indices: [
    'proposer() calcule le milieu, le range dans une variable proposition (déclarée en dehors), augmente les essais et l\'affiche. Appelez-la une fois au chargement.',
    '#plusGrand : min = proposition + 1, puis proposer(). #plusPetit : max = proposition - 1, puis proposer().',
    'Dans proposer, avant de calculer : si min > max, affichez « Vous avez triché ! » et arrêtez-vous (return).',
  ],
});
