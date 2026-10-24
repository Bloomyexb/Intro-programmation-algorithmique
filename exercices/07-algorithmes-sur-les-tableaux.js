// Chapitre 07 — Algorithmes sur les tableaux. Énoncés détaillés et corrigés :
// 07-Algorithmes-sur-les-tableaux.md

chapitre(7, 'Algorithmes sur les tableaux');

exercice({
  id: '7.1',
  titre: 'La somme',
  niveau: 1,
  mode: 'fonction',
  fonction: 'somme',
  enonce: '<p>Écrivez <code>somme(tableau)</code>, qui retourne la somme des nombres du tableau, et 0 pour un tableau vide. Sans <code>reduce</code>.</p>',
  depart: 'function somme(tableau) {\n\n}\n\nconsole.log(somme([12, 15, 9]));\n',
  interdit: [{ texte: '.reduce(', message: 'reduce() est interdit ici : écrivez la boucle vous-même.' }],
  tests: [
    { args: [[12, 15, 9]], attendu: 36 },
    { args: [[]], attendu: 0 },
    { args: [[5]], attendu: 5 },
    { args: [[-3, 3, 10]], attendu: 10 },
    { args: [[0.5, 0.25, 1]], attendu: 1.75 },
  ],
  indices: [
    'Le patron de l\'accumulateur : let total = 0; avant la boucle.',
    'for (const nombre of tableau) { total = total + nombre; }',
    'Le return va après la boucle.',
  ],
});

exercice({
  id: '7.2',
  titre: 'La moyenne',
  niveau: 1,
  mode: 'fonction',
  fonction: 'moyenne',
  enonce: '<p>Écrivez <code>moyenne(tableau)</code>, qui retourne la moyenne des nombres du tableau, et <strong>0</strong> pour un tableau vide. Sans <code>reduce</code>.</p>',
  depart: 'function moyenne(tableau) {\n\n}\n\nconsole.log(moyenne([12, 15, 9, 14]));\n',
  interdit: [{ texte: '.reduce(', message: 'reduce() est interdit ici : écrivez la boucle vous-même.' }],
  tests: [
    { args: [[12, 15, 9, 14]], attendu: 12.5 },
    { args: [[]], attendu: 0 },
    { args: [[10]], attendu: 10 },
    { args: [[8, 12, 16]], attendu: 12 },
    { args: [[0, 0, 1]], attendu: 1 / 3 },
  ],
  indices: [
    'Moyenne = somme / nombre de valeurs. Vous pouvez réécrire la fonction somme de l\'exercice 7.1 dans ce code, et l\'appeler.',
    'Le nombre de valeurs : tableau.length.',
    'Traitez d\'abord le tableau vide : if (tableau.length === 0) { return 0; }',
  ],
});

exercice({
  id: '7.3',
  titre: 'Le minimum',
  niveau: 2,
  mode: 'fonction',
  fonction: 'minimum',
  enonce: '<p>Écrivez <code>minimum(tableau)</code>, qui retourne le plus petit nombre d\'un tableau non vide. Sans <code>Math.min</code>.</p>',
  depart: 'function minimum(tableau) {\n\n}\n\nconsole.log(minimum([12, 15, 9, 14]));\n',
  interdit: [{ texte: 'Math.min', message: 'Math.min est interdit ici : écrivez le parcours vous-même.' }],
  tests: [
    { args: [[12, 15, 9, 14]], attendu: 9 },
    { args: [[-3, -8, -1]], attendu: -8 },
    { args: [[42]], attendu: 42 },
    { args: [[5, 5, 5]], attendu: 5 },
    { args: [[100, 2, 50, 1]], attendu: 1 },
    { args: [[3, 7, 12]], attendu: 3 },
  ],
  indices: [
    'Le patron du meilleur jusqu\'ici : partez de la première case, let min = tableau[0];',
    'Parcourez les autres cases ; chaque valeur plus petite que min la remplace.',
    'Initialiser min à 0 serait faux : le minimum de [3, 7, 12] est 3, pas 0.',
  ],
});

