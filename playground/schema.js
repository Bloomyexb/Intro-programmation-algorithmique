/*
 * Éditeur de schémas : des diagrammes de flux dessinés à la souris, à la
 * manière d'Excalidraw, avec les symboles du cours.
 *
 *   Schema.editeur(conteneur, { modele, surChangement })  l'éditeur
 *   Schema.rendre(modele)                                 un SVG en lecture seule
 *
 * Le modèle est un objet simple, enregistré tel quel dans le journal :
 *   { noeuds: [{ id, type, x, y, texte }], liens: [{ id, de, vers, texte, courbe }] }
 * (x, y) est le centre du nœud ; `courbe`, facultative, décale le point de
 * contrôle du lien par rapport à son milieu ({ dx, dy }), pour contourner une
 * forme. Tout texte est inséré avec textContent : un schéma lu dans un journal
 * ne peut rien exécuter.
 */
(function (racine) {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const POLICE = '15px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
  const LIGNE = 19;
  const GRILLE = 10;

  const TYPES = {
    debut: { nom: 'Début / fin', texte: 'Début', touche: 'D' },
    es: { nom: 'Entrée / sortie', texte: 'Lire …', touche: 'E' },
    action: { nom: 'Action', texte: 'action', touche: 'R' },
    decision: { nom: 'Décision', texte: 'condition ?', touche: 'L' },
    appel: { nom: 'Appel de fonction', texte: 'fonction()', touche: 'F' },
    texte: { nom: 'Texte libre', texte: 'texte', touche: 'T' },
  };

  // ---------------------------------------------------------------------------
  // Géométrie : la taille d'un nœud dépend de son texte.

  let contexteMesure = null;
  function largeurTexte(texte) {
    if (!contexteMesure) {
      contexteMesure = document.createElement('canvas').getContext('2d');
      contexteMesure.font = POLICE;
    }
    return contexteMesure.measureText(texte).width;
  }

  function lignesDe(noeud) {
    return String(noeud.texte == null ? '' : noeud.texte).split('\n');
  }

  function taille(noeud) {
    const lignes = lignesDe(noeud);
    const l = Math.max(...lignes.map(largeurTexte), 20);
    const h = lignes.length * LIGNE;
    switch (noeud.type) {
      case 'debut': return { l: Math.max(90, l + 44), h: Math.max(40, h + 18) };
      case 'es': return { l: Math.max(110, l + 56), h: Math.max(44, h + 20) };
      case 'decision': return { l: Math.max(120, 2 * l + 24), h: Math.max(64, 2 * h + 16) };
      case 'appel': return { l: Math.max(110, l + 44), h: Math.max(44, h + 20) };
      case 'texte': return { l: l + 12, h: h + 8 };
      default: return { l: Math.max(100, l + 32), h: Math.max(44, h + 20) };
    }
  }

  // Le point où un lien quitte le nœud, en direction de (vx, vy).
  function bord(noeud, vx, vy) {
    const { l, h } = taille(noeud);
    const dx = vx - noeud.x;
    const dy = vy - noeud.y;
    if (!dx && !dy) return { x: noeud.x, y: noeud.y };
    let t;
    if (noeud.type === 'decision') t = 1 / (Math.abs(dx) / (l / 2) + Math.abs(dy) / (h / 2));
    else t = Math.min(Math.abs(dx) ? (l / 2) / Math.abs(dx) : Infinity, Math.abs(dy) ? (h / 2) / Math.abs(dy) : Infinity);
    return { x: noeud.x + dx * t, y: noeud.y + dy * t };
  }

  function geometrieLien(lien, noeuds) {
    const a = noeuds.get(lien.de);
    const b = noeuds.get(lien.vers);
    if (!a || !b) return null;
    const mx = (a.x + b.x) / 2 + (lien.courbe ? lien.courbe.dx : 0);
    const my = (a.y + b.y) / 2 + (lien.courbe ? lien.courbe.dy : 0);
    const courbe = !!(lien.courbe && (lien.courbe.dx || lien.courbe.dy));
    const p0 = bord(a, courbe ? mx : b.x, courbe ? my : b.y);
    const p2 = bord(b, courbe ? mx : a.x, courbe ? my : a.y);
    // Le point de contrôle de la courbe passe par (mx, my) en son milieu.
    const c = courbe ? { x: 2 * mx - (p0.x + p2.x) / 2, y: 2 * my - (p0.y + p2.y) / 2 } : null;
    const milieu = courbe ? { x: mx, y: my } : { x: (p0.x + p2.x) / 2, y: (p0.y + p2.y) / 2 };
    const depart = c || p0;
    const angle = Math.atan2(p2.y - depart.y, p2.x - depart.x);
    return { p0, p2, c, milieu, angle };
  }

  // ---------------------------------------------------------------------------
  // Dessin.

  function el(nom, attributs, parent) {
    const e = document.createElementNS(NS, nom);
    for (const k in attributs) e.setAttribute(k, attributs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  function forme(type, l, h, parent, x, y) {
    const g = el('g', { class: 'schema-forme schema-' + type }, parent);
    const gauche = x - l / 2;
    const haut = y - h / 2;
    if (type === 'debut') el('rect', { x: gauche, y: haut, width: l, height: h, rx: h / 2, ry: h / 2 }, g);
    else if (type === 'es') {
      const pente = Math.min(16, l / 6);
      el('polygon', { points: [[gauche + pente, haut], [gauche + l, haut], [gauche + l - pente, haut + h], [gauche, haut + h]].join(' ') }, g);
    } else if (type === 'decision') {
      el('polygon', { points: [[x, haut], [gauche + l, y], [x, haut + h], [gauche, y]].join(' ') }, g);
    } else if (type === 'appel') {
      el('rect', { x: gauche, y: haut, width: l, height: h, rx: 3 }, g);
      el('line', { x1: gauche + 9, y1: haut, x2: gauche + 9, y2: haut + h }, g);
      el('line', { x1: gauche + l - 9, y1: haut, x2: gauche + l - 9, y2: haut + h }, g);
    } else if (type === 'texte') {
      el('rect', { x: gauche, y: haut, width: l, height: h, class: 'schema-cadre-texte' }, g);
    } else el('rect', { x: gauche, y: haut, width: l, height: h, rx: 4 }, g);
    return g;
  }

  function texte(lignes, x, y, parent, classe) {
    const t = el('text', { x, y: y - ((lignes.length - 1) * LIGNE) / 2, class: classe || 'schema-texte', 'text-anchor': 'middle', 'dominant-baseline': 'central' }, parent);
    lignes.forEach((ligne, i) => {
      const s = el('tspan', { x, dy: i ? LIGNE : 0 }, t);
      s.textContent = ligne || ' ';
    });
    return t;
  }

  function dessinerNoeud(noeud, parent) {
    const g = el('g', { class: 'schema-noeud', 'data-id': noeud.id }, parent);
    const { l, h } = taille(noeud);
    forme(noeud.type, l, h, g, noeud.x, noeud.y);
    texte(lignesDe(noeud), noeud.x, noeud.y, g);
    return g;
  }

  function dessinerLien(lien, noeuds, parent) {
    const geo = geometrieLien(lien, noeuds);
    if (!geo) return null;
    const g = el('g', { class: 'schema-lien', 'data-id': lien.id }, parent);
    const { p0, p2, c } = geo;
    const d = c ? `M${p0.x},${p0.y} Q${c.x},${c.y} ${p2.x},${p2.y}` : `M${p0.x},${p0.y} L${p2.x},${p2.y}`;
    el('path', { d, class: 'schema-zone-clic' }, g);
    el('path', { d, class: 'schema-trait' }, g);
    const a = geo.angle;
    const pointe = [[p2.x, p2.y], [p2.x - 12 * Math.cos(a - 0.4), p2.y - 12 * Math.sin(a - 0.4)], [p2.x - 12 * Math.cos(a + 0.4), p2.y - 12 * Math.sin(a + 0.4)]];
    el('polygon', { points: pointe.join(' '), class: 'schema-pointe' }, g);
    if (lien.texte) {
      const lignes = String(lien.texte).split('\n');
      const l = Math.max(...lignes.map(largeurTexte)) + 10;
      const h = lignes.length * LIGNE + 2;
      el('rect', { x: geo.milieu.x - l / 2, y: geo.milieu.y - h / 2, width: l, height: h, rx: 3, class: 'schema-fond-etiquette' }, g);
      texte(lignes, geo.milieu.x, geo.milieu.y, g, 'schema-texte schema-etiquette');
    }
    return { g, geo };
  }

  function indexer(modele) {
    return new Map((modele.noeuds || []).map((n) => [n.id, n]));
  }

  function normaliser(modele) {
    const m = modele && typeof modele === 'object' ? modele : {};
    const noeuds = Array.isArray(m.noeuds) ? m.noeuds.filter((n) => n && TYPES[n.type] && isFinite(n.x) && isFinite(n.y)) : [];
    const ids = new Set(noeuds.map((n) => n.id));
    const liens = Array.isArray(m.liens) ? m.liens.filter((l) => l && ids.has(l.de) && ids.has(l.vers)) : [];
    return {
      noeuds: noeuds.map((n) => ({ id: String(n.id), type: n.type, x: +n.x, y: +n.y, texte: String(n.texte == null ? '' : n.texte) })),
      liens: liens.map((l) => {
        const lien = { id: String(l.id), de: String(l.de), vers: String(l.vers), texte: String(l.texte == null ? '' : l.texte) };
        if (l.courbe && isFinite(l.courbe.dx) && isFinite(l.courbe.dy)) lien.courbe = { dx: +l.courbe.dx, dy: +l.courbe.dy };
        return lien;
      }),
    };
  }

  // Un schéma en lecture seule, cadré sur son contenu.
  function rendre(modeleBrut) {
    const modele = normaliser(modeleBrut);
    const svg = el('svg', { class: 'schema-svg schema-lecture', xmlns: NS });
    if (!modele.noeuds.length) {
      svg.setAttribute('viewBox', '0 0 300 40');
      texte(['(schéma vide)'], 150, 20, svg, 'schema-texte schema-vide');
      return svg;
    }
    const noeuds = indexer(modele);
    let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
    const etendre = (x, y) => { x1 = Math.min(x1, x); y1 = Math.min(y1, y); x2 = Math.max(x2, x); y2 = Math.max(y2, y); };
    for (const n of modele.noeuds) {
      const { l, h } = taille(n);
      etendre(n.x - l / 2, n.y - h / 2);
      etendre(n.x + l / 2, n.y + h / 2);
    }
    const liens = el('g', {}, svg);
    for (const l of modele.liens) {
      const r = dessinerLien(l, noeuds, liens);
      if (r && r.geo.c) etendre(r.geo.milieu.x, r.geo.milieu.y);
    }
    const formes = el('g', {}, svg);
    modele.noeuds.forEach((n) => dessinerNoeud(n, formes));
    const marge = 20;
    svg.setAttribute('viewBox', [x1 - marge, y1 - marge, x2 - x1 + 2 * marge, y2 - y1 + 2 * marge].join(' '));
    svg.setAttribute('width', Math.round(x2 - x1 + 2 * marge));
    return svg;
  }

  // ---------------------------------------------------------------------------
  // L'éditeur.

  function editeur(conteneur, options) {
    options = options || {};
    let modele = normaliser(options.modele);
    let outil = 'selection';
    let selection = null; // { type: 'noeud' | 'lien', id }
    let glisse = null;
    let saisie = null;
    const annulations = [];
    const retablissements = [];
    let compteur = Date.now() % 100000;
    const nouvelId = (prefixe) => prefixe + (++compteur).toString(36);

    conteneur.classList.add('schema-editeur');
    conteneur.innerHTML = '';
    const barre = document.createElement('div');
    barre.className = 'schema-barre';
    const aide = document.createElement('p');
    aide.className = 'schema-aide';
    aide.textContent = 'Choisissez une forme, puis cliquez dans la zone. Double-clic : écrire dans une forme ou sur une flèche. Flèche : glissez d\'une forme à une autre. Suppr : effacer. Ctrl+Z : annuler.';
    const zone = document.createElement('div');
    zone.className = 'schema-zone';
    zone.tabIndex = 0;
    const plan = document.createElement('div');
    plan.className = 'schema-plan';
    const svg = el('svg', { class: 'schema-svg', xmlns: NS });
    plan.appendChild(svg);
    zone.appendChild(plan);
    conteneur.append(barre, aide, zone);

    // La barre d'outils.
    const boutons = {};
    function bouton(id, libelle, titre, action, dessin) {
      const b = document.createElement('button');
      b.type = 'button';
      b.title = titre;
      b.setAttribute('aria-label', titre);
      if (dessin) {
        const icone = el('svg', { width: 26, height: 18, viewBox: '0 0 52 36', class: 'schema-icone' });
        dessin(icone);
        b.appendChild(icone);
      }
      if (libelle) b.appendChild(document.createTextNode(libelle));
      b.addEventListener('click', action);
      barre.appendChild(b);
      boutons[id] = b;
      return b;
    }
    bouton('selection', '↖', 'Sélectionner et déplacer (V)', () => choisirOutil('selection'));
    for (const type of Object.keys(TYPES)) {
      bouton(type, '', TYPES[type].nom + ' (' + TYPES[type].touche + ')', () => choisirOutil(type), (icone) => {
        if (type === 'texte') texte(['T'], 26, 18, icone, 'schema-texte schema-icone-texte');
        else forme(type, type === 'decision' ? 46 : 44, type === 'decision' ? 32 : 26, icone, 26, 18);
      });
    }
    bouton('fleche', '→', 'Flèche : glisser d\'une forme à une autre (A)', () => choisirOutil('fleche'));
    const separateur = document.createElement('span');
    separateur.className = 'schema-separateur';
    barre.appendChild(separateur);
    bouton('supprimer', '🗑', 'Supprimer la sélection (Suppr)', () => supprimer());
    bouton('annuler', '↶', 'Annuler (Ctrl+Z)', () => annuler());
    bouton('retablir', '↷', 'Rétablir (Ctrl+Y)', () => retablir());

    function choisirOutil(nom) {
      outil = nom;
      for (const id in boutons) boutons[id].classList.toggle('actif', id === nom);
      zone.classList.toggle('schema-outil-forme', !!TYPES[nom]);
      zone.classList.toggle('schema-outil-fleche', nom === 'fleche');
      zone.focus();
    }

    // Annuler, rétablir, et prévenir l'extérieur de chaque changement.
    const instantane = () => JSON.stringify(modele);
    function memoriser() {
      annulations.push(instantane());
      if (annulations.length > 60) annulations.shift();
      retablissements.length = 0;
    }
    function changer() {
      dessiner();
      if (options.surChangement) options.surChangement(JSON.parse(instantane()));
    }
    function annuler() {
      if (!annulations.length) return;
      retablissements.push(instantane());
      modele = JSON.parse(annulations.pop());
      selection = null;
      changer();
    }
    function retablir() {
      if (!retablissements.length) return;
      annulations.push(instantane());
      modele = JSON.parse(retablissements.pop());
      selection = null;
      changer();
    }

    function dessiner() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      const noeuds = indexer(modele);
      let largeur = 1100, hauteur = 760;
      for (const n of modele.noeuds) {
        largeur = Math.max(largeur, n.x + 240);
        hauteur = Math.max(hauteur, n.y + 200);
      }
      svg.setAttribute('width', largeur);
      svg.setAttribute('height', hauteur);
      plan.style.width = largeur + 'px';
      plan.style.height = hauteur + 'px';
      const couche = el('g', {}, svg);
      for (const l of modele.liens) {
        const r = dessinerLien(l, noeuds, couche);
        if (!r) continue;
        if (selection && selection.type === 'lien' && selection.id === l.id) {
          r.g.classList.add('schema-selection');
          el('circle', { cx: r.geo.milieu.x, cy: r.geo.milieu.y, r: 6, class: 'schema-poignee', 'data-poignee': l.id }, couche);
        }
      }
      for (const n of modele.noeuds) {
        const g = dessinerNoeud(n, couche);
        if (selection && selection.type === 'noeud' && selection.id === n.id) g.classList.add('schema-selection');
      }
      if (glisse && glisse.type === 'fleche' && glisse.courant) {
        const a = noeuds.get(glisse.de);
        el('line', { x1: a.x, y1: a.y, x2: glisse.courant.x, y2: glisse.courant.y, class: 'schema-trait schema-provisoire' }, couche);
      }
    }

    function point(evenement) {
      const r = svg.getBoundingClientRect();
      return { x: evenement.clientX - r.left, y: evenement.clientY - r.top };
    }
    const arrondi = (v) => Math.round(v / GRILLE) * GRILLE;

    function cible(evenement) {
      const poignee = evenement.target.closest('[data-poignee]');
      if (poignee) return { type: 'poignee', id: poignee.getAttribute('data-poignee') };
      const n = evenement.target.closest('.schema-noeud');
      if (n) return { type: 'noeud', id: n.getAttribute('data-id') };
      const l = evenement.target.closest('.schema-lien');
      if (l) return { type: 'lien', id: l.getAttribute('data-id') };
      return null;
    }
    const noeudSous = (p) => {
      for (let i = modele.noeuds.length - 1; i >= 0; i--) {
        const n = modele.noeuds[i];
        const { l, h } = taille(n);
        if (Math.abs(p.x - n.x) <= l / 2 && Math.abs(p.y - n.y) <= h / 2) return n;
      }
      return null;
    };

    svg.addEventListener('pointerdown', (e) => {
      if (saisie || e.button !== 0) return;
      zone.focus();
      const p = point(e);
      const c = cible(e);
      if (TYPES[outil]) {
        memoriser();
        const n = { id: nouvelId('n'), type: outil, x: arrondi(p.x), y: arrondi(p.y), texte: TYPES[outil].texte };
        modele.noeuds.push(n);
        selection = { type: 'noeud', id: n.id };
        choisirOutil('selection');
        changer();
        // Après le clic : sinon, le focus qu'il donne refermerait aussitôt la saisie.
        setTimeout(() => ecrire(n), 0);
        return;
      }
      if (outil === 'fleche') {
        if (c && c.type === 'noeud') {
          glisse = { type: 'fleche', de: c.id, courant: p };
          svg.setPointerCapture(e.pointerId);
        }
        return;
      }
      if (c && c.type === 'poignee') {
        glisse = { type: 'courbe', id: c.id, avant: instantane(), bouge: false };
        svg.setPointerCapture(e.pointerId);
        return;
      }
      if (c && c.type === 'noeud') {
        const n = modele.noeuds.find((x) => x.id === c.id);
        selection = { type: 'noeud', id: n.id };
        glisse = { type: 'deplacer', id: n.id, dx: p.x - n.x, dy: p.y - n.y, avant: instantane(), bouge: false };
        svg.setPointerCapture(e.pointerId);
      } else if (c && c.type === 'lien') {
        selection = { type: 'lien', id: c.id };
      } else {
        selection = null;
      }
      dessiner();
    });

    svg.addEventListener('pointermove', (e) => {
      if (!glisse) return;
      const p = point(e);
      if (glisse.type === 'deplacer') {
        const n = modele.noeuds.find((x) => x.id === glisse.id);
        const x = Math.max(20, arrondi(p.x - glisse.dx));
        const y = Math.max(20, arrondi(p.y - glisse.dy));
        if (x !== n.x || y !== n.y) {
          n.x = x;
          n.y = y;
          glisse.bouge = true;
          dessiner();
        }
      } else if (glisse.type === 'courbe') {
        const l = modele.liens.find((x) => x.id === glisse.id);
        const noeuds = indexer(modele);
        const a = noeuds.get(l.de);
        const b = noeuds.get(l.vers);
        l.courbe = { dx: Math.round(p.x - (a.x + b.x) / 2), dy: Math.round(p.y - (a.y + b.y) / 2) };
        if (Math.abs(l.courbe.dx) < 6 && Math.abs(l.courbe.dy) < 6) delete l.courbe;
        glisse.bouge = true;
        dessiner();
      } else if (glisse.type === 'fleche') {
        glisse.courant = p;
        dessiner();
      }
    });

    function finGlisse(e) {
      if (!glisse) return;
      const g = glisse;
      glisse = null;
      if (g.type === 'fleche') {
        const n = e ? noeudSous(point(e)) : null;
        if (n && n.id !== g.de && !modele.liens.some((l) => l.de === g.de && l.vers === n.id)) {
          memoriser();
          const lien = { id: nouvelId('l'), de: g.de, vers: n.id, texte: '' };
          modele.liens.push(lien);
          selection = { type: 'lien', id: lien.id };
          changer();
        } else dessiner();
      } else if (g.bouge) {
        annulations.push(g.avant);
        retablissements.length = 0;
        changer();
      }
    }
    svg.addEventListener('pointerup', finGlisse);
    svg.addEventListener('pointercancel', () => finGlisse(null));

    svg.addEventListener('dblclick', (e) => {
      // La capture du pointeur redirige le double-clic vers le SVG : on
      // retrouve ce qu'il y a sous le pointeur.
      const sous = document.elementFromPoint(e.clientX, e.clientY);
      const c = sous ? cible({ target: sous }) : null;
      if (!c) return;
      if (c.type === 'noeud') ecrire(modele.noeuds.find((x) => x.id === c.id));
      if (c.type === 'lien') ecrire(modele.liens.find((x) => x.id === c.id), true);
    });

    // Écrire dans une forme ou sur une flèche : une zone de texte posée dessus.
    function ecrire(objet, estLien) {
      if (!objet) return;
      const noeuds = indexer(modele);
      let x, y, l, h;
      if (estLien) {
        const geo = geometrieLien(objet, noeuds);
        x = geo.milieu.x; y = geo.milieu.y; l = 120; h = 30;
      } else {
        const t = taille(objet);
        x = objet.x; y = objet.y; l = Math.max(t.l, 140); h = Math.max(t.h, 36);
      }
      const champ = document.createElement('textarea');
      champ.className = 'schema-saisie';
      champ.value = objet.texte || '';
      champ.style.left = (x - l / 2) + 'px';
      champ.style.top = (y - h / 2) + 'px';
      champ.style.width = l + 'px';
      champ.style.height = h + 'px';
      champ.setAttribute('aria-label', 'Texte');
      plan.appendChild(champ);
      saisie = { champ, objet };
      champ.focus();
      champ.select();
      let fini = false;
      const terminer = (garder) => {
        if (fini) return;
        fini = true;
        const valeur = champ.value.replace(/\s+$/, '');
        champ.remove();
        saisie = null;
        if (garder && valeur !== (objet.texte || '')) {
          memoriser();
          objet.texte = valeur;
          changer();
        } else dessiner();
        zone.focus();
      };
      champ.addEventListener('keydown', (e) => {
        e.stopPropagation();
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          terminer(true);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          terminer(false);
        }
      });
      champ.addEventListener('blur', () => terminer(true));
    }

    function supprimer() {
      if (!selection) return;
      memoriser();
      if (selection.type === 'noeud') {
        const id = selection.id;
        modele.noeuds = modele.noeuds.filter((n) => n.id !== id);
        modele.liens = modele.liens.filter((l) => l.de !== id && l.vers !== id);
      } else {
        modele.liens = modele.liens.filter((l) => l.id !== selection.id);
      }
      selection = null;
      changer();
    }

    zone.addEventListener('keydown', (e) => {
      if (saisie) return;
      const ctrl = e.ctrlKey || e.metaKey;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        supprimer();
      } else if (ctrl && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) retablir();
        else annuler();
      } else if (ctrl && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        retablir();
      } else if (e.key === 'Escape') {
        selection = null;
        choisirOutil('selection');
        dessiner();
      } else if (e.key === 'Enter' && selection) {
        e.preventDefault();
        if (selection.type === 'noeud') ecrire(modele.noeuds.find((n) => n.id === selection.id));
        else ecrire(modele.liens.find((l) => l.id === selection.id), true);
      } else if (!ctrl && !e.altKey) {
        const touche = e.key.toUpperCase();
        if (touche === 'V') choisirOutil('selection');
        else if (touche === 'A') choisirOutil('fleche');
        else {
          const type = Object.keys(TYPES).find((t) => TYPES[t].touche === touche);
          if (type) choisirOutil(type);
        }
      }
    });

    choisirOutil('selection');
    dessiner();

    return {
      modele: () => JSON.parse(instantane()),
      charger(nouveau) {
        modele = normaliser(nouveau);
        selection = null;
        annulations.length = 0;
        retablissements.length = 0;
        dessiner();
      },
    };
  }

  racine.Schema = { editeur, rendre, normaliser, TYPES };
})(typeof window !== 'undefined' ? window : globalThis);
