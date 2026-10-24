// Chapitre 04 — Les conditions. Énoncés détaillés et corrigés : 04-Les-conditions.md

chapitre(4, 'Les conditions');

exercice({
  id: '4.1',
  titre: 'Majeur ou mineur',
  niveau: 1,
  enonce: '<p>Lisez un <code>age</code> et affichez <code>majeur</code> s\'il vaut au moins 18, <code>mineur</code> sinon.</p>',
  entrees: { age: 17 },
  depart: 'const age = lire("age");\n\n',
  tests: [
    { entrees: { age: 17 }, sortie: ['mineur'] },
    { entrees: { age: 18 }, sortie: ['majeur'] },
    { entrees: { age: 42 }, sortie: ['majeur'] },
    { entrees: { age: 0 }, sortie: ['mineur'] },
  ],
  indices: [
    'if (condition) { … } else { … } : la condition compare age à 18.',
    '« Au moins 18 » veut dire 18 compris : c\'est >=, pas >.',
  ],
});

exercice({
  id: '4.2',
  titre: 'Pair ou impair',
  niveau: 1,
  enonce: '<p>Lisez un nombre entier <code>n</code> et affichez <code>8 est pair</code> ou <code>7 est impair</code>.</p>',
  entrees: { n: 7 },
  depart: 'const n = lire("n");\n\n',
  tests: [
    { entrees: { n: 8 }, sortie: ['8 est pair'] },
    { entrees: { n: 7 }, sortie: ['7 est impair'] },
    { entrees: { n: 0 }, sortie: ['0 est pair'] },
    { entrees: { n: 1 }, sortie: ['1 est impair'] },
    { entrees: { n: -7 }, sortie: ['-7 est impair'] },
    { entrees: { n: 1000 }, sortie: ['1000 est pair'] },
  ],
  indices: [
    'Un nombre est pair si le reste de sa division par 2 vaut 0. Le reste s\'écrit % en JavaScript.',
    'La condition : n % 2 === 0. Avec trois signes égal.',
    'Attention aux négatifs : -7 % 2 vaut -1 en JavaScript. Tester === 0 marche dans tous les cas, === 1 non.',
  ],
});

exercice({
  id: '4.3',
  titre: 'Le tarif du cinéma',
  niveau: 2,
  enonce: '<p>Lisez un <code>age</code> et un booléen <code>etudiant</code>, et affichez le tarif : moins de 12 ans, <strong>6 €</strong> ; sinon, étudiant ou moins de 18 ans, <strong>8 €</strong> ; sinon, 65 ans ou plus, <strong>7 €</strong> ; sinon <strong>11 €</strong>.</p>',
  entrees: { age: 22, etudiant: true },
  depart: 'const age = lire("age");\nconst etudiant = lire("etudiant");\n\n',
  tests: [
    { entrees: { age: 8, etudiant: false }, sortie: ['Tarif : 6 €'] },
    { entrees: { age: 22, etudiant: true }, sortie: ['Tarif : 8 €'] },
    { entrees: { age: 70, etudiant: false }, sortie: ['Tarif : 7 €'] },
    { entrees: { age: 30, etudiant: false }, sortie: ['Tarif : 11 €'] },
    { entrees: { age: 8, etudiant: true }, sortie: ['Tarif : 6 €'] },
    { entrees: { age: 15, etudiant: false }, sortie: ['Tarif : 8 €'] },
    { entrees: { age: 12, etudiant: false }, sortie: ['Tarif : 8 €'] },
    { entrees: { age: 18, etudiant: false }, sortie: ['Tarif : 11 €'] },
    { entrees: { age: 65, etudiant: false }, sortie: ['Tarif : 7 €'] },
    { entrees: { age: 64, etudiant: false }, sortie: ['Tarif : 11 €'] },
  ],
  indices: [
    'Une suite de if / else if / else, dans l\'ordre de l\'énoncé : la première condition vraie gagne.',
    'Le deuxième cas combine deux conditions avec OU : etudiant || age < 18.',
    'Rangez le tarif dans une variable (let tarif;) et affichez-la une seule fois à la fin.',
  ],
});

