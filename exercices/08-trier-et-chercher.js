// Chapitre 08 — Trier et chercher. Énoncés détaillés et corrigés : 08-Trier-et-chercher.md

chapitre(8, 'Trier et chercher', [
  "écrire une recherche linéaire qui retourne une position, ou −1",
  "expliquer pourquoi la dichotomie est si rapide, et à quelle condition elle marche",
  "exécuter à la main une recherche dichotomique",
  "décrire avec mes mots le tri par sélection, le tri à bulles et le tri par insertion",
  "échanger deux cases d'un tableau",
  "trier des nombres avec `sort((a, b) => a - b)`, et expliquer pourquoi `sort()` seul ne suffit pas",
]);

// Un tableau de 50 nombres au hasard, comparé au même tableau trié par JavaScript.
const TRI_AU_HASARD = {
  nom: '50 nombres au hasard',
  verifier: function (f, outils) {
    const t = [];
    for (let i = 0; i < 50; i++) t.push(Math.floor(Math.random() * 1000) - 500);
    const attendu = t.slice().sort((a, b) => a - b);
    const r = f(t.slice());
    if (outils.egal(r, attendu)) return true;
    return 'Un tableau de 50 nombres au hasard n\'est pas correctement trié. Obtenu : ' + outils.formater(r, false).slice(0, 120) + '…';
  },
};

const TESTS_TRI = [
  { args: [[29, 10, 14, 37, 13]], attendu: [10, 13, 14, 29, 37] },
  { args: [[]], attendu: [] },
  { args: [[1]], attendu: [1] },
  { args: [[3, 3, 1]], attendu: [1, 3, 3] },
  { args: [[5, 4, 3, 2, 1]], attendu: [1, 2, 3, 4, 5] },
  { args: [[-2, 7, 0]], attendu: [-2, 0, 7] },
  { args: [[1, 2, 3]], attendu: [1, 2, 3] },
  TRI_AU_HASARD,
];

const INTERDIT_SORT = [{ texte: '.sort(', message: 'sort() est interdit ici : le but est d\'écrire le tri vous-même.' }];

exercice({
  id: '8.1',
  titre: 'La recherche linéaire',
  niveau: 1,
  mode: 'fonction',
  fonction: 'rechercheLineaire',
  enonce: '<p>Écrivez <code>rechercheLineaire(tableau, valeur)</code>, qui retourne l\'indice de la <strong>première</strong> case égale à <code>valeur</code>, ou <code>-1</code> si elle n\'y est pas. Sans <code>indexOf</code>, <code>findIndex</code> ni <code>includes</code>.</p>',
  depart: 'function rechercheLineaire(tableau, valeur) {\n\n}\n\nconsole.log(rechercheLineaire([4, 8, 15, 16], 15));\n',
  interdit: [
    { texte: '.indexOf(', message: 'indexOf() est interdit ici : écrivez le parcours vous-même.' },
    { texte: '.findIndex(', message: 'findIndex() est interdit ici : écrivez le parcours vous-même.' },
    { texte: '.includes(', message: 'includes() est interdit ici : écrivez le parcours vous-même.' },
  ],
  tests: [
    { args: [[4, 8, 15, 16], 15], attendu: 2 },
    { args: [[4, 8, 15, 16], 42], attendu: -1 },
    { args: [[], 1], attendu: -1 },
    { args: [[7, 3, 7], 7], attendu: 0 },
    { args: [['a', 'b'], 'b'], attendu: 1 },
    { args: [[4, 8, 15, 16], 16], attendu: 3 },
  ],
  indices: [
    'On a besoin de la position : un for avec indice, for (let i = 0; i < tableau.length; i++).',
    'Dès que tableau[i] === valeur, retournez i.',
    'Le return -1 vient après la boucle : on n\'est sûr que la valeur est absente qu\'après avoir tout regardé.',
  ],
});

