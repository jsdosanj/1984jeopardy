import type { Question, Team } from "../types";

export const makeTeams = (count: number): Team[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `Team ${i + 1}`,
    score: 0
  }));

export const findQuestion = (questions: Question[], id: string) =>
  questions.find((q) => q.id === id);

export const nextTeam = (current: number, total: number) => (current + 1) % total;