exercice({
  id: '4.4',
  titre: 'La mention',
  niveau: 2,
  enonce: '<p>Lisez une <code>note</code> sur 20 et affichez la mention : <code>Insuffisant</code> (moins de 10), <code>Passable</code> (moins de 12), <code>Assez bien</code> (moins de 14), <code>Bien</code> (moins de 16), <code>Très bien</code> (16 et plus). Une note hors de 0 à 20 affiche <code>Note invalide</code>.</p>',
  entrees: { note: 13.5 },
  depart: 'const note = lire("note");\n\n',
  tests: [
    { entrees: { note: 8 }, sortie: ['Insuffisant'] },
    { entrees: { note: 13.5 }, sortie: ['Assez bien'] },
    { entrees: { note: 18 }, sortie: ['Très bien'] },
    { entrees: { note: 9.5 }, sortie: ['Insuffisant'] },
    { entrees: { note: 10 }, sortie: ['Passable'] },
    { entrees: { note: 11.75 }, sortie: ['Passable'] },
    { entrees: { note: 12 }, sortie: ['Assez bien'] },
    { entrees: { note: 14 }, sortie: ['Bien'] },
    { entrees: { note: 16 }, sortie: ['Très bien'] },
    { entrees: { note: 0 }, sortie: ['Insuffisant'] },
    { entrees: { note: 20 }, sortie: ['Très bien'] },
    { entrees: { note: -1 }, sortie: ['Note invalide'] },
    { entrees: { note: 21 }, sortie: ['Note invalide'] },
  ],
  indices: [
    'Écartez d\'abord les notes invalides : note < 0 || note > 20.',
    'Testez ensuite les intervalles dans l\'ordre croissant : note < 10, puis note < 12… Arrivé au deuxième test, on sait déjà que note >= 10.',
    'Si 18 affiche « Passable », c\'est que l\'ordre des tests laisse passer les grandes notes trop tôt.',
  ],
});

exercice({
  id: '4.5',
  titre: 'Année bissextile',
  niveau: 3,
  enonce: '<p>Une année est bissextile si elle est divisible par 4 mais pas par 100, <strong>ou</strong> si elle est divisible par 400. Lisez une <code>annee</code> et affichez <code>2024 est bissextile</code> ou <code>1900 n\'est pas bissextile</code>.</p>',
  entrees: { annee: 2024 },
  depart: 'const annee = lire("annee");\n\n',
  tests: [
    { entrees: { annee: 2024 }, sortie: ['2024 est bissextile'] },
    { entrees: { annee: 1900 }, sortie: ['1900 n\'est pas bissextile'] },
    { entrees: { annee: 2000 }, sortie: ['2000 est bissextile'] },
    { entrees: { annee: 2023 }, sortie: ['2023 n\'est pas bissextile'] },
    { entrees: { annee: 2100 }, sortie: ['2100 n\'est pas bissextile'] },
    { entrees: { annee: 1600 }, sortie: ['1600 est bissextile'] },
    { entrees: { annee: 2028 }, sortie: ['2028 est bissextile'] },
  ],
  indices: [
    '« Divisible par 4 » : annee % 4 === 0. « Pas divisible par 100 » : annee % 100 !== 0.',
    'La règle complète : (divisible par 4 ET pas par 100) OU divisible par 400.',
    'Rangez la condition dans une variable au nom parlant, const bissextile = …, puis if (bissextile).',
  ],
});

exercice({
  id: '4.6',
  titre: 'Le plus grand de trois',
  niveau: 3,
  enonce: '<p>Lisez trois nombres <code>a</code>, <code>b</code> et <code>c</code>, et affichez <code>Le plus grand est 9</code>, <strong>sans utiliser</strong> <code>Math.max</code>.</p>',
  entrees: { a: 3, b: 9, c: 5 },
  depart: 'const a = lire("a");\nconst b = lire("b");\nconst c = lire("c");\n\n',
  interdit: [{ texte: 'Math.max', message: 'Math.max est interdit ici : le but est d\'écrire la comparaison vous-même.' }],
  tests: [
    { entrees: { a: 3, b: 9, c: 5 }, sortie: ['Le plus grand est 9'] },
    { entrees: { a: -4, b: -2, c: -8 }, sortie: ['Le plus grand est -2'] },
    { entrees: { a: 9, b: 3, c: 5 }, sortie: ['Le plus grand est 9'] },
    { entrees: { a: 3, b: 5, c: 9 }, sortie: ['Le plus grand est 9'] },
    { entrees: { a: 7, b: 7, c: 2 }, sortie: ['Le plus grand est 7'] },
    { entrees: { a: 5, b: 5, c: 5 }, sortie: ['Le plus grand est 5'] },
  ],
  indices: [
    'Gardez le plus grand vu jusqu\'ici dans une variable : let max = a;',
    'Comparez b à max : s\'il est plus grand, il le remplace. Puis faites de même avec c.',
    'Deux if indépendants, pas un else if : il faut regarder c même si b a remplacé a.',
  ],
});