exercice({
  id: '7.4',
  titre: 'Compter',
  niveau: 2,
  mode: 'fonction',
  fonction: 'compter',
  enonce: '<p>Écrivez <code>compter(tableau, valeur)</code>, qui retourne le nombre de fois où <code>valeur</code> apparaît dans le tableau.</p>',
  depart: 'function compter(tableau, valeur) {\n\n}\n\nconsole.log(compter([1, 2, 1, 3, 1], 1));\n',
  tests: [
    { args: [[1, 2, 1, 3, 1], 1], attendu: 3 },
    { args: [['pomme', 'poire', 'pomme'], 'pomme'], attendu: 2 },
    { args: [['a', 'b'], 'c'], attendu: 0 },
    { args: [[], 5], attendu: 0 },
    { args: [[7, 7, 7], 7], attendu: 3 },
  ],
  indices: [
    'Le patron du compteur : let nombre = 0; avant la boucle.',
    'À chaque case égale à valeur (===), ajoutez 1.',
  ],
});

exercice({
  id: '7.5',
  titre: 'Contient ?',
  niveau: 2,
  mode: 'fonction',
  fonction: 'contient',
  enonce: '<p>Écrivez <code>contient(tableau, valeur)</code>, qui retourne <code>true</code> si <code>valeur</code> est dans le tableau, <code>false</code> sinon. Sans <code>includes</code>, <code>indexOf</code>, <code>some</code> ni <code>find</code>.</p>',
  depart: 'function contient(tableau, valeur) {\n\n}\n\nconsole.log(contient([3, 8, 1], 8));\n',
  interdit: [
    { texte: '.includes(', message: 'includes() est interdit ici : écrivez le parcours vous-même.' },
    { texte: '.indexOf(', message: 'indexOf() est interdit ici : écrivez le parcours vous-même.' },
    { texte: '.some(', message: 'some() est interdit ici : écrivez le parcours vous-même.' },
    { texte: '.find(', message: 'find() est interdit ici : écrivez le parcours vous-même.' },
  ],
  tests: [
    { args: [[3, 8, 1], 8], attendu: true },
    { args: [[3, 8, 1], 5], attendu: false },
    { args: [[3, 8, 1], 3], attendu: true },
    { args: [[3, 8, 1], 1], attendu: true },
    { args: [[], 1], attendu: false },
    { args: [['a', 'b'], 'b'], attendu: true },
  ],
  indices: [
    'Le patron du drapeau : dès qu\'une case est égale à valeur, return true.',
    'Le return false ne peut venir qu\'après avoir tout parcouru : après l\'accolade fermante de la boucle.',
    'Si 3 est trouvé mais pas 8, il y a sans doute un else { return false; } dans la boucle.',
  ],
});

exercice({
  id: '7.6',
  titre: 'Filtrer',
  niveau: 2,
  mode: 'fonction',
  fonction: 'filtrerAuDessus',
  argsInchanges: true,
  enonce: '<p>Écrivez <code>filtrerAuDessus(tableau, seuil)</code>, qui retourne un <strong>nouveau</strong> tableau des valeurs strictement supérieures à <code>seuil</code>, dans le même ordre, sans modifier le tableau reçu. Sans <code>filter</code>.</p>',
  depart: 'function filtrerAuDessus(tableau, seuil) {\n\n}\n\nconsole.log(filtrerAuDessus([12, 8, 15, 10, 9], 10));\n',
  interdit: [{ texte: '.filter(', message: 'filter() est interdit ici : construisez le tableau vous-même.' }],
  tests: [
    { args: [[12, 8, 15, 10, 9], 10], attendu: [12, 15] },
    { args: [[1, 2, 3], 5], attendu: [] },
    { args: [[], 0], attendu: [] },
    { args: [[5, 6], 4], attendu: [5, 6] },
    { args: [[-2, 0, 2], 0], attendu: [2] },
  ],
  indices: [
    'Le patron de la construction : const resultat = []; avant la boucle.',
    'Chaque valeur qui dépasse le seuil s\'ajoute avec resultat.push(valeur).',
    'Strictement supérieures : > et non >=. Avec un seuil de 10, la valeur 10 n\'est pas gardée.',
  ],
});

