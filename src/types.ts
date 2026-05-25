export interface Clue {
  q: string;
  a: string;
}

export interface Category {
  name: string;
  clues: Clue[];
}

export interface Team {
  name: string;
  score: number;
}

export interface ActiveClue {
  categoryName: string;
  categoryIdx: number;
  clueIdx: number;
  points: number;
  question: string;
  answer: string;
}
