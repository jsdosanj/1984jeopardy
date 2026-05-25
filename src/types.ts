export interface Clue {
  q: string;
  a: string;
}

export interface Category {
  name: string;
  clues: Clue[];
}

export interface Team {
  id: number;
  name: string;
  score: number;
  color: string;
}

export interface ActiveClue {
  categoryName: string;
  categoryIdx: number;
  clueIdx: number;
  points: number;
  question: string;
  answer: string;
  isDailyDouble: boolean;
}

export type GameState = 'setup' | 'board' | 'clue' | 'victory';

export interface GameConfig {
  numTeams: number;
  teamNames: string[];
}
