// Chapitre 09 — Récursivité et complexité. Énoncés détaillés et corrigés :
// 09-Recursivite-et-complexite.md

chapitre(9, 'Récursivité et complexité');

exercice({
  id: '9.1',
  titre: 'La somme, récursivement',
  niveau: 1,
  mode: 'fonction',
  fonction: 'sommeJusqua',
  recursif: ['sommeJusqua'],
  enonce: '<p>Écrivez une fonction <strong>récursive</strong> <code>sommeJusqua(n)</code>, qui retourne 1 + 2 + … + n, et 0 pour <code>n</code> inférieur ou égal à 0. Pas de boucle : la fonction s\'appelle elle-même.</p>',
  depart: 'function sommeJusqua(n) {\n  // Cas de base : …\n\n  // Appel récursif : …\n}\n\nconsole.log(sommeJusqua(4));\n',
  tests: [
    { args: [4], attendu: 10 },
    { args: [0], attendu: 0 },
    { args: [1], attendu: 1 },
    { args: [10], attendu: 55 },
    { args: [100], attendu: 5050 },
    { args: [-3], attendu: 0 },
  ],
  indices: [
    'La somme jusqu\'à n, c\'est n plus la somme jusqu\'à n - 1.',
    'Le cas de base : si n <= 0, retournez 0.',
    'L\'appel récursif : return n + sommeJusqua(n - 1);',
  ],
});

exercice({
  id: '9.2',
  titre: 'La puissance',
  niveau: 2,
  mode: 'fonction',
  fonction: 'puissance',
  recursif: ['puissance'],
  enonce: '<p>Écrivez une fonction <strong>récursive</strong> <code>puissance(x, n)</code>, qui retourne <code>x</code> multiplié par lui-même <code>n</code> fois, avec <code>x⁰ = 1</code>. Sans <code>**</code> ni <code>Math.pow</code>.</p>',
  depart: 'function puissance(x, n) {\n\n}\n\nconsole.log(puissance(2, 10));\n',
  interdit: [
    { texte: '**', message: 'L\'opérateur ** est interdit ici : écrivez la puissance vous-même, récursivement.' },
    { texte: 'Math.pow', message: 'Math.pow est interdit ici : écrivez la puissance vous-même, récursivement.' },
  ],
  tests: [
    { args: [2, 10], attendu: 1024 },
    { args: [5, 0], attendu: 1 },
    { args: [3, 1], attendu: 3 },
    { args: [3, 4], attendu: 81 },
    { args: [10, 6], attendu: 1000000 },
    { args: [-2, 3], attendu: -8 },
  ],
  indices: [
    'xⁿ = x × xⁿ⁻¹ : la puissance n se calcule à partir de la puissance n - 1.',
    'Le cas de base : si n === 0, retournez 1.',
    'Seul n diminue d\'un appel à l\'autre : return x * puissance(x, n - 1);',
  ],
});

exercice({
  id: '9.4',
  titre: 'La somme des chiffres',
  niveau: 3,
  mode: 'fonction',
  fonction: 'sommeChiffres',
  recursif: ['sommeChiffres'],
  enonce: '<p>Écrivez une fonction <strong>récursive</strong> <code>sommeChiffres(n)</code>, qui retourne la somme des chiffres d\'un entier positif : <code>1234</code> donne <code>10</code>.</p>',
  depart: 'function sommeChiffres(n) {\n\n}\n\nconsole.log(sommeChiffres(1234));\n',
  tests: [
    { args: [1234], attendu: 10 },
    { args: [7], attendu: 7 },
    { args: [0], attendu: 0 },
    { args: [99], attendu: 18 },
    { args: [1000000], attendu: 1 },
    { args: [98765], attendu: 35 },
  ],
  indices: [
    'Le dernier chiffre de n : n % 10. Les autres chiffres : Math.floor(n / 10).',
    'Un nombre d\'un seul chiffre (n < 10) est sa propre somme : c\'est le cas de base.',
    'Sinon : le dernier chiffre, plus la somme des chiffres des autres.',
  ],
});

exercice({
  id: '9.5',
  titre: 'Fibonacci',
  niveau: 3,
  mode: 'fonction',
  fonction: 'fibonacci',
  recursif: ['fibonacci'],
  enonce: '<p>La suite de Fibonacci : 0, 1, 1, 2, 3, 5, 8, 13… chaque terme est la somme des deux précédents. Écrivez une fonction <strong>récursive</strong> <code>fibonacci(n)</code>, avec <code>fibonacci(0) = 0</code> et <code>fibonacci(1) = 1</code>.</p>',
  depart: 'function fibonacci(n) {\n\n}\n\nconsole.log(fibonacci(7));\n',
  tests: [
    { args: [7], attendu: 13 },
    { args: [20], attendu: 6765 },
    { args: [0], attendu: 0 },
    { args: [1], attendu: 1 },
    { args: [2], attendu: 1 },
    { args: [25], attendu: 75025 },
  ],
  indices: [
    'fibonacci(n) = fibonacci(n - 1) + fibonacci(n - 2).',
    'Deux cas de base, que l\'on peut réunir : si n <= 1, retournez n.',
  ],
});

exercice({
  id: '9.6',
  titre: 'Palindrome',
  niveau: 3,
  mode: 'fonction',
  fonction: 'estPalindrome',
  recursif: ['estPalindrome'],
  enonce: '<p>Écrivez une fonction <strong>récursive</strong> <code>estPalindrome(mot)</code>, qui retourne <code>true</code> si le mot se lit de la même façon dans les deux sens. Un mot vide ou d\'une lettre est un palindrome.</p>' +
    '<p><code>mot[0]</code> : la première lettre ; <code>mot[mot.length - 1]</code> : la dernière ; <code>mot.slice(1, -1)</code> : le mot sans ses deux extrémités.</p>',
  depart: 'function estPalindrome(mot) {\n\n}\n\nconsole.log(estPalindrome("kayak"));\n',
  tests: [
    { args: ['kayak'], attendu: true },
    { args: ['bonjour'], attendu: false },
    { args: [''], attendu: true },
    { args: ['a'], attendu: true },
    { args: ['abba'], attendu: true },
    { args: ['abca'], attendu: false },
    { args: ['été'], attendu: true },
    { args: ['radar'], attendu: true },
    { args: ['ab'], attendu: false },
  ],
  indices: [
    'Cas de base : un mot de 0 ou 1 lettre est un palindrome.',
    'Si la première et la dernière lettre diffèrent, ce n\'est pas un palindrome.',
    'Sinon, la réponse est celle du mot sans ses deux extrémités : return estPalindrome(mot.slice(1, -1));',
  ],
});
