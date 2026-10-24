// Chapitre 05 — Les boucles. Énoncés détaillés et corrigés : 05-Les-boucles.md

chapitre(5, 'Les boucles', [
  "choisir entre `while`, `for` et `do … while` selon la situation",
  "écrire les trois parties d'un `for`",
  "utiliser un compteur et un accumulateur, initialisés avant la boucle",
  "faire le tableau de suivi d'une boucle sur quelques tours",
  "vérifier qu'une boucle s'arrête, et repérer une boucle infinie",
  "traiter une suite de valeurs terminée par une sentinelle",
  "imbriquer deux boucles",
]);

const FIZZBUZZ_15 = ['1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz', '11', 'Fizz', '13', '14', 'FizzBuzz'];

exercice({
  id: '5.1',
  titre: 'Compte à rebours',
  niveau: 1,
  enonce: '<p>Lisez un entier <code>n</code>, affichez les nombres de <code>n</code> à 1, un par ligne, puis <code>Décollage !</code></p>',
  entrees: { n: 3 },
  depart: 'const n = lire("n");\n\n',
  tests: [
    { entrees: { n: 3 }, sortie: ['3', '2', '1', 'Décollage !'] },
    { entrees: { n: 0 }, sortie: ['Décollage !'] },
    { entrees: { n: 1 }, sortie: ['1', 'Décollage !'] },
    { entrees: { n: 10 }, sortie: ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1', 'Décollage !'] },
  ],
  indices: [
    'Une boucle for qui part de n et descend : for (let i = n; i >= 1; i--).',
    '« Décollage ! » s\'affiche une seule fois : après l\'accolade fermante de la boucle.',
  ],
});

exercice({
  id: '5.2',
  titre: 'La table de multiplication',
  niveau: 1,
  enonce: '<p>Lisez un entier <code>n</code> et affichez sa table de multiplication de 1 à 10 : <code>7 x 1 = 7</code>, <code>7 x 2 = 14</code>… jusqu\'à <code>7 x 10 = 70</code>.</p>',
  entrees: { n: 7 },
  depart: 'const n = lire("n");\n\n',
  tests: [
    { entrees: { n: 7 }, sortie: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => '7 x ' + i + ' = ' + 7 * i) },
    { entrees: { n: 3 }, sortie: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => '3 x ' + i + ' = ' + 3 * i) },
    { entrees: { n: 12 }, sortie: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => '12 x ' + i + ' = ' + 12 * i) },
  ],
  indices: [
    'Dix lignes, on le sait d\'avance : une boucle for (let i = 1; i <= 10; i++).',
    'Chaque ligne : n + " x " + i + " = " + n * i',
  ],
});

exercice({
  id: '5.3',
  titre: 'La somme de 1 à n',
  niveau: 2,
  enonce: '<p>Lisez un entier <code>n</code> et affichez la somme 1 + 2 + … + n, sous la forme <code>Somme : 55</code>.</p>',
  entrees: { n: 10 },
  depart: 'const n = lire("n");\n\n',
  interdit: [{ texte: '/ 2', message: 'La formule de Gauss est astucieuse, mais l\'exercice demande une boucle avec un accumulateur.' }],
  tests: [
    { entrees: { n: 10 }, sortie: ['Somme : 55'] },
    { entrees: { n: 100 }, sortie: ['Somme : 5050'] },
    { entrees: { n: 0 }, sortie: ['Somme : 0'] },
    { entrees: { n: 1 }, sortie: ['Somme : 1'] },
    { entrees: { n: 4 }, sortie: ['Somme : 10'] },
  ],
  indices: [
    'Un accumulateur : let somme = 0; avant la boucle.',
    'À chaque tour, ajoutez le compteur : somme = somme + i;',
    'Une seule ligne affichée : le console.log va après la boucle, pas dedans.',
  ],
});

exercice({
  id: '5.4',
  titre: 'La saisie contrôlée',
  niveau: 2,
  enonce: '<p>Lisez une <code>note</code> ; tant qu\'elle n\'est pas entre 0 et 20, affichez <code>Note invalide : 25</code> et lisez-en une autre. Une fois une note valide obtenue, affichez <code>Note enregistrée : 12</code>.</p>' +
    '<p>Dans les Entrées, <code>note = 25, -3, 12</code> fournit trois saisies : chaque <code>lire("note")</code> donne la suivante.</p>',
  entrees: { note: [25, -3, 12] },
  depart: 'let note;\n\n',
  tests: [
    { entrees: { note: [25, -3, 12] }, sortie: ['Note invalide : 25', 'Note invalide : -3', 'Note enregistrée : 12'] },
    { entrees: { note: [15] }, sortie: ['Note enregistrée : 15'] },
    { entrees: { note: [20] }, sortie: ['Note enregistrée : 20'] },
    { entrees: { note: [21, 0] }, sortie: ['Note invalide : 21', 'Note enregistrée : 0'] },
    { entrees: { note: [-1, 100, 30, 19.5] }, sortie: ['Note invalide : -1', 'Note invalide : 100', 'Note invalide : 30', 'Note enregistrée : 19.5'] },
  ],
  indices: [
    'On lit au moins une fois, puis on recommence si c\'est invalide : do { … } while (…);',
    'Dans la boucle : lire la note, puis si elle est invalide, afficher le message.',
    'La condition du while est celle pour recommencer : note < 0 || note > 20.',
  ],
});

