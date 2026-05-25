import type { Question } from "../types";

export const categories = [
  "The Road to June 1984",
  "Operation Blue Star Day by Day",
  "Eyewitness Accounts",
  "Myths vs Facts",
  "November 1984"
];

const byCategory: Record<string, { points: number; clue: string; answer: string }[]> = {
  "The Road to June 1984": [
    { points: 100, clue: "This peaceful protest movement launched in 1982 by Sant Bhindranwale demanded implementation of the Anandpur Sahib Resolution", answer: "What is the Dharam Yudh Morcha?" },
    { points: 200, clue: "This journalist wrote that Prime Minister Indira Gandhi sabotaged agreement at least three times during negotiations with Sikh leaders", answer: "Who is Kuldip Nayar?" },
    { points: 300, clue: "This was the planned act of civil disobedience scheduled for June 3rd 1984 which the government used as justification for military action", answer: "What is withholding grain shipments from Punjab?" },
    { points: 400, clue: "The Indian army built a model of the Golden Temple this many years before the attack to plan the operation", answer: "What is 1982 two years before the attack?" },
    { points: 500, clue: "This foreign military was involved in advising on the attack in February 1984", answer: "What is the UK armed forces?" }
  ],
  "Operation Blue Star Day by Day": [
    { points: 100, clue: "This is the name given to the 10-day military assault on the Golden Temple complex", answer: "What is Operation Blue Star also known as Saka Neela Tara?" },
    { points: 200, clue: "On June 3rd 1984 the government enacted this across the entire state of Punjab to limit witnesses", answer: "What is a 36-hour curfew?" },
    { points: 300, clue: "The attack on June 4th was poorly timed because this religious occasion had brought nearly 10000 pilgrims to the complex", answer: "What is Gurpurab a Sikh religious festival?" },
    { points: 400, clue: "General K S Brar boasted the army would have Sikh fighters on their knees in just two hours but the resistance lasted this many days", answer: "What is 10 days?" },
    { points: 500, clue: "This Sikh institution representing the highest seat of Sikh spiritual and political sovereignty was reduced to rubble by tank fire on June 6th", answer: "What is the Akal Takhat?" }
  ],
  "Eyewitness Accounts": [
    { points: 100, clue: "Devinder Singh Duggal held this position inside the Golden Temple complex making him a key eyewitness to the army attack", answer: "What is in-charge of the Sikh Reference Library?" },
    { points: 200, clue: "This eyewitness described seeing a large number of boys blown to pieces from helicopter fire during the attack", answer: "Who is Devinder Singh Duggal?" },
    { points: 300, clue: "A young college girl trapped in the complex described seeing these sacred items flying through the air during the assault on the Akal Takhat", answer: "What are pages of the Guru Granth Sahib?" },
    { points: 400, clue: "The Government White Paper claimed no fire was directed at Harmandir Sahib but this completely blind head Ragi was shot and killed inside it", answer: "Who is Bhai Amrik Singh Hazuri Raagi?" },
    { points: 500, clue: "This Associated Press journalist was the only foreign correspondent who stayed in Amritsar during the attack and was later charged with sedition", answer: "Who is Brahma Challaney?" }
  ],
  "Myths vs Facts": [
    { points: 100, clue: "The government claimed the attack was last-minute and unplanned but the army had done this as early as 1982 to prepare", answer: "What is building a model of the Golden Temple?" },
    { points: 200, clue: "The government claimed minimal casualties but the actual estimated death toll from the attack was over this number", answer: "What is 5000 people?" },
    { points: 300, clue: "The government claimed Sikhi was not the target but three days after the attack the army destroyed this irreplaceable institution inside the complex", answer: "What is the Central Sikh Reference Library?" },
    { points: 400, clue: "The government claimed November 1984 was a spontaneous riot but organizers armed mobs with these items along with addresses of Sikh homes", answer: "What are machetes and tires?" },
    { points: 500, clue: "After this many government commissions the perpetrators of the November 1984 killings still have not faced justice", answer: "What is 10 commissions?" }
  ],
  "November 1984": [
    { points: 100, clue: "Indira Gandhi was killed by these two Sikh bodyguards both remembered as shaheeds", answer: "Who are Bhai Beant Singh and Bhai Satwant Singh?" },
    { points: 200, clue: "After Indira Gandhi was killed organized killings of Sikhs lasted for this many days", answer: "What is three days?" },
    { points: 300, clue: "The police actively prevented Sikhs from defending themselves by doing this making them vulnerable to mobs", answer: "What is disarming and dispersing them?" },
    { points: 400, clue: "Army units near Delhi could have restored order in 12 hours but were held at their base until this many Sikhs had been killed", answer: "What is 8000 Sikhs?" },
    { points: 500, clue: "This Indian politician and economist documented that the government disinformation campaign aimed to portray the Golden Temple as a haven of criminals", answer: "Who is Subramaniam Swami?" }
  ]
};

export const initialQuestions: Question[] = categories.flatMap((category) =>
  byCategory[category].map((q) => ({
    ...q,
    category,
    used: false,
    id: `${category}-${q.points}`
  }))
);
