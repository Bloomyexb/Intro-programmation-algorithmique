// Chapitre 06 — Les fonctions. Énoncés détaillés et corrigés : 06-Les-fonctions.md

chapitre(6, 'Les fonctions');

exercice({
  id: '6.1',
  titre: 'Pair ?',
  niveau: 1,
  mode: 'fonction',
  fonction: 'estPair',
  enonce: '<p>Écrivez la fonction <code>estPair(n)</code>, qui <strong>retourne</strong> <code>true</code> si <code>n</code> est pair, <code>false</code> sinon.</p>',
  depart: 'function estPair(n) {\n  // Retournez true si n est pair, false sinon.\n}\n\n// Vos essais : Exécuter les affiche.\nconsole.log(estPair(4));\nconsole.log(estPair(7));\n',
  tests: [
    { args: [4], attendu: true },
    { args: [7], attendu: false },
    { args: [0], attendu: true },
    { args: [-3], attendu: false },
    { args: [1000], attendu: true },
  ],
  indices: [
    'Un nombre est pair si n % 2 === 0.',
    'Cette comparaison vaut déjà true ou false : retournez-la directement, return n % 2 === 0;',
  ],
});

exercice({
  id: '6.2',
  titre: 'Le maximum',
  niveau: 1,
  mode: 'fonction',
  fonction: 'maximum',
  enonce: '<p>Écrivez la fonction <code>maximum(a, b)</code>, qui retourne le plus grand des deux nombres, <strong>sans</strong> utiliser <code>Math.max</code>.</p>',
  depart: 'function maximum(a, b) {\n\n}\n\nconsole.log(maximum(3, 9));\n',
  interdit: [{ texte: 'Math.max', message: 'Math.max est interdit ici : écrivez la comparaison vous-même.' }],
  tests: [
    { args: [3, 9], attendu: 9 },
    { args: [-1, -7], attendu: -1 },
    { args: [9, 3], attendu: 9 },
    { args: [5, 5], attendu: 5 },
    { args: [0, -0.5], attendu: 0 },
  ],
  indices: [
    'Si a est plus grand que b, retournez a.',
    'Sinon, retournez b. Le premier return termine la fonction : pas besoin de else.',
  ],
});

exercice({
  id: '6.3',
  titre: 'La mention, en fonction',
  niveau: 2,
  mode: 'fonction',
  fonction: 'mention',
  enonce: '<p>Écrivez la fonction <code>mention(note)</code>, qui <strong>retourne</strong> la mention : <code>"Insuffisant"</code> (moins de 10), <code>"Passable"</code> (moins de 12), <code>"Assez bien"</code> (moins de 14), <code>"Bien"</code> (moins de 16), <code>"Très bien"</code>, ou <code>"Note invalide"</code> hors de 0 à 20.</p>',
  depart: 'function mention(note) {\n\n}\n\nconsole.log(mention(13.5));\n',
  tests: [
    { args: [13.5], attendu: 'Assez bien' },
    { args: [21], attendu: 'Note invalide' },
    { args: [8], attendu: 'Insuffisant' },
    { args: [10], attendu: 'Passable' },
    { args: [12], attendu: 'Assez bien' },
    { args: [14], attendu: 'Bien' },
    { args: [16], attendu: 'Très bien' },
    { args: [20], attendu: 'Très bien' },
    { args: [0], attendu: 'Insuffisant' },
    { args: [-0.5], attendu: 'Note invalide' },
  ],
  indices: [
    'Même logique qu\'à l\'exercice 4.4, mais avec return au lieu de console.log.',
    'Chaque return termine la fonction : une suite de if suffit, sans else.',
  ],
});

