import { FilterPreset } from '@/types';

export const FILTER_PRESETS: Record<string, FilterPreset> = {
  flou: {
    id: 'flou',
    name: 'Mode Portrait',
    badge: 'Flou doux',
    emoji: '🤳',
    color: '#06b6d4',
    k: [1, 1, 1, 1, 1, 1, 1, 1, 1],
    d: 9,
    title: 'Mode Portrait (Flou d\'arrière-plan)',
    subtitle: 'Moyenne uniforme des 9 pixels voisins',
    desc: 'Chaque pixel devient la moyenne exacte de son entourage. Les micro-détails, le grain et les cassures nettes s’adoucissent comme sur un selfie avec fond flou.',
    tip: 'Tous les coefficients valent 1. Comme il y a 9 cases, on divise par 9 pour garder des valeurs équilibrées entre 0 et 255 !'
  },
  nettete: {
    id: 'nettete',
    name: 'Gaming 4K',
    badge: 'Netteté boost',
    emoji: '🎮',
    color: '#a855f7',
    k: [0, -1, 0, -1, 5, -1, 0, -1, 0],
    d: 1,
    title: 'Filtre Gaming 4K (Netteté Extrême)',
    subtitle: 'Renforcement du centre et soustraction des voisins',
    desc: 'Le pixel central est multiplié par 5, tandis que ses voisins immédiats sont soustraits. Cela fait ressortir les arêtes, les cheveux et les yeux avec un piqué spectaculaire.',
    tip: 'Formule secrète : Centre (+5) − 4 voisins direct (−1) = Somme des poids de 1. L\'image garde sa luminosité moyenne tout en devenant ultra ciselée !'
  },
  contours: {
    id: 'contours',
    name: 'Cyberpunk',
    badge: 'Néon Contours',
    emoji: '⚡',
    color: '#ec4899',
    k: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
    d: 1,
    title: 'Vision Cyberpunk (Détection de Contours)',
    subtitle: 'Laplacien / Détecteur de contrastes',
    desc: 'Isole les variations brusques de lumière. Si une zone a la même couleur partout, le calcul fait zéro (noir absolu). Seuls les contrastes vifs s\'illuminent en néon fluo !',
    tip: 'Si les 9 pixels valent 100 : (100 × 8) − (8 × 100) = 0. C\'est pour cela que les aplats deviennent noirs et que seules les lignes de silhouette apparaissent.'
  },
  emboss: {
    id: 'emboss',
    name: 'Relief 3D',
    badge: 'Gravure / Emboss',
    emoji: '🗿',
    color: '#eab308',
    k: [-2, -1, 0, -1, 1, 1, 0, 1, 2],
    d: 1,
    title: 'Effet 3D Relief (Sculpture dans la roche)',
    subtitle: 'Gradient directionnel diagonal',
    desc: 'Simule une source de lumière fictive venue du coin supérieur gauche. Les pentes sombres s\'assombrissent et les pentes claires s\'illuminent, donnant une impression de 3D.',
    tip: 'En opposant des coefficients négatifs en haut à gauche et positifs en bas à droite, on crée une fausse ombre portée en direct !'
  },
  custom: {
    id: 'custom',
    name: 'Custom Lab',
    badge: 'Mode Créateur',
    emoji: '🎛️',
    color: '#10b981',
    k: [0, -1, 0, -1, 5, -1, 0, -1, 0],
    d: 1,
    title: 'Custom Matrix Lab (Ton filtre inventé)',
    subtitle: 'Compose ta matrice 3×3 librement',
    desc: 'Clique sur + et − sur les cellules de la matrice pour tester tes propres idées et inventer de nouveaux filtres jamais vus.',
    tip: 'Clique sur "⚖️ Normaliser auto" si ton filtre rend l\'image trop sombre ou trop blanche !'
  }
};
