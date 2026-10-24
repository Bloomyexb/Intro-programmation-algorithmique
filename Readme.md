<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/Logo-diginamic-color-blk.png">
    <img src="assets/Logo-diginamic-color.svg" alt="Diginamic Formation" width="358">
  </picture>
</p>

# Introduction à la programmation et à l'algorithmique

Deux jours pour apprendre à **penser un programme** avant de l'écrire. On part d'une recette de cuisine, on arrive à un jeu qui tourne dans une page web, et entre les deux on apprend ce qui fait le cœur de tout programme : enchaîner des instructions, choisir, répéter, découper en fonctions, traiter des données, trier, chercher.

Le cours se suit **seul, sans formateur**. Tout est écrit : les explications, les exemples, et une cinquantaine d'exercices à faire dans le **playground**, une page livrée avec le cours qui exécute votre code et le corrige automatiquement. Pour vous débloquer, le **Discord** de la formation et **Nami**, l'IA qui y répond à vos questions.

## 🎯 Objectifs pédagogiques

À la fin de ce cours, vous saurez :

1. Expliquer ce qu'est un algorithme, et le représenter par un diagramme de flux et par un pseudo-code.
2. Écrire en JavaScript des programmes qui enchaînent des instructions, prennent des décisions et répètent des actions.
3. Découper un problème en fonctions qui reçoivent des paramètres et retournent un résultat.
4. Traiter des tableaux avec les algorithmes classiques : somme, maximum, comptage, recherche, filtrage.
5. Trier un tableau, y chercher efficacement, et comparer le coût de deux algorithmes.
6. Écrire une fonction récursive simple.
7. Brancher votre code sur une page web : lire un champ, réagir à un clic, afficher un résultat.
8. Tester votre code, et vous débloquer seul face à une erreur.

## ❔ Pourquoi ce cours ?

Rendre une page dynamique, écrire la logique d'une application côté serveur : quels que soient le langage et le framework, tout repose sur le même socle, la **pensée algorithmique**. Les frameworks changent tous les trois ans ; savoir décomposer un problème, choisir une boucle ou un tableau, et vérifier qu'un programme fait ce qu'on attend, sert toute une carrière.

C'est pourquoi le langage vient ici en dernier : chaque notion part d'une image du quotidien, se dessine, s'écrit en pseudo-code, et ne devient du code qu'une fois comprise. Ce code est du JavaScript, le langage du navigateur : celui qui rendra vos pages vivantes.

## Prérequis

