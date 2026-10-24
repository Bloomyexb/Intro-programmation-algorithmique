[← Chapitre précédent](A-Aide-memoire.md) · [Sommaire](Readme.md)

# Déboguer seul

Un **bug**, c'est un écart entre ce que fait votre programme et ce que vous vouliez qu'il fasse. En trouver fait partie du métier, tous les jours, à tous les niveaux d'expérience : ce qui distingue un développeur aguerri, ce n'est pas d'écrire du code sans bug, c'est d'avoir une **méthode** pour les trouver.

## La méthode en cinq temps

1. **Lire le message.** Une erreur affiche une ligne, un type (`ReferenceError`, `TypeError`, `SyntaxError`…) et un message. Lisez-les en entier, avec l'explication 💡 du playground. Allez voir la ligne indiquée, **et celle d'avant** : une erreur est souvent remarquée une ligne après avoir été commise.
2. **Reproduire avec un petit cas.** Le test qui échoue donne les entrées : refaites l'essai à la main, avec les mêmes valeurs. Un cas minuscule (un tableau de deux cases, `n = 1`) est souvent le plus parlant.
3. **Observer.** Ne devinez pas : regardez. Placez des `console.log` pour afficher les variables aux endroits clés, au début de chaque tour de boucle par exemple, ou refaites le **tableau de suivi** sur papier. Le bug se trouve là où ce que vous voyez s'écarte de ce que vous attendiez.
4. **Changer une seule chose à la fois.** Formulez une hypothèse (« la boucle fait un tour de trop »), modifiez **une** chose pour la vérifier, testez. Plusieurs changements à la fois, et vous ne saurez plus lequel a compté.
5. **Expliquer à voix haute.** Expliquez votre code ligne par ligne, à quelqu'un sur le Discord, à Nami, ou à un canard en plastique posé sur le bureau. Il est étonnant de voir combien de bugs se révèlent au moment où l'on dit « et là, normalement… ». Les développeurs appellent cela le *rubber duck debugging*.

## Bien placer ses `console.log`

```javascript
function somme(tableau) {
  let total = 0;
  for (let i = 0; i <= tableau.length; i++) {
    console.log("tour", i, "case", tableau[i], "total", total);   // ← le mouchard
    total = total + tableau[i];
  }
  return total;
}

console.log(somme([3, 4]));
```

```text
tour 0 case 3 total 0
tour 1 case 4 total 3
tour 2 case undefined total 7      ← une case qui n'existe pas
NaN
```

Le mouchard montre un troisième tour sur une case `undefined` : la condition devait être `i < tableau.length`. Afficher **plusieurs valeurs avec une étiquette** chacune évite de confondre les lignes. Pensez à retirer vos mouchards une fois le bug trouvé.

## Les erreurs les plus fréquentes

| Message | Ce que ça veut dire | Le remède |
|---|---|---|
| `SyntaxError: Unexpected token …` | le code est mal formé : JavaScript ne peut même pas le lire | une parenthèse, une accolade, un guillemet manque ou est en trop, sur cette ligne ou juste avant |
| `SyntaxError: Unexpected end of input` | le code s'arrête avant la fin attendue | une accolade `}` ou une parenthèse `)` fermante manque |
| `SyntaxError: Invalid or unexpected token` | un caractère inattendu | un guillemet jamais refermé, ou des guillemets typographiques `« »` `’` copiés depuis un texte |
| `ReferenceError: x is not defined` | le nom `x` n'existe pas ici | faute de frappe, majuscule, variable jamais déclarée, ou déclarée dans un autre bloc ou une autre fonction |
| `ReferenceError: Cannot access 'x' before initialization` | `x` est utilisée avant sa déclaration | déplacez la déclaration plus haut |
| `TypeError: Assignment to constant variable.` | on réaffecte une constante | déclarez avec `let` si la valeur doit changer |
| `TypeError: x is not a function` | on appelle quelque chose qui n'est pas une fonction | faute de frappe dans le nom, ou parenthèses en trop |
| `TypeError: Cannot read properties of undefined (reading 'length')` | on lit une propriété d'une valeur `undefined` | une variable sans valeur, ou un indice hors du tableau |
| `TypeError: Cannot set properties of null` | on modifie un élément introuvable | le sélecteur de `querySelector` ne correspond à rien : vérifiez l'`id` et le `#` |
| `RangeError: Maximum call stack size exceeded` | une fonction s'appelle sans fin | cas de base manquant, ou jamais atteint |
| « Arrêté au bout de 3 secondes » | le programme ne s'arrête pas | boucle infinie : la condition ne devient jamais fausse |

## Pas d'erreur, mais un mauvais résultat

Le plus fréquent, et le plus sournois. Les suspects habituels :

- **le décalage d'un** : `<` ou `<=` ? départ à 0 ou à 1 ? Vérifiez le premier et le dernier tour ;
- **l'ordre des conditions** : dans une suite de `else if`, la première condition vraie gagne ;
- **l'accumulateur mal placé** : initialisé dans la boucle au lieu d'avant, ou affiché dans la boucle au lieu d'après ;
- **le `return` oublié**, ou un `console.log` à sa place : la fonction retourne `undefined` ;
- **le `return false` dans la boucle** : la fonction répond après la première case ;
- **du texte au lieu d'un nombre** : `"10" + 2` donne `"102"`. Ce qui vient d'un champ de formulaire est toujours du texte : `Number()` ;
- **`=` au lieu de `===`** dans une condition.

## Voir son programme s'exécuter pas à pas

- **Python Tutor**, malgré son nom, exécute aussi du JavaScript : [pythontutor.com/javascript.html](https://pythontutor.com/javascript.html). Collez-y votre fonction et un appel, puis avancez instruction par instruction : il dessine les variables, les tableaux et la pile d'appels. `lire()` n'y existe pas : remplacez-le par des valeurs écrites en dur.
- **Le débogueur du navigateur**, pour une vraie page web : ouvrez les outils de développement (F12), onglet *Sources* (*Débogueur* sous Firefox), cliquez sur un numéro de ligne pour poser un **point d'arrêt**. Au prochain passage, le programme s'y arrête : vous voyez la valeur de chaque variable, et vous avancez pas à pas. L'instruction `debugger;` écrite dans le code produit le même effet.

## Demander de l'aide efficacement

Quand vous demandez de l'aide, sur le Discord, à Nami, ou plus tard sur un forum, préparez quatre choses :

1. **ce que vous vouliez** obtenir ;
2. **ce que vous obtenez** : le message d'erreur exact, ou le résultat faux ;
3. **ce que vous avez déjà essayé** ;
4. **le plus petit morceau de code** qui montre le problème.

Bien souvent, préparer ces quatre points suffit à trouver la réponse soi-même. Avec Nami, ajoutez une consigne : « explique-moi, sans me donner la solution » ; la section 3 du [chapitre 01](01-Mise-en-route.md) détaille comment s'en servir comme d'un tuteur.

---

[← Chapitre précédent](A-Aide-memoire.md) · [Sommaire](Readme.md)