exercice({
  id: '6.4',
  titre: 'Les jours de l\'année',
  niveau: 2,
  mode: 'fonction',
  enonce: '<p>Écrivez <code>estBissextile(annee)</code>, qui retourne <code>true</code> si l\'année est bissextile, puis <code>joursDansAnnee(annee)</code>, qui retourne 366 ou 365 <strong>en appelant</strong> <code>estBissextile</code>.</p>' +
    '<p>Rappel : bissextile si divisible par 4 mais pas par 100, ou divisible par 400.</p>',
  depart: 'function estBissextile(annee) {\n\n}\n\nfunction joursDansAnnee(annee) {\n\n}\n\nconsole.log(joursDansAnnee(2024));\n',
  tests: [
    { fonction: 'estBissextile', args: [2024], attendu: true },
    { fonction: 'joursDansAnnee', args: [1900], attendu: 365 },
    { fonction: 'estBissextile', args: [1900], attendu: false },
    { fonction: 'estBissextile', args: [2000], attendu: true },
    { fonction: 'estBissextile', args: [2023], attendu: false },
    { fonction: 'joursDansAnnee', args: [2024], attendu: 366 },
    { fonction: 'joursDansAnnee', args: [2000], attendu: 366 },
    { fonction: 'joursDansAnnee', args: [2023], attendu: 365 },
  ],
  indices: [
    'estBissextile retourne directement la condition de l\'exercice 4.5.',
    'Dans joursDansAnnee : if (estBissextile(annee)) { return 366; } return 365;',
  ],
});

const HTML_TTC = [
  '<!doctype html>',
  '<html lang="fr">',
  '<head>',
  '  <meta charset="utf-8">',
  '  <style>',
  '    body { font-family: system-ui, sans-serif; margin: 1.5rem; }',
  '    input, button { font: inherit; padding: 0.3rem 0.6rem; }',
  '    #resultat { font-size: 1.3rem; font-weight: bold; }',
  '  </style>',
  '</head>',
  '<body>',
  '  <h1>Calcul du prix TTC</h1>',
  '  <label for="prixHT">Prix HT (€)</label>',
  '  <input id="prixHT" type="number" step="0.01">',
  '  <button id="calculer">Calculer</button>',
  '  <p id="resultat"></p>',
  '</body>',
  '</html>',
  '',
].join('\n');

exercice({
  id: '6.5',
  titre: 'La calculatrice de prix TTC',
  niveau: 2,
  mode: 'page',
  enonce: '<p>Quand on clique sur <code>#calculer</code>, le paragraphe <code>#resultat</code> doit afficher le prix TTC du prix HT saisi dans <code>#prixHT</code> (TVA de 20 %), avec deux chiffres après la virgule : <code>Prix TTC : 12.00 €</code>.</p>' +
    '<p><code>nombre.toFixed(2)</code> donne le nombre en texte, arrondi au centime. La page est dans l\'onglet <strong>HTML</strong> ; elle s\'affiche dans l\'onglet <strong>Page</strong> quand vous exécutez.</p>',
  html: HTML_TTC,
  depart: '// 1. Le calcul : reçoit un prix HT, retourne le prix TTC.\nfunction prixTTC(prixHT) {\n\n}\n\n// 2. Appelée au clic : lire le champ, calculer, afficher.\nfunction calculer() {\n\n}\n\n// 3. Relier le bouton à la fonction calculer.\n',
  tests: [
    { nom: 'prix HT de 10', etapes: [['saisir', '#prixHT', '10'], ['cliquer', '#calculer'], ['texte', '#resultat', 'Prix TTC : 12.00 €']] },
    { nom: 'prix HT de 99.9', etapes: [['saisir', '#prixHT', '99.9'], ['cliquer', '#calculer'], ['texte', '#resultat', 'Prix TTC : 119.88 €']] },
    { nom: 'deux calculs de suite', etapes: [['saisir', '#prixHT', '25'], ['cliquer', '#calculer'], ['texte', '#resultat', '30.00 €'], ['saisir', '#prixHT', '0.5'], ['cliquer', '#calculer'], ['texte', '#resultat', '0.60 €']] },
  ],
  indices: [
    'prixTTC retourne prixHT * 1.2.',
    'Dans calculer : Number(document.querySelector("#prixHT").value), puis écrire dans document.querySelector("#resultat").textContent.',
    'Pour relier : document.querySelector("#calculer").addEventListener("click", calculer); — sans parenthèses après calculer.',
  ],
});