- Savoir écrire une page HTML simple : balises, attributs, `id`.
- Un compte GitHub et Git installé, pour récupérer le cours : c'est l'objet du cours [Git et GitHub 101](https://github.com/DiginamicAcademy/Git-GitHub-101).
- Un navigateur récent : Chrome, Edge ou Firefox. Rien d'autre à installer.
- Un accès au Discord de la formation.
- Aucune connaissance en programmation.

## Par où commencer ?

Par le [chapitre 01](01-Mise-en-route.md). Il explique comment récupérer le cours en forkant ce dépôt, comment travailler seul, comment demander de l'aide sur le Discord et à Nami, et comment se servir du playground.

## Le parcours

Chaque étape est un fichier. On les suit **dans l'ordre** : chacune s'appuie sur la base laissée par la précédente.

### Jour 1 — De l'idée au programme

| # | Étape | Durée | Ce qu'on y fait |
|---|---|---|---|
| [01](01-Mise-en-route.md) | Mise en route | 40 min | forker le cours, la méthode de travail, demander de l'aide, le playground, lire un test et une erreur |
| [02](02-Qu-est-ce-qu-un-algorithme.md) | Qu'est-ce qu'un algorithme ? | 45 min | la recette de cuisine, entrées et sorties, les quatre symboles du diagramme de flux, les conventions du pseudo-code |
| [03](03-La-sequence.md) | La séquence | 1 h | instructions dans l'ordre, variables, quotient et reste, le tableau de suivi |
| [04](04-Les-conditions.md) | Les conditions | 1 h 30 | booléens, ET / OU / NON, `if` / `else if` / `else`, valeurs limites |
| [05](05-Les-boucles.md) | Les boucles | 1 h 45 | `while`, `for`, `do … while`, compteur et accumulateur, boucle infinie, boucles imbriquées |
| [06](06-Les-fonctions.md) | Les fonctions | 1 h 30 | paramètres et `return`, afficher n'est pas retourner, portée, brancher une fonction sur une page web |

### Jour 2 — Des algorithmes qui travaillent sur des données

| # | Étape | Durée | Ce qu'on y fait |
|---|---|---|---|
| [07](07-Algorithmes-sur-les-tableaux.md) | Algorithmes sur les tableaux | 1 h 30 | le parcours, et cinq patrons : accumulateur, meilleur jusqu'ici, compteur, drapeau, construction |
| [08](08-Trier-et-chercher.md) | Trier et chercher | 1 h 30 | recherche linéaire et dichotomique, tris par sélection, à bulles et par insertion, `sort()` |
| [09](09-Recursivite-et-complexite.md) | Récursivité et complexité | 1 h 15 | cas de base et appel récursif, pile d'appels, O(1), O(log n), O(n), O(n²) |
| [10](10-Mini-projet-le-nombre-mystere.md) | Mini-projet : le nombre mystère | 2 h 30 | un jeu en trois versions, de l'analyse à la page web, jusqu'à l'ordinateur qui devine par dichotomie |

### Annexes

| # | Annexe | Ce qu'on y trouve |
|---|---|---|
| [A](A-Aide-memoire.md) | Aide-mémoire | symboles, pseudo-code et JavaScript côte à côte, patrons, complexités |
| [B](B-Deboguer-seul.md) | Déboguer seul | la méthode pour se débloquer, les messages d'erreur courants et leur remède |

### Repères pour votre rythme

Les durées sont indicatives : chacun avance à son allure. Ces repères vous disent si vous êtes dans les temps.

| Moment | Vous devriez avoir terminé… |
|---|---|
| Jour 1, à midi | les chapitres 01 à 03, et commencé le 04 |
| Jour 1, le soir | les chapitres 04 à 06, et déposé votre journal sur Moodle |
| Jour 2, à midi | les chapitres 07 et 08 |
| Jour 2, le soir | le chapitre 09 et au moins les versions 1 et 2 du mini-projet, et déposé votre journal sur Moodle |

En retard ? Concentrez-vous sur les exercices ⭐ et ⭐⭐, et gardez les ⭐⭐⭐ pour plus tard.

## Et ensuite ?

Le cours [*Concepts généraux en programmation*](https://github.com/DiginamicAcademy/Principes-generaux-en-programmation) prolonge celui-ci : variables et types en détail, tableaux associatifs, objets, classes, héritage et modules, en JavaScript, Python et Java côte à côte. Les chapitres de ce cours-ci y renvoient quand une notion y est approfondie.

## Pour les auteurs du cours

- **Le journal** : chaque soir, les apprenants téléchargent depuis le playground un journal signé (`journal-….json`) et le déposent sur Moodle. Pour le lire, ouvrez `outils/visionneuse-journal.html` dans un navigateur et glissez-y les journaux, un ou plusieurs à la fois, par exemple tout le dossier téléchargé depuis Moodle : elle vérifie les signatures étape par étape et montre le travail de chacun (essais, code, réponses, schémas, chronologie, auto-évaluation). Si le devoir Moodle restreint les types de fichiers, autorisez `.json`.
- **Le module de signature et la visionneuse sont livrés compilés** (`playground/signature.js`, `outils/visionneuse-journal.html`). Leurs sources et la clé secrète vivent dans un dépôt privé distinct ; ici, le dossier `outils/sources-journal/` est ignoré par Git.

- **Le playground** fonctionne en `file://`, sans serveur ni connexion. Tous ses exercices ont été vérifiés automatiquement sous Chrome ; Edge repose sur le même moteur ; Firefox mérite un essai rapide avant une session.
- **Modifier ou ajouter un exercice** : les exercices sont déclarés dans `exercices/`, un fichier par chapitre ; leur format est décrit en tête de `exercices/01-mise-en-route.js`. Un nouveau fichier se déclare par une ligne `<script>` dans `playground/index.html`. Le corrigé s'écrit dans le chapitre, dans un bloc `javascript` précédé de `<!-- corrigé 4.2 -->`.
- **Vérifier les corrigés** : `node outils/verifier-corriges.mjs` passe chaque corrigé aux tests de son exercice, et signale un code de départ qui les passerait déjà. Les exercices en mode page se vérifient dans le playground.
