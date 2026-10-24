[← Chapitre précédent](10-Mini-projet-le-nombre-mystere.md) · [Sommaire](Readme.md) · [Chapitre suivant →](B-Deboguer-seul.md)

# Aide-mémoire

Tout le cours, résumé en tableaux : les images, les symboles, le pseudo-code et le JavaScript côte à côte.

## Les images du cours

| Notion | L'image | Ce qu'elle fait comprendre |
|---|---|---|
| Algorithme | une recette de cuisine | des entrées, des étapes précises dans l'ordre, un résultat |
| Séquence | suivre la recette dans l'ordre | l'ordre des instructions compte |
| Variable | une boîte étiquetée | un nom, une valeur à la fois ; elle ne se recalcule pas toute seule |
| `DIV` et `MOD` | des bonbons en sachets de 60 | le nombre de sachets pleins, et ce qui reste |
| Condition | un aiguillage | une question à réponse oui ou non choisit le chemin |
| Boucle `TANT QUE` | la vaisselle | on vérifie avant chaque tour ; peut-être aucun tour |
| Boucle `POUR` | 10 tours de piste | le nombre de tours est connu d'avance |
| Boucle `RÉPÉTER` | taper son code | au moins un tour, on vérifie après |
| Accumulateur | le total du ticket de caisse | une valeur qui grossit à chaque tour |
| Fonction | la recette de la pâte brisée | écrite une fois, utilisée partout ; des paramètres, un résultat |
| Afficher / retourner | la calculatrice qui affiche, ou qui tend un papier | l'affichage est pour l'humain, le retour pour le programme |
| Tableau | une colonne de tableur | des valeurs numérotées à partir de 0 |
| Meilleur jusqu'ici | le recruteur qui garde le meilleur CV | on compare chaque valeur au meilleur vu |
| Drapeau | chercher ses clés dans les manteaux | on s'arrête dès qu'on trouve ; « absent » seulement après tout fouillé |
| Dichotomie | le dictionnaire, le nombre mystère | couper en deux à chaque étape, dans des données triées |
| Tri par insertion | trier ses cartes en main | glisser chaque carte jusqu'à sa place |
| Récursivité | la file d'attente, les poupées russes | le même problème, en plus petit, jusqu'au cas de base |
| Complexité O(n²) | chaque invité serre la main de tous les autres | données doublées, travail quadruplé |

## Le diagramme de flux

| Forme | Rôle | Exemple |
|---|---|---|
| rectangle aux bords arrondis | début, fin | `Début`, `Fin`, `Retourner x` |
| parallélogramme | entrée, sortie | `Lire prix`, `Écrire total` |
| rectangle | action, calcul | `total ← prix × quantité` |
| losange | décision, deux sorties *oui* / *non* | `âge ≥ 18 ?` |
| rectangle à double bord | appel d'une fonction | `r ← fahrenheit(c)` |
| flèche qui remonte vers un losange | une boucle | |

## Pseudo-code et JavaScript

### Structure, variables, entrées et sorties

| Pseudo-code | JavaScript |
|---|---|
| `ALGORITHME Nom` … `DÉBUT` … `FIN` | le fichier lui-même |
| `VARIABLES x : NOMBRE` | `let x;` |
| `x ← 5` | `x = 5;`, ou à la déclaration : `let x = 5;` |
| une valeur qui ne changera plus | `const x = 5;` |
| `LIRE x` | `const x = lire("x");` (playground) ; dans une page : `Number(champ.value)` |
| `ÉCRIRE "Total : ", t` | `console.log("Total : " + t);` |
| types `NOMBRE`, `TEXTE`, `BOOLÉEN` | `number`, `string`, `boolean` |

### Opérations

| Pseudo-code | JavaScript | Exemple |
|---|---|---|
| `+ − × /` | `+ - * /` | `7 / 2` vaut `3.5` |
| `a DIV b` | `Math.floor(a / b)` | `Math.floor(7 / 2)` vaut `3` |
| `a MOD b` | `a % b` | `7 % 2` vaut `1` |
| `x ← x + 1` | `x++` ou `x += 1` | |
| `=`, `≠` | `===`, `!==` | |
| `<`, `≤`, `>`, `≥` | `<`, `<=`, `>`, `>=` | |
| `ET`, `OU`, `NON` | `&&`, `\|\|`, `!` | |
| assembler un texte | `"a" + b` ou `` `a${b}` `` | |
| texte → nombre | `Number("42")` | |
| nombre → texte à 2 décimales | `(12).toFixed(2)` | `"12.00"` |
| entier au hasard de `min` à `max` | `Math.floor(Math.random() * (max - min + 1)) + min` | |

### Conditions

