export type Team = {
  id: number;
  name: string;
  score: number;
};

export type Question = {
  category: string;
  points: number;
  clue: string;
  answer: string;
  used: boolean;
  id: string;
};

export type GamePhase =
  | "intro"
  | "teamSetup"
  | "rules"
  | "progress1"
  | "progress2"
  | "progress3"
  | "board"
  | "question"
  | "final"
  | "printable";

export type ActionLog =
  | { type: "score"; teamId: number; delta: number; questionId: string }
  | { type: "used"; questionId: string }
  | { type: "manual-score"; teamId: number; oldScore: number; newScore: number };