exercice({
  id: '8.2',
  titre: 'La recherche dichotomique',
  niveau: 2,
  mode: 'fonction',
  fonction: 'rechercheDichotomique',
  enonce: '<p>Écrivez <code>rechercheDichotomique(tableau, valeur)</code>, qui cherche <code>valeur</code> dans un tableau <strong>trié</strong> en regardant à chaque tour la case du milieu, et retourne son indice ou <code>-1</code>. Le pseudo-code est dans la section 3 du chapitre.</p>',
  depart: 'function rechercheDichotomique(tableau, valeur) {\n  let debut = 0;\n  let fin = tableau.length - 1;\n\n}\n\nconsole.log(rechercheDichotomique([2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 23));\n',
  interdit: [
    { texte: '.indexOf(', message: 'indexOf() est interdit ici : écrivez la dichotomie vous-même.' },
    { texte: '.includes(', message: 'includes() est interdit ici : écrivez la dichotomie vous-même.' },
    { texte: '.find', message: 'find() et findIndex() sont interdits ici : écrivez la dichotomie vous-même.' },
  ],
  tests: [
    { args: [[2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 23], attendu: 5 },
    { args: [[2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 7], attendu: -1 },
    { args: [[2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 2], attendu: 0 },
    { args: [[2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 91], attendu: 9 },
    { args: [[2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 100], attendu: -1 },
    { args: [[], 3], attendu: -1 },
    { args: [[4], 4], attendu: 0 },
    { args: [[1, 3], 3], attendu: 1 },
    {
      nom: 'une vraie dichotomie, dans un tableau de 1 000 nombres',
      verifier: function (f) {
        const tableau = [];
        for (let i = 0; i < 1000; i++) tableau.push(i * 3);
        let lectures = 0;
        const espion = new Proxy(tableau, {
          get(cible, cle) {
            if (typeof cle === 'string' && /^\d+$/.test(cle)) lectures++;
            return cible[cle];
          },
        });
        for (const cherche of [0, 1500, 2997, 1501, 777]) {
          lectures = 0;
          const r = f(espion, cherche);
          const attendu = cherche % 3 === 0 ? cherche / 3 : -1;
          if (r !== attendu) return 'Dans un tableau trié de 1 000 nombres, la recherche de ' + cherche + ' retourne ' + r + ' au lieu de ' + attendu + '.';
          if (lectures > 30) {
            return 'Pour chercher ' + cherche + ' dans un tableau trié de 1 000 nombres, votre fonction a lu ' + lectures +
              ' cases. Une dichotomie en lit une vingtaine au plus : à chaque tour, elle élimine la moitié de la zone.';
          }
        }
        return true;
      },
    },
  ],
  indices: [
    'Tant que debut <= fin : calculez le milieu, const milieu = Math.floor((debut + fin) / 2);',
    'Trois cas : tableau[milieu] est la valeur (retournez milieu), plus petit (debut = milieu + 1), plus grand (fin = milieu - 1).',
    'Si la boucle se termine sans avoir trouvé, retournez -1.',
  ],
});

exercice({
  id: '8.3',
  titre: 'Le tri par sélection',
  niveau: 2,
  mode: 'fonction',
  fonction: 'triSelection',
  enonce: '<p>Écrivez <code>triSelection(tableau)</code>, qui trie le tableau dans l\'ordre croissant et le retourne : à chaque tour, chercher le plus petit de ce qui reste et l\'échanger avec la première case non triée. Sans <code>sort</code>.</p>',
  depart: 'function triSelection(tableau) {\n\n  return tableau;\n}\n\nconsole.log(triSelection([29, 10, 14, 37, 13]));\n',
  interdit: INTERDIT_SORT,
  tests: TESTS_TRI,
  indices: [
    'Deux boucles : i parcourt les positions à remplir, de 0 à tableau.length - 2.',
    'Pour chaque i : let iMin = i; puis une boucle j de i + 1 à la fin, qui retient dans iMin la position du plus petit.',
    'Puis échangez tableau[i] et tableau[iMin] avec une variable temporaire.',
  ],
});

exercice({
  id: '8.4',
  titre: 'Le tri à bulles',
  niveau: 2,
  mode: 'fonction',
  fonction: 'triBulles',
  enonce: '<p>Écrivez <code>triBulles(tableau)</code>, qui trie le tableau dans l\'ordre croissant et le retourne : parcourir le tableau en échangeant chaque paire de voisins mal rangés, et recommencer. Sans <code>sort</code>.</p>',
  depart: 'function triBulles(tableau) {\n\n  return tableau;\n}\n\nconsole.log(triBulles([5, 1, 4, 2, 8]));\n',
  interdit: INTERDIT_SORT,
  tests: [{ args: [[5, 1, 4, 2, 8]], attendu: [1, 2, 4, 5, 8] }].concat(TESTS_TRI.slice(1)),
  indices: [
    'Une boucle de passages, et dans chaque passage, une boucle sur les voisins : tableau[i] et tableau[i + 1].',
    'Si tableau[i] > tableau[i + 1], échangez-les.',
    'Pour que tableau[i + 1] existe, la boucle intérieure s\'arrête à i < tableau.length - 1 (ou - 1 - passe).',
  ],
});

exercice({
  id: '8.5',
  titre: 'Trier des nombres avec sort()',
  niveau: 1,
  mode: 'fonction',
  fonction: 'trierNombres',
  enonce: '<p>Écrivez <code>trierNombres(tableau)</code>, qui retourne le tableau trié dans l\'ordre croissant, en utilisant <code>sort()</code> correctement.</p>',
  depart: 'function trierNombres(tableau) {\n\n}\n\nconsole.log(trierNombres([10, 9, 1, 100]));\n',
  tests: [
    { args: [[10, 9, 1, 100]], attendu: [1, 9, 10, 100] },
    { args: [[3, -1, 2]], attendu: [-1, 2, 3] },
    { args: [[]], attendu: [] },
    { args: [[25, 3, 200, 1000, 7]], attendu: [3, 7, 25, 200, 1000] },
  ],
  indices: [
    'tableau.sort() seul compare comme du texte : [10, 9, 1].sort() donne [1, 10, 9].',
    'Donnez-lui une fonction de comparaison : tableau.sort((a, b) => a - b), et retournez le résultat.',
  ],
});

exercice({
  id: '8.6',
  titre: 'Le tri par insertion',
  niveau: 3,
  mode: 'fonction',
  fonction: 'triInsertion',
  enonce: '<p>Écrivez <code>triInsertion(tableau)</code>, qui trie le tableau dans l\'ordre croissant et le retourne : prendre chaque case à partir de la deuxième, et la faire glisser vers la gauche jusqu\'à sa place, comme une carte dans sa main. Sans <code>sort</code>.</p>',
  depart: 'function triInsertion(tableau) {\n\n  return tableau;\n}\n\nconsole.log(triInsertion([29, 10, 14, 37, 13]));\n',
  interdit: INTERDIT_SORT,
  tests: TESTS_TRI,
  indices: [
    'Pour chaque i à partir de 1 : const carte = tableau[i]; let j = i - 1;',
    'Tant que j >= 0 et que tableau[j] > carte : décalez tableau[j] d\'un cran à droite (tableau[j + 1] = tableau[j]) et reculez j.',
    'À la sortie du while, posez la carte dans le trou : tableau[j + 1] = carte;',
  ],
});
