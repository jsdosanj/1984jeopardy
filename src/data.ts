import type { Question } from "./types";

export const categories = [
  "The Road to June 1984",
  "Operation Blue Star Day by Day",
  "Eyewitness Accounts",
  "Myths vs Facts",
  "November 1984"
] as const;

export const questions: Question[] = [
  {
    id: "The Road to June 1984-100",
    category: "The Road to June 1984",
    points: 100,
    clue: "This peaceful protest movement launched in 1982 by Sant Bhindranwale demanded implementation of the Anandpur Sahib Resolution",
    answer: "What is the Dharam Yudh Morcha?",
    used: false
  },
  {
    id: "The Road to June 1984-200",
    category: "The Road to June 1984",
    points: 200,
    clue: "This journalist wrote that Prime Minister Indira Gandhi sabotaged agreement at least three times during negotiations with Sikh leaders",
    answer: "Who is Kuldip Nayar?",
    used: false
  },
  {
    id: "The Road to June 1984-300",
    category: "The Road to June 1984",
    points: 300,
    clue: "This was the planned act of civil disobedience scheduled for June 3rd 1984 which the government used as justification for military action",
    answer: "What is withholding grain shipments from Punjab?",
    used: false
  },
  {
    id: "The Road to June 1984-400",
    category: "The Road to June 1984",
    points: 400,
    clue: "The Indian army built a model of the Golden Temple this many years before the attack to plan the operation",
    answer: "What is 1982 two years before the attack?",
    used: false
  },
  {
    id: "The Road to June 1984-500",
    category: "The Road to June 1984",
    points: 500,
    clue: "This foreign military was involved in advising on the attack in February 1984",
    answer: "What is the UK armed forces?",
    used: false
  }
];