exercice({
  id: '5.5',
  titre: 'La moyenne, jusqu\'à −1',
  niveau: 2,
  enonce: '<p>Lisez des notes l\'une après l\'autre avec <code>lire("note")</code> ; la valeur <code>-1</code> signale la fin. Affichez <code>Nombre de notes : 4</code> puis <code>Moyenne : 12.5</code>, ou <code>Aucune note</code> si la première valeur est déjà -1.</p>',
  entrees: { note: [12, 15, 9, 14, -1] },
  depart: 'let somme = 0;\nlet nombre = 0;\n\n',
  tests: [
    { entrees: { note: [12, 15, 9, 14, -1] }, sortie: ['Nombre de notes : 4', 'Moyenne : 12.5'] },
    { entrees: { note: [-1] }, sortie: ['Aucune note'] },
    { entrees: { note: [10, -1] }, sortie: ['Nombre de notes : 1', 'Moyenne : 10'] },
    { entrees: { note: [8, 12, 16, -1] }, sortie: ['Nombre de notes : 3', 'Moyenne : 12'] },
    { entrees: { note: [11, 12, -1] }, sortie: ['Nombre de notes : 2', 'Moyenne : 11.5'] },
  ],
  indices: [
    'Lisez une première note avant la boucle. Tant qu\'elle ne vaut pas -1 : on la compte, on l\'ajoute, et on lit la suivante.',
    'La lecture suivante se fait à la fin du corps de la boucle : ainsi, -1 n\'entre jamais dans la somme.',
    'Après la boucle, si nombre vaut 0, il n\'y a pas de moyenne à calculer.',
  ],
});

exercice({
  id: '5.6',
  titre: 'FizzBuzz',
  niveau: 2,
  enonce: '<p>Lisez un entier <code>n</code>. Pour chaque nombre de 1 à <code>n</code>, affichez <code>FizzBuzz</code> s\'il est divisible par 3 et par 5, sinon <code>Fizz</code> s\'il est divisible par 3, sinon <code>Buzz</code> s\'il est divisible par 5, sinon le nombre lui-même.</p>',
  entrees: { n: 15 },
  depart: 'const n = lire("n");\n\n',
  tests: [
    { entrees: { n: 15 }, sortie: FIZZBUZZ_15 },
    { entrees: { n: 5 }, sortie: FIZZBUZZ_15.slice(0, 5) },
    { entrees: { n: 1 }, sortie: ['1'] },
    { entrees: { n: 30 }, sortie: FIZZBUZZ_15.concat(['16', '17', 'Fizz', '19', 'Buzz', 'Fizz', '22', '23', 'Fizz', 'Buzz', '26', 'Fizz', '28', '29', 'FizzBuzz']) },
  ],
  indices: [
    'Une boucle de 1 à n, et dans la boucle une suite de if / else if / else.',
    '« Divisible par 3 » : i % 3 === 0.',
    'Si 15 affiche « Fizz », c\'est que le cas « divisible par 3 et par 5 » est testé trop tard : il doit passer en premier.',
  ],
});

exercice({
  id: '5.7',
  titre: 'Le triangle d\'étoiles',
  niveau: 3,
  enonce: '<p>Lisez un entier <code>n</code> et affichez un triangle de <code>n</code> lignes : <code>*</code>, puis <code>**</code>, puis <code>***</code>… sans utiliser <code>repeat</code>.</p>',
  entrees: { n: 4 },
  depart: 'const n = lire("n");\n\n',
  interdit: [{ texte: '.repeat(', message: 'repeat() est interdit ici : construisez chaque ligne avec une boucle.' }],
  tests: [
    { entrees: { n: 4 }, sortie: ['*', '**', '***', '****'] },
    { entrees: { n: 1 }, sortie: ['*'] },
    { entrees: { n: 6 }, sortie: ['*', '**', '***', '****', '*****', '******'] },
    { entrees: { n: 0 }, sortie: [] },
  ],
  indices: [
    'Une boucle pour les lignes ; dans chaque ligne, une autre boucle pour les étoiles.',
    'Construisez chaque ligne dans une variable texte : partez de "" et ajoutez "*" à chaque tour de la boucle intérieure.',
    'La ligne numéro ligne contient ligne étoiles : la boucle intérieure va de 1 à ligne.',
  ],
});

exercice({
  id: '5.8',
  titre: 'Nombre premier',
  niveau: 3,
  enonce: '<p>Lisez un entier <code>n</code> (au moins 2). Affichez <code>17 est premier</code>, ou, s\'il ne l\'est pas, son plus petit diviseur autre que 1 : <code>21 n\'est pas premier (divisible par 3)</code>.</p>',
  entrees: { n: 21 },
  depart: 'const n = lire("n");\n\n',
  tests: [
    { entrees: { n: 17 }, sortie: ['17 est premier'] },
    { entrees: { n: 21 }, sortie: ['21 n\'est pas premier (divisible par 3)'] },
    { entrees: { n: 2 }, sortie: ['2 est premier'] },
    { entrees: { n: 4 }, sortie: ['4 n\'est pas premier (divisible par 2)'] },
    { entrees: { n: 97 }, sortie: ['97 est premier'] },
    { entrees: { n: 91 }, sortie: ['91 n\'est pas premier (divisible par 7)'] },
    { entrees: { n: 7919 }, sortie: ['7919 est premier'] },
  ],
  indices: [
    'Cherchez un diviseur d en partant de 2 : n est divisible par d si n % d === 0.',
    'Une boucle while qui continue tant que d < n ET que d ne divise pas n.',
    'Après la boucle : si d a atteint n, aucun diviseur n\'a été trouvé.',
  ],
});