exercice({
  id: '6.6',
  titre: 'Le plus grand diviseur commun',
  niveau: 3,
  mode: 'fonction',
  fonction: 'pgcd',
  enonce: '<p>Écrivez <code>pgcd(a, b)</code> avec la méthode d\'Euclide : tant que <code>b</code> n\'est pas nul, remplacer <code>(a, b)</code> par <code>(b, a MOD b)</code> ; quand <code>b</code> vaut 0, le PGCD est <code>a</code>.</p>',
  depart: 'function pgcd(a, b) {\n\n}\n\nconsole.log(pgcd(48, 18));\n',
  tests: [
    { args: [48, 18], attendu: 6 },
    { args: [17, 5], attendu: 1 },
    { args: [100, 75], attendu: 25 },
    { args: [7, 7], attendu: 7 },
    { args: [12, 0], attendu: 12 },
    { args: [18, 48], attendu: 6 },
    { args: [1071, 462], attendu: 21 },
  ],
  indices: [
    'Une boucle while (b !== 0).',
    'Dans la boucle, il faut une variable temporaire : const reste = a % b; puis a = b; puis b = reste;',
    'Après la boucle, retournez a.',
  ],
});

const HTML_DUREE = [
  '<!doctype html>',
  '<html lang="fr">',
  '<head>',
  '  <meta charset="utf-8">',
  '  <style>',
  '    body { font-family: system-ui, sans-serif; margin: 1.5rem; }',
  '    input, button { font: inherit; padding: 0.3rem 0.6rem; }',
  '    #resultat { font-size: 1.3rem; }',
  '  </style>',
  '</head>',
  '<body>',
  '  <h1>Convertisseur de durée</h1>',
  '  <label for="secondes">Durée en secondes</label>',
  '  <input id="secondes" type="number">',
  '  <button id="convertir">Convertir</button>',
  '  <p id="resultat"></p>',
  '</body>',
  '</html>',
  '',
].join('\n');

exercice({
  id: '6.7',
  titre: 'Le convertisseur de durée',
  niveau: 3,
  mode: 'page',
  enonce: '<p>Écrivez <code>formaterDuree(secondes)</code>, qui <strong>retourne</strong> <code>"1 h 2 min 5 s"</code>. Au clic sur <code>#convertir</code>, affichez ce texte dans <code>#resultat</code>, ou <code>Saisissez un nombre de secondes positif.</code> si le champ <code>#secondes</code> est vide ou négatif.</p>',
  html: HTML_DUREE,
  depart: 'function formaterDuree(secondes) {\n\n}\n\nfunction convertir() {\n\n}\n\n',
  tests: [
    { nom: '3725 secondes', etapes: [['saisir', '#secondes', '3725'], ['cliquer', '#convertir'], ['texte', '#resultat', '1 h 2 min 5 s']] },
    { nom: 'champ vide', etapes: [['saisir', '#secondes', ''], ['cliquer', '#convertir'], ['texte', '#resultat', 'Saisissez un nombre de secondes positif.']] },
    { nom: 'durée négative', etapes: [['saisir', '#secondes', '-5'], ['cliquer', '#convertir'], ['texte', '#resultat', 'Saisissez un nombre de secondes positif.']] },
    { nom: 'zéro, puis une journée moins une seconde', etapes: [['saisir', '#secondes', '0'], ['cliquer', '#convertir'], ['texte', '#resultat', '0 h 0 min 0 s'], ['saisir', '#secondes', '86399'], ['cliquer', '#convertir'], ['texte', '#resultat', '23 h 59 min 59 s']] },
  ],
  indices: [
    'formaterDuree reprend les calculs de l\'exercice 3.4, et retourne le texte au lieu de l\'afficher.',
    'Dans convertir, gardez le texte saisi dans une variable : il faut tester s\'il est vide (=== "") avant de le convertir, car Number("") vaut 0.',
    'N\'oubliez pas de relier le bouton : addEventListener("click", convertir).',
  ],
});
