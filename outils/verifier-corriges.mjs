// Vérifie que chaque corrigé du support passe les tests de son exercice.
//
//   node outils/verifier-corriges.mjs
//
// Les corrigés sont les blocs ```javascript qui suivent un commentaire
// <!-- corrigé 4.2 --> dans les chapitres. Chacun est passé aux tests de
// l'exercice 4.2, déclarés dans exercices/. Le code de départ de l'exercice,
// lui, ne doit pas les passer : sinon l'exercice serait déjà résolu.
//
// Le moteur est celui du playground (playground/moteur.js), exécuté ici dans
// un contexte `vm` à la place du worker du navigateur. Les exercices en mode
// page, qui ont besoin d'un vrai navigateur, sont listés à part : ils se
// vérifient dans le playground. Aucune dépendance : Node 18 ou plus suffit.

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Le moteur et les exercices s'enregistrent sur l'objet global.
vm.runInThisContext(fs.readFileSync(path.join(racine, 'playground', 'moteur.js'), 'utf8'), { filename: 'moteur.js' });
for (const f of fs.readdirSync(path.join(racine, 'exercices')).filter((f) => f.endsWith('.js')).sort()) {
  vm.runInThisContext(fs.readFileSync(path.join(racine, 'exercices', f), 'utf8'), { filename: f });
}
const { Moteur, EXERCICES } = globalThis;

// Lancer un script comme le ferait le worker, dans un contexte isolé.
Moteur.configurer({
  lancer(source, delai, surMessage) {
    const bac = { console: {}, postMessage: (m) => surMessage(m) };
    vm.createContext(bac);
    bac.self = bac;
    try {
      new vm.Script(source, { filename: 'votre-code.js' }).runInContext(bac, { timeout: delai });
    } catch (e) {
      if (e && e.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT') return Promise.resolve({ delaiDepasse: true });
      const pile = String((e && e.stack) || '');
      const m = /votre-code\.js:(\d+)(?::(\d+))?/.exec(pile);
      return Promise.resolve({
        erreur: {
          message: (e && e.name ? e.name + ': ' : '') + (e && e.message),
          ligne: m ? Number(m[1]) : null,
          colonne: m && m[2] ? Number(m[2]) : null,
          pile,
        },
      });
    }
    return Promise.resolve({});
  },
});

// Les corrigés, chapitre par chapitre.
const corriges = new Map();
const chapitres = fs.readdirSync(racine).filter((f) => /^\d+[-._ ].*\.md$/.test(f)).sort();
for (const f of chapitres) {
  const texte = fs.readFileSync(path.join(racine, f), 'utf8');
  const motif = /<!--\s*corrigé\s+(\S+)\s*-->\s*\n+\s*```(?:javascript|js)\n([\s\S]*?)\n\s*```/g;
  for (const [, id, code] of texte.matchAll(motif)) {
    if (corriges.has(id)) console.log(`⚠️  ${id} : deux corrigés (${corriges.get(id).fichier} et ${f})`);
    corriges.set(id, { code: code + '\n', fichier: f });
  }
}

const resume = (resultats) => resultats.filter((r) => !r.ok).map((r) =>
  `      ❌ ${r.nom} : ${r.message || ''}${r.erreur ? ` [${r.erreur.message}${r.erreur.ligne ? `, ligne ${r.erreur.ligne}` : ''}]` : ''}` +
  (r.obtenu !== undefined && r.attendu !== undefined && !r.erreur ? `\n         attendu ${JSON.stringify(r.attendu)}, obtenu ${JSON.stringify(r.obtenu)}` : '')).join('\n');

let echecs = 0;
const pages = [];
for (const ex of EXERCICES) {
  const corrige = corriges.get(ex.id);
  if (!corrige) {
    console.log(`⚠️  ${ex.id} ${ex.titre} : aucun corrigé trouvé dans les chapitres`);
    echecs++;
    continue;
  }
  if (ex.mode === 'page') {
    pages.push(ex.id);
    continue;
  }
  const avec = await Moteur.tester(ex, corrige.code, '');
  const ok = avec.every((r) => r.ok);
  const depart = await Moteur.tester(ex, ex.depart || '', '');
  const departPasse = depart.every((r) => r.ok);
  if (!ok) echecs++;
  if (departPasse) echecs++;
  console.log(`${ok ? '✅' : '❌'} ${ex.id.padEnd(5)} ${ex.titre}` +
    `${ok ? '' : '\n' + resume(avec)}${departPasse ? '\n      ⚠️  le code de départ passe déjà tous les tests' : ''}`);
}
for (const id of corriges.keys()) {
  if (!EXERCICES.some((ex) => ex.id === id)) {
    console.log(`⚠️  corrigé ${id} (${corriges.get(id).fichier}) : aucun exercice ne porte ce numéro`);
    echecs++;
  }
}
if (pages.length) console.log(`\nMode page, à vérifier dans le playground : ${pages.join(', ')}`);
console.log(`\n${EXERCICES.length} exercices, ${corriges.size} corrigés, ${echecs} problème(s).`);
process.exit(echecs ? 1 : 0);
