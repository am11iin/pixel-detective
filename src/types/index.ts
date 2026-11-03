export type MissionKey = 'home' | 'm1' | 'm2' | 'm3' | 'm4' | 'm5' | 'm6';

export interface FilterPreset {
  id: string;
  name: string;
  badge: string;
  emoji: string;
  k: number[];
  d: number;
  title: string;
  subtitle: string;
  desc: string;
  tip: string;
  color: string;
}

export interface Question {
  id: number;
  pts: number;
  task: 'm1' | 'm2' | 'm3' | 'm4' | 'm5';
  taskName: string;
  q: string;
  opts: string[];
  correct: number;
  explain: string;
}

export interface TaskDiagnosis {
  key: 'm1' | 'm2' | 'm3' | 'm4' | 'm5';
  name: string;
  score: number;
  maxScore: number;
  passed: boolean;
  advice: string;
  tip: string;
}

export interface PlayerStats {
  xp: number;
  rank: string;
  stars: Record<string, number>;
  soundEnabled: boolean;
}