exercice({
  id: '7.7',
  titre: 'Inverser',
  niveau: 3,
  mode: 'fonction',
  fonction: 'inverser',
  argsInchanges: true,
  enonce: '<p>Écrivez <code>inverser(tableau)</code>, qui retourne un <strong>nouveau</strong> tableau avec les mêmes valeurs dans l\'ordre inverse, sans modifier le tableau reçu. Sans <code>reverse</code>.</p>',
  depart: 'function inverser(tableau) {\n\n}\n\nconsole.log(inverser([1, 2, 3]));\n',
  interdit: [{ texte: '.reverse(', message: 'reverse() est interdit ici, et il modifierait d\'ailleurs le tableau reçu.' }],
  tests: [
    { args: [[1, 2, 3]], attendu: [3, 2, 1] },
    { args: [[]], attendu: [] },
    { args: [['a']], attendu: ['a'] },
    { args: [[1, 2, 3, 4]], attendu: [4, 3, 2, 1] },
    { args: [['x', 'y']], attendu: ['y', 'x'] },
  ],
  indices: [
    'Parcourez le tableau à rebours : de la dernière case (tableau.length - 1) à la première (0).',
    'for (let i = tableau.length - 1; i >= 0; i--), et resultat.push(tableau[i]) à chaque tour.',
  ],
});

exercice({
  id: '7.8',
  titre: 'Trié ?',
  niveau: 3,
  mode: 'fonction',
  fonction: 'estTrie',
  enonce: '<p>Écrivez <code>estTrie(tableau)</code>, qui retourne <code>true</code> si chaque valeur est inférieure ou égale à la suivante, <code>false</code> sinon. Un tableau vide ou d\'une seule case est trié.</p>',
  depart: 'function estTrie(tableau) {\n\n}\n\nconsole.log(estTrie([1, 2, 2, 5]));\n',
  tests: [
    { args: [[1, 2, 2, 5]], attendu: true },
    { args: [[1, 3, 2]], attendu: false },
    { args: [[]], attendu: true },
    { args: [[7]], attendu: true },
    { args: [[5, 4]], attendu: false },
    { args: [[1, 2, 3, 4, 0]], attendu: false },
    { args: [[-5, -1, 0, 3]], attendu: true },
  ],
  indices: [
    'Comparez chaque case à sa voisine de droite : tableau[i] et tableau[i + 1].',
    'Dès qu\'une case est plus grande que sa voisine, le tableau n\'est pas trié : return false.',
    'La dernière case n\'a pas de voisine : la boucle s\'arrête à i < tableau.length - 1.',
  ],
});

exercice({
  id: '7.9',
  titre: 'La monnaie, avec un tableau',
  niveau: 3,
  mode: 'fonction',
  fonction: 'rendreMonnaie',
  enonce: '<p>Écrivez <code>rendreMonnaie(montant)</code>, qui retourne le tableau du nombre de billets et de pièces de chaque coupure, de 20, 10, 5, 2 et 1 €, en en rendant le moins possible.</p>',
  depart: 'function rendreMonnaie(montant) {\n  const coupures = [20, 10, 5, 2, 1];\n\n}\n\nconsole.log(rendreMonnaie(73));\n',
  tests: [
    { args: [73], attendu: [3, 1, 0, 1, 1] },
    { args: [8], attendu: [0, 0, 1, 1, 1] },
    { args: [0], attendu: [0, 0, 0, 0, 0] },
    { args: [199], attendu: [9, 1, 1, 2, 0] },
    { args: [40], attendu: [2, 0, 0, 0, 0] },
  ],
  indices: [
    'Parcourez le tableau coupures. Pour chaque coupure : combien en rendre, et combien reste-t-il ensuite ?',
    'Combien en rendre : Math.floor(reste / coupure). Ce qui reste : reste % coupure.',
    'Construisez le résultat avec push, dans l\'ordre des coupures.',
  ],
});