| Pseudo-code | JavaScript |
|---|---|
| `SI c ALORS` | `if (c) {` |
| `SINON SI c ALORS` | `} else if (c) {` |
| `SINON` | `} else {` |
| `FIN SI` | `}` |

### Boucles

| Pseudo-code | JavaScript |
|---|---|
| `TANT QUE c FAIRE` … `FIN TANT QUE` | `while (c) { … }` |
| `POUR i DE a À b FAIRE` … `FIN POUR` | `for (let i = a; i <= b; i++) { … }` |
| `POUR i DE b À a PAS -1 FAIRE` | `for (let i = b; i >= a; i--) { … }` |
| `RÉPÉTER` … `JUSQU'À c` | `do { … } while (!c);` |
| `POUR CHAQUE x DANS t FAIRE` | `for (const x of t) { … }` |

### Fonctions

| Pseudo-code | JavaScript |
|---|---|
| `FONCTION f(a, b) : TYPE` | `function f(a, b) {` |
| `RETOURNER x` | `return x;` |
| `FIN FONCTION` | `}` |
| appel | `f(3, 4)` |
| fonction fléchée | `const f = (a, b) => a + b;` |

### Tableaux

| Pseudo-code | JavaScript |
|---|---|
| `t : TABLEAU DE NOMBRE` | `const t = [];` |
| `t ← [12, 15, 9]` | `const t = [12, 15, 9];` |
| `t[i]` (indices à partir de 0) | `t[i]` |
| `taille(t)` | `t.length` |
| `ajouter x à t` | `t.push(x);` |
| assembler en texte | `t.join(", ")` |
| trier des nombres | `t.sort((a, b) => a - b)` |

## Les patrons d'algorithmes

| Patron | Avant la boucle | À chaque case | Après la boucle |
|---|---|---|---|
| accumulateur | `total ← 0` | `total ← total + x` | `RETOURNER total` |
| meilleur jusqu'ici | `max ← t[0]` | `SI x > max ALORS max ← x` | `RETOURNER max` |
| compteur | `n ← 0` | `SI condition ALORS n ← n + 1` | `RETOURNER n` |
| drapeau | | `SI condition ALORS RETOURNER VRAI` | `RETOURNER FAUX` |
| construction | `resultat ← []` | `SI condition ALORS ajouter x à resultat` | `RETOURNER resultat` |
| recherche | | `SI t[i] = valeur ALORS RETOURNER i` | `RETOURNER −1` |
| sentinelle | `LIRE x` | `traiter x`, puis `LIRE x` | |

## Les algorithmes de recherche et de tri

| Algorithme | Principe | Complexité |
|---|---|---|
| recherche linéaire | regarder chaque case dans l'ordre | O(n) |
| recherche dichotomique | regarder le milieu, garder la bonne moitié ; tableau **trié** | O(log n) |
| tri par sélection | placer le plus petit, puis le plus petit du reste… | O(n²) |
| tri à bulles | échanger les voisins mal rangés, passage après passage | O(n²) |
| tri par insertion | glisser chaque valeur jusqu'à sa place | O(n²) |
| `sort()` de JavaScript | tri optimisé du navigateur | O(n log n) |

## La complexité

| Notation | Quand les données doublent… | Repère |
|---|---|---|
| O(1) | rien ne change | pas de boucle sur les données |
| O(log n) | une opération de plus | la zone est divisée par deux à chaque tour |
| O(n) | le travail double | une boucle sur les données |
| O(n²) | le travail quadruple | deux boucles imbriquées sur les données |
| O(2ⁿ) | le travail est mis au carré | Fibonacci récursif naïf : à éviter |

Attention aux **boucles cachées** : `includes`, `indexOf`, `filter`, `sort` parcourent le tableau.

## La récursivité

| Ingrédient | Rôle | Exemple pour `factorielle(n)` |
|---|---|---|
| cas de base | le cas résolu directement, sans appel | `SI n ≤ 1 ALORS RETOURNER 1` |
| appel récursif | sur un problème strictement plus petit | `RETOURNER n × factorielle(n − 1)` |

## La page web

| Geste | JavaScript |
|---|---|
| trouver un élément | `document.querySelector("#id")` |
| lire un champ (du texte !) | `Number(document.querySelector("#prix").value)` |
| afficher dans un élément | `element.textContent = "…";` |
| réagir à un clic | `bouton.addEventListener("click", maFonction);` — sans parenthèses |
| charger son script | `<script src="script.js" defer></script>` dans le `<head>` |

---

[← Chapitre précédent](10-Mini-projet-le-nombre-mystere.md) · [Sommaire](Readme.md) · [Chapitre suivant →](B-Deboguer-seul.md)
