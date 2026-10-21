import { IAptitudeQuestion } from '../types';

export const APTITUDE_QUESTION_BANK: IAptitudeQuestion[] = [
  // Quantitative Aptitude
  {
    id: 1,
    category: 'Quantitative',
    question: 'A train running at 72 km/hr crosses a platform 200 meters long in 20 seconds. What is the length of the train?',
    options: ['150 meters', '200 meters', '250 meters', '300 meters'],
    correctAnswer: 1, // 200 meters: 72*(5/18)=20 m/s; Dist = 20*20 = 400m; Train = 400-200 = 200m
    explanation: 'Speed = 72 * (5/18) = 20 m/s. Total distance in 20s = 20 * 20 = 400 meters. Length of train = 400 - 200 = 200 meters.'
  },
  {
    id: 2,
    category: 'Quantitative',
    question: 'A and B together can complete a piece of work in 12 days, while A alone can do it in 20 days. In how many days can B alone complete the work?',
    options: ['25 days', '30 days', '35 days', '40 days'],
    correctAnswer: 1, // 30 days: 1/B = 1/12 - 1/20 = (5-3)/60 = 2/60 = 1/30
    explanation: '1/B = 1/12 - 1/20 = (5 - 3)/60 = 2/60 = 1/30. Therefore, B alone takes 30 days.'
  },
  {
    id: 3,
    category: 'Quantitative',
    question: 'If a sum of money doubles itself at simple interest in 8 years, what is the rate of interest per annum?',
    options: ['10%', '12.5%', '15%', '16.6%'],
    correctAnswer: 1, // 12.5%: SI = P -> P*R*8/100 = P -> R = 100/8 = 12.5%
    explanation: 'Let Principal be P. Simple Interest = P in 8 years. Rate = (SI * 100) / (P * T) = (P * 100) / (P * 8) = 12.5%.'
  },
  
  // Logical Reasoning
  {
    id: 4,
    category: 'Logical Reasoning',
    question: 'Look at this series: 7, 10, 8, 11, 9, 12, ... What number should come next?',
    options: ['7', '10', '12', '13'],
    correctAnswer: 1, // 10: Alternating pattern (+3, -2) -> 12 - 2 = 10
    explanation: 'This is an alternating addition and subtraction series: 7(+3)=10, 10(-2)=8, 8(+3)=11, 11(-2)=9, 9(+3)=12, 12(-2)=10.'
  },
  {
    id: 5,
    category: 'Logical Reasoning',
    question: 'Pointing to a photograph, a man said, "I have no brother, and that man\'s father is my father\'s son." Whose photograph was it?',
    options: ['His father', 'His own', 'His son', 'His nephew'],
    correctAnswer: 2, // His son: "my father's son" = himself. "that man's father is himself" -> his son.
    explanation: 'Since the speaker has no brother, "my father\'s son" is the speaker himself. Therefore, the photograph is of his son.'
  },
  {
    id: 6,
    category: 'Logical Reasoning',
    question: 'Statements: All mangoes are golden-colored. No golden-colored things are cheap. Conclusion I: All mangoes are cheap. Conclusion II: Golden-colored mangoes are not cheap.',
    options: ['Only conclusion I follows', 'Only conclusion II follows', 'Either I or II follows', 'Neither I nor II follows'],
    correctAnswer: 1, // Only conclusion II follows
    explanation: 'Since all mangoes are golden-colored and golden-colored things are not cheap, golden-colored mangoes are certainly not cheap.'
  },

  // Verbal Ability
  {
    id: 7,
    category: 'Verbal Ability',
    question: 'Choose the word that is most nearly OPPOSITE in meaning to: CANDID',
    options: ['Deceptive', 'Frank', 'Genuine', 'Outspoken'],
    correctAnswer: 0, // Deceptive
    explanation: 'Candid means truthful and straightforward. The opposite is deceptive or guarded.'
  },
  {
    id: 8,
    category: 'Verbal Ability',
    question: 'Identify the grammatically correct sentence:',
    options: [
      'Neither the manager nor the employees was available for comment.',
      'Neither the manager nor the employees were available for comment.',
      'Neither the manager or the employees was available for comment.',
      'Neither the manager and the employees were available for comment.'
    ],
    correctAnswer: 1, // Subject closer to verb is plural ("employees were")
    explanation: 'In "neither... nor" constructions, the verb agrees with the subject closest to it ("employees were").'
  },

  // Data Interpretation
  {
    id: 9,
    category: 'Data Interpretation',
    question: 'A company reports Q1 revenue of $120k with 20% profit margin and Q2 revenue of $150k with 24% profit margin. What is the total profit for both quarters?',
    options: ['$54k', '$60k', '$65k', '$72k'],
    correctAnswer: 1, // Q1 = 24k, Q2 = 36k -> Total = 60k
    explanation: 'Q1 Profit = 20% of $120k = $24k. Q2 Profit = 24% of $150k = $36k. Total Profit = $24k + $36k = $60k.'
  },
  {
    id: 10,
    category: 'Data Interpretation',
    question: 'In a software team of 50 engineers, 30 know Python, 25 know JavaScript, and 10 know both. How many engineers know neither Python nor JavaScript?',
    options: ['5', '8', '10', '15'],
    correctAnswer: 0, // Union = 30 + 25 - 10 = 45 -> Neither = 50 - 45 = 5
    explanation: 'Total with at least one skill = 30 + 25 - 10 = 45. Engineers with neither = 50 - 45 = 5.'
  }
];
