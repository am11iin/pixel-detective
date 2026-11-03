# 🕵️ Pixel Detective • ConvoQuest

> **Projet Pédagogique Interactif de Traitement d'Image** — Apprends la convolution et les filtres numériques par le jeu, conçu pour une niche de 15 à 19 ans sans prérequis mathématiques complexes.

---

## 🎯 Vue d'ensemble du Projet

La convolution est l'opération fondamentale qui fait fonctionner tous les filtres modernes sur smartphones (mode portrait flou, détection de contours style dessin animé, netteté dans les jeux vidéo 4K).

Au lieu d'aborder la convolution par des équations abstraites d'algèbre linéaire, **Pixel Detective** propose une approche immersive par le jeu :
1. **L'exploration tactile :** Manipule les pixels individuellement de 0 (noir) à 255 (blanc).
2. **Le voisinage 3×3 :** Comprends comment un pixel change de couleur en écoutant ses 8 voisins (filtre de flou).
3. **Les coefficients :** Comme un bulletin de notes, attribue des poids aux cases sans saturer l'image.
4. **Le Studio Filtres FX :** Expérimente les presets réels (*Mode Portrait, Gaming 4K, Cyberpunk Néon, Relief 3D*) et crée tes propres filtres dans une matrice 3×3 interactive.
5. **Le Filtre Mystère :** Mène l'enquête pour identifier le filtre utilisé pour altérer une image.
6. **L'Examen Final & Bilan Diagnostique :** Évalue ta compréhension sur 100 avec un diagnostic précis par compétence et des recommandations personnalisées.

---

## 🚀 Démarrage Rapide (Next.js)

### Prérequis
- [Node.js](https://nodejs.org) (v18+)

### Installation & Lancement

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement
npm run dev
```

Ouvre ensuite ton navigateur sur [http://localhost:3000](http://localhost:3000).

---

## 📁 Structure du Projet

```text
pixel-detective/
├── public/                 # Versions HTML autonomes & assets
│   ├── Pixel Detective4.html
│   └── Pixel Detective5.html
├── src/
│   ├── app/                # Next.js App Router (page.tsx, layout.tsx, globals.css)
│   ├── components/         # Composants modulaires des 5 missions et de l'examen
│   │   ├── Header.tsx      # HUD Arcade (XP, Rangs, Score, Sons)
│   │   ├── HomeSection.tsx # Carte des quêtes & Démo live 60 FPS
│   │   ├── Mission1Pixels.tsx
│   │   ├── Mission2Neighbors.tsx
│   │   ├── Mission3Coeffs.tsx
│   │   ├── Mission4StudioFilters.tsx # Studio Filtres FX & Matrice 3x3
│   │   ├── Mission5Mystery.tsx
│   │   └── Mission6Exam.tsx          # Examen sur 100 & Diagnostic par tâche
│   ├── data/               # Presets de filtres & questions de l'examen
│   ├── types/              # Définitions TypeScript
│   └── utils/              # Rendu Canvas 60 FPS & Synthétiseur Audio Web Audio API
└── Pixel_Detective_Rapport_etat.pdf # Rapport d'état d'avancement
```

---

## 🛠️ Technologies Utilisées

- **Framework :** [Next.js 16](https://nextjs.org) + [React 19](https://react.dev) (App Router)
- **Styling :** [Tailwind CSS v4](https://tailwindcss.com) (Thème Cyberpunk / Arcade Néon)
- **Rendu Graphique :** HTML5 Canvas API (Pixel-art optimisé à 60 FPS)
- **Audio Procédural :** Web Audio API (synthèse sonore 8-bit temps réel sans fichiers externes)
- **Langage :** TypeScript (typage strict sans warnings)
