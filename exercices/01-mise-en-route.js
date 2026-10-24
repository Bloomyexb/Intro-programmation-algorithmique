// Chapitre 01 — Mise en route. Énoncés détaillés : 01-Mise-en-route.md
//
// Chaque fichier de ce dossier déclare les exercices d'un chapitre, avec
// chapitre() et exercice(). Les champs d'un exercice :
//   id, titre, niveau (1 à 3 étoiles), enonce (HTML court), depart (code de
//   départ), indices (affichés un par un), tests, et selon le mode :
//   - mode 'console' (par défaut) : entrees (valeurs d'essai pour lire()),
//     tests { entrees, sortie: [lignes attendues] } ;
//   - mode 'fonction' : fonction (son nom), tests { args, attendu } ou
//     { nom, verifier: function (f, outils) { return true ou 'message' } } ;
//   - mode 'page' : html (page de départ), tests { nom, hasard, etapes } ;
//   - interdit [{ texte, message }] et recursif ['nom'] : règles sur le code.

chapitre(1, 'Mise en route');

exercice({
  id: '1.1',
  titre: 'Premier programme',
  niveau: 1,
  enonce: '<p>Cliquez sur <strong>▶ Exécuter</strong> : le programme affiche <code>Bonjour !</code> dans la console.</p>' +
    '<p>Modifiez-le pour qu\'il affiche <strong>deux lignes</strong> : <code>Bonjour !</code> puis <code>Je découvre le playground.</code>, puis cliquez sur <strong>✓ Tester</strong>.</p>',
  depart: '// Votre premier programme : il affiche un message dans la console.\nconsole.log("Bonjour !");\n',
  tests: [
    { nom: 'les deux lignes', entrees: {}, sortie: ['Bonjour !', 'Je découvre le playground.'] },
  ],
  indices: [
    'Un console.log() affiche une ligne. Pour deux lignes, il en faut deux, l\'un sous l\'autre.',
    'Le texte doit être exactement celui demandé, point final compris : les tests comparent caractère par caractère.',
  ],
});

exercice({
  id: '1.2',
  titre: 'Lire une entrée',
  niveau: 1,
  enonce: '<p>Ce programme <strong>lit</strong> un prénom avec <code>lire("prenom")</code>, puis l\'affiche. Exécutez-le, changez le prénom dans le panneau <strong>Entrées</strong>, exécutez de nouveau.</p>' +
    '<p>Modifiez ensuite le programme pour qu\'il affiche <code>Bienvenue, Ada !</code> (avec le prénom lu, quel qu\'il soit).</p>',
  entrees: { prenom: 'Ada' },
  depart: 'const prenom = lire("prenom");\nconsole.log("Bonjour " + prenom + " !");\n',
  tests: [
    { entrees: { prenom: 'Ada' }, sortie: ['Bienvenue, Ada !'] },
    { entrees: { prenom: 'Grace' }, sortie: ['Bienvenue, Grace !'] },
    { entrees: { prenom: 'Alan' }, sortie: ['Bienvenue, Alan !'] },
  ],
  indices: [
    'Le signe + colle des morceaux de texte : "Bienvenue, " + prenom + " !".',
    'Attention aux espaces : il y en a un après la virgule, et un avant le point d\'exclamation.',
  ],
});

exercice({
  id: '1.3',
  titre: 'Réparer un programme',
  niveau: 1,
  enonce: '<p>Ce programme contient <strong>deux erreurs</strong>. Exécutez-le, lisez le message en rouge dans la console : il indique la ligne et propose une explication. Corrigez, exécutez de nouveau, jusqu\'à ce que tout fonctionne.</p>' +
    '<p>Avec <code>ville = Lyon</code>, le programme doit afficher <code>Vous habitez à Lyon.</code> puis <code>Bon séjour !</code></p>',
  entrees: { ville: 'Lyon' },
  depart: 'const ville = lire("ville");\nconsol.log("Vous habitez à " + ville + ".");\nconsole.log("Bon séjour !);\n',
  tests: [
    { entrees: { ville: 'Lyon' }, sortie: ['Vous habitez à Lyon.', 'Bon séjour !'] },
    { entrees: { ville: 'Montpellier' }, sortie: ['Vous habitez à Montpellier.', 'Bon séjour !'] },
  ],
  indices: [
    'Le navigateur signale une seule erreur à la fois : corrigez la première, exécutez, puis passez à la suivante.',
    'Un texte s\'ouvre et se ferme par un guillemet. Et console s\'écrit avec un e final.',
  ],
});
