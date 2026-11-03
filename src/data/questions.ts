import { Question } from '@/types';

export const EXAM_QUESTIONS: Question[] = [
  // PARTIE 1 : Questions Fondamentales (8 points = 40 pts)
  {
    id: 1,
    pts: 8,
    task: 'm1',
    taskName: 'Tâche 1 : Les Pixels (0-255)',
    q: 'Quelle est la valeur numérique d’un pixel BLANC pur dans une image numérique ?',
    opts: [
      '0 (obscurité complète)',
      '128 (gris moyen)',
      '255 (lumière maximale)'
    ],
    correct: 2,
    explain: 'L’intensité d’un pixel en niveaux de gris va de 0 (noir absolu / éteint) à 255 (blanc pur / allumé à fond).'
  },
  {
    id: 2,
    pts: 8,
    task: 'm2',
    taskName: 'Tâche 2 : Les Voisins & Moyenne',
    q: 'Un filtre de flou 3×3 remplace le pixel central par la moyenne des 9 cases. Si 8 pixels valent 20 et le pixel du milieu vaut 92, quelle est la nouvelle valeur ?',
    opts: ['20', '28', '92', '252'],
    correct: 1,
    explain: 'Calcul étape par étape : (8 × 20) + 92 = 160 + 92 = 252. Puis la moyenne : 252 ÷ 9 = 28. Le pic à 92 est adouci !'
  },
  {
    id: 3,
    pts: 8,
    task: 'm3',
    taskName: 'Tâche 3 : Coefficients & Normalisation',
    q: 'Dans une matrice avec coefficients (comme un bulletin de notes), le centre a le poids 4 et chaque coin a le poids 1. Combien de fois le centre compte-t-il plus qu’un coin ?',
    opts: ['4 fois plus', '2 fois plus', '16 fois plus'],
    correct: 0,
    explain: 'Le centre compte 4 fois et un coin compte 1 fois. Le centre a donc un coefficient exactement 4 fois supérieur.'
  },
  {
    id: 4,
    pts: 8,
    task: 'm4',
    taskName: 'Tâche 4 : Studio Filtres (Effets Réels)',
    q: 'On applique un filtre de détection de contours (vision cyberpunk) sur un ciel dégagé où TOUS les pixels valent 80. Que devient cette zone ?',
    opts: [
      'Elle reste grise à 80',
      'Elle devient complètement noire (valeur 0)',
      'Elle devient blanche étincelante (255)'
    ],
    correct: 1,
    explain: 'Le filtre de contours calcule l’écart entre un pixel et ses voisins. Comme tous les pixels sont identiques (80), l’écart est 0 : la zone devient noire. Seuls les contrastes ressortent !'
  },
  {
    id: 5,
    pts: 8,
    task: 'm5',
    taskName: 'Tâche 5 : Détection Visuelle & Mystère',
    q: 'Une photo très nette et granuleuse est passée dans un filtre : les détails fins ont disparu, la peau s’est adoucie et les cassures se sont estompées. Quel filtre a été utilisé ?',
    opts: [
      'Mode Portrait (Flou doux)',
      'Détection de contours (Néon)',
      'Gaming 4K (Netteté renforcée)'
    ],
    correct: 0,
    explain: 'Le flou calcule la moyenne locale, ce qui élimine les hautes fréquences (le grain, les arêtes vives) pour lisser l’image.'
  },

  // PARTIE 2 : Questions Approfondies (12 points = 60 pts)
  {
    id: 6,
    pts: 12,
    task: 'm3',
    taskName: 'Tâche 3 : Coefficients & Normalisation',
    q: 'Calcul de sortie : tu as appliqué une matrice. La somme de toutes les multiplications vaut 300, et la somme des coefficients vaut 6. Quelle sera la valeur finale du pixel ?',
    opts: ['300', '50', '60', '1800'],
    correct: 1,
    explain: 'On divise toujours la somme pondérée par la somme des coefficients : 300 ÷ 6 = 50.'
  },
  {
    id: 7,
    pts: 12,
    task: 'm4',
    taskName: 'Tâche 4 : Studio Filtres (Effets Réels)',
    q: 'Filtre Netteté : la formule intuitive est [Nouveau pixel = Pixel + (Pixel − Moyenne des voisins)]. Si le pixel vaut 135 et la moyenne de ses voisins vaut 95, que donne le résultat ?',
    opts: ['135', '175', '230', '95'],
    correct: 1,
    explain: 'Écart : 135 − 95 = +40. Nouveau pixel = 135 + 40 = 175. Ce qui dépassait de la moyenne est amplifié !'
  },
  {
    id: 8,
    pts: 12,
    task: 'm4',
    taskName: 'Tâche 4 : Studio Filtres (Effets Réels)',
    q: 'Filtre Contours : un pixel est à la frontière entre un t-shirt sombre (40) et un mur clair (220). La moyenne vaut 100. L’écart sans signe vaut |40 − 100| = 60. Multiplié par 3 pour illuminer le contour, quelle est la valeur finale ?',
    opts: ['60', '0', '180', '255'],
    correct: 2,
    explain: '60 × 3 = 180. Comme le pixel est situé sur un contour contrasté, sa valeur saute à 180 : il brille en néon !'
  },
  {
    id: 9,
    pts: 12,
    task: 'm3',
    taskName: 'Tâche 3 : Coefficients & Normalisation',
    q: 'Que se passe-t-il si tu appliques un flou 3×3 en additionnant les 9 pixels, mais que tu OUBLIES de diviser par 9 ?',
    opts: [
      'L’image devient presque toute blanche (les valeurs dépassent 255 et saturent)',
      'L’image devient noire',
      'L’image devient plus nette',
      'Rien ne change'
    ],
    correct: 0,
    explain: 'En additionnant 9 pixels sans diviser par 9, les valeurs deviennent jusqu’à 9 fois trop grandes. Comme le maximum possible est 255, tout sature et l’image devient un flash blanc !'
  },
  {
    id: 10,
    pts: 12,
    task: 'm2',
    taskName: 'Tâche 2 : Les Voisins & Moyenne',
    q: 'Si tu appliques le filtre de flou DEUX fois de suite sur la même image, que devient-elle ?',
    opts: [
      'Elle revient magiquement à l’image originale nette',
      'Elle devient encore plus floue',
      'Elle s’inverse en négatif photo',
      'Elle se fige et devient noire'
    ],
    correct: 1,
    explain: 'Chaque nouveau passage de flou refait une moyenne sur des pixels déjà adoucis : le lissage s’étend plus loin et l’image devient encore plus floue.'
  }
];
