// Chapitre 03 — La séquence. Énoncés détaillés et corrigés : 03-La-sequence.md

chapitre(3, 'La séquence');

exercice({
  id: '3.1',
  titre: 'Le rectangle',
  niveau: 1,
  enonce: '<p>Lisez la <code>largeur</code> et la <code>hauteur</code> d\'un rectangle, puis affichez son périmètre et son aire, sur deux lignes.</p>',
  entrees: { largeur: 4, hauteur: 3 },
  depart: 'const largeur = lire("largeur");\nconst hauteur = lire("hauteur");\n\n// Calculez le périmètre et l\'aire, puis affichez-les.\n',
  tests: [
    { entrees: { largeur: 4, hauteur: 3 }, sortie: ['Périmètre : 14', 'Aire : 12'] },
    { entrees: { largeur: 2.5, hauteur: 4 }, sortie: ['Périmètre : 13', 'Aire : 10'] },
    { entrees: { largeur: 10, hauteur: 10 }, sortie: ['Périmètre : 40', 'Aire : 100'] },
    { entrees: { largeur: 7, hauteur: 2 }, sortie: ['Périmètre : 18', 'Aire : 14'] },
  ],
  indices: [
    'Périmètre = 2 × (largeur + hauteur) ; aire = largeur × hauteur. En JavaScript, la multiplication s\'écrit *.',
    'Sans parenthèses, 2 * largeur + hauteur multiplie avant d\'additionner : ce n\'est pas le périmètre.',
    'Pour afficher : console.log("Périmètre : " + perimetre);',
  ],
});

exercice({
  id: '3.2',
  titre: 'Le ticket de caisse',
  niveau: 1,
  enonce: '<p>Lisez le nom d\'un <code>article</code>, son <code>prixUnitaire</code> et la <code>quantite</code> achetée, puis affichez la ligne du ticket de caisse.</p>',
  entrees: { article: 'livre', prixUnitaire: 12, quantite: 3 },
  depart: 'const article = lire("article");\n\n// Lisez aussi le prix unitaire et la quantité, calculez le total et affichez la ligne du ticket.\n',
  tests: [
    { entrees: { article: 'livre', prixUnitaire: 12, quantite: 3 }, sortie: ['3 x livre à 12 € = 36 €'] },
    { entrees: { article: 'cahier', prixUnitaire: 4.5, quantite: 2 }, sortie: ['2 x cahier à 4.5 € = 9 €'] },
    { entrees: { article: 'stylo', prixUnitaire: 2, quantite: 10 }, sortie: ['10 x stylo à 2 € = 20 €'] },
  ],
  indices: [
    'Trois lire(), un calcul : const total = prixUnitaire * quantite;',
    'Assemblez la ligne morceau par morceau : quantite + " x " + article + " à " + …',
    'Chaque morceau de texte porte ses propres espaces : " x ", " à ", " € = ", " €".',
  ],
});

exercice({
  id: '3.4',
  titre: 'Des secondes aux heures',
  niveau: 2,
  enonce: '<p>Lisez un nombre de <code>secondes</code> et affichez-le en heures, minutes et secondes, sous la forme <code>1 h 2 min 5 s</code>. Une heure fait 3600 secondes.</p>',
  entrees: { secondes: 3725 },
  depart: 'const secondes = lire("secondes");\n\n',
  tests: [
    { entrees: { secondes: 3725 }, sortie: ['1 h 2 min 5 s'] },
    { entrees: { secondes: 59 }, sortie: ['0 h 0 min 59 s'] },
    { entrees: { secondes: 86399 }, sortie: ['23 h 59 min 59 s'] },
    { entrees: { secondes: 7200 }, sortie: ['2 h 0 min 0 s'] },
    { entrees: { secondes: 600 }, sortie: ['0 h 10 min 0 s'] },
  ],
  indices: [
    'Les heures pleines : Math.floor(secondes / 3600). Ce qui reste après les heures : secondes % 3600.',
    'Travaillez ensuite sur ce reste : combien de minutes pleines dedans ? Et combien de secondes restent ?',
    'Faites le tableau de suivi pour 3725 : heures 1, reste 125, minutes 2, secondes 5.',
  ],
});

exercice({
  id: '3.5',
  titre: 'Rendre la monnaie',
  niveau: 3,
  enonce: '<p>Lisez un <code>montant</code> entier en euros. Affichez combien de billets de 20, 10 et 5 €, et de pièces de 2 et 1 € il faut rendre, en utilisant le moins de billets et de pièces possible : une ligne par coupure, dans cet ordre.</p>',
  entrees: { montant: 73 },
  depart: 'const montant = lire("montant");\n\n',
  tests: [
    { entrees: { montant: 73 }, sortie: ['Billets de 20 € : 3', 'Billets de 10 € : 1', 'Billets de 5 € : 0', 'Pièces de 2 € : 1', 'Pièces de 1 € : 1'] },
    { entrees: { montant: 8 }, sortie: ['Billets de 20 € : 0', 'Billets de 10 € : 0', 'Billets de 5 € : 1', 'Pièces de 2 € : 1', 'Pièces de 1 € : 1'] },
    { entrees: { montant: 40 }, sortie: ['Billets de 20 € : 2', 'Billets de 10 € : 0', 'Billets de 5 € : 0', 'Pièces de 2 € : 0', 'Pièces de 1 € : 0'] },
    { entrees: { montant: 199 }, sortie: ['Billets de 20 € : 9', 'Billets de 10 € : 1', 'Billets de 5 € : 1', 'Pièces de 2 € : 2', 'Pièces de 1 € : 0'] },
  ],
  indices: [
    'Commencez par la plus grosse coupure : Math.floor(montant / 20) billets de 20 €.',
    'Ce qui reste à rendre après les billets de 20 € : montant % 20. Gardez-le dans une variable déclarée avec let.',
    'Recommencez avec 10, puis 5, puis 2 : à chaque étape, quotient pour le nombre, reste pour la suite.',
  ],
});
