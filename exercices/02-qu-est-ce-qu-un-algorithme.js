// Chapitre 02 — Qu'est-ce qu'un algorithme ? Énoncés détaillés et corrections :
// 02-Qu-est-ce-qu-un-algorithme.md
//
// Ces exercices n'ont pas de test automatique (mode 'reponse') : l'apprenant
// rédige sa réponse et, quand `parties` contient 'schema', dessine un schéma.
// La réponse est enregistrée dans son journal.

chapitre(2, 'Qu\'est-ce qu\'un algorithme ?', [
  "définir un algorithme, et citer ses quatre qualités",
  "repérer les entrées et les sorties d'un algorithme",
  "dessiner un diagramme de flux avec les symboles début/fin, entrée/sortie, action et décision",
  "lire un pseudo-code, et écrire `LIRE`, `ÉCRIRE` et une affectation `←`",
  "traduire un pseudo-code simple en JavaScript",
  "tester un algorithme à la main, en pensant aux valeurs limites",
]);

exercice({
  id: '2.1',
  titre: 'Remettre dans l\'ordre',
  niveau: 1,
  mode: 'reponse',
  parties: ['texte'],
  enonce: '<p>Les étapes d\'un retrait au distributeur, dans le désordre : <em>Prendre les billets</em>, <em>Taper son code secret</em>, <em>Récupérer sa carte</em>, <em>Insérer sa carte</em>, <em>Choisir le montant</em>.</p>' +
    '<p>Remettez-les dans l\'ordre, donnez les entrées et la sortie de l\'algorithme, puis la décision importante qui manque.</p>',
  depart: '1. Les étapes dans l\'ordre :\n   - \n   - \n   - \n   - \n   - \n\n2. Entrées :\n   Sortie :\n\n3. La décision qui manque, et ce qui se passe dans chaque cas :\n',
  tests: [],
});

exercice({
  id: '2.2',
  titre: 'Lire un diagramme',
  niveau: 1,
  mode: 'reponse',
  parties: ['texte'],
  enonce: '<p>Avec le diagramme de l\'exercice 2.2 du support (prix selon l\'âge, moins de 12 ans ou non) : qu\'affiche-t-il pour 8, 12 et 30 ? Écrivez-le ensuite en pseudo-code, avec un <code>SI … ALORS … SINON … FIN SI</code>.</p>',
  depart: 'Pour 8, l\'algorithme affiche : \nPour 12 : \nPour 30 : \n\nLe pseudo-code :\nALGORITHME PrixCinema\nVARIABLES\n  \nDÉBUT\n  \nFIN\n',
  tests: [],
});

exercice({
  id: '2.3',
  titre: 'Le prix d\'une course en taxi',
  niveau: 2,
  mode: 'reponse',
  parties: ['texte', 'schema'],
  enonce: '<p>Une course de taxi coûte 4 € de prise en charge, plus 2 € par kilomètre. Donnez l\'entrée et la sortie, <strong>dessinez le diagramme de flux</strong> dans l\'éditeur de schémas, écrivez le pseudo-code, et calculez le prix d\'une course de 7 km.</p>',
  depart: 'Entrée :\nSortie :\n\nLe pseudo-code :\nALGORITHME PrixTaxi\nVARIABLES\n  \nDÉBUT\n  \nFIN\n\nPour 7 km, le prix est : \n',
  tests: [],
});

exercice({
  id: '2.4',
  titre: 'La chasse aux ambiguïtés',
  niveau: 3,
  mode: 'reponse',
  parties: ['texte'],
  enonce: '<p>« Faire bouillir de l\'eau. Ajouter du sel. Mettre les pâtes. Cuire le temps qu\'il faut, en remuant de temps en temps. Égoutter. » Relevez ce qu\'un robot ne saurait pas faire, puis réécrivez la recette en algorithme précis, avec des <code>TANT QUE</code>.</p>',
  depart: 'Ce qu\'un robot ne saurait pas faire :\n- \n- \n\nLa recette réécrite :\nALGORITHME CuirePates\nDÉBUT\n  \nFIN\n',
  tests: [],
});
