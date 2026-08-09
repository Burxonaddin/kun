import { Rng } from './prng';
import {
  CITIES, FIRST_NAMES, MONTHS, PART1_SCENARIOS, PART2_TOPICS, PART3_TOPICS, PART4_TOPICS,
  PAYMENT_METHODS, STREETS, SURNAMES, WEEKDAYS,
} from './banks';
import type { ListeningPart, Question, QuestionGroup } from '../types';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

function gap(
  number: number,
  prompt: string,
  answer: string,
  explanation: string,
  wordLimit = 'ONE WORD AND/OR A NUMBER',
  extraAnswers: string[] = [],
): Question {
  return {
    number,
    type: 'form-completion',
    prompt,
    answers: [answer, ...extraAnswers],
    explanation,
    wordLimit,
  };
}

function mcq(number: number, prompt: string, options: string[], correctIndex: number, explanation: string): Question {
  return {
    number,
    type: 'multiple-choice',
    prompt,
    options: options.map((option, i) => `${LETTERS[i]}. ${option}`),
    answers: [LETTERS[correctIndex], options[correctIndex], `${LETTERS[correctIndex]}. ${options[correctIndex]}`],
    explanation,
  };
}

/** Shuffles the options of a multiple-choice question so the key is not always in the same place. */
function shuffledMcq(
  rng: Rng,
  number: number,
  prompt: string,
  options: string[],
  correctIndex: number,
  explanation: string,
): Question {
  const correctOption = options[correctIndex];
  const shuffled = rng.shuffle(options);
  return mcq(number, prompt, shuffled, shuffled.indexOf(correctOption), explanation);
}

function buildPart1(rng: Rng): ListeningPart {
  const scenario = rng.pick(PART1_SCENARIOS);
  const firstName = rng.pick(FIRST_NAMES);
  const surname = rng.pick(SURNAMES);
  const houseNumber = rng.int(2, 98);
  const street = rng.pick(STREETS);
  const city = rng.pick(CITIES);
  const phone = `07${rng.int(100, 999)} ${rng.int(100000, 999999)}`;
  const day = rng.int(1, 28);
  const month = rng.pick(MONTHS);
  const hour = rng.int(9, 18);
  const minute = rng.pick(['00', '15', '30', '45']);
  const price = rng.int(15, 240);
  const item = rng.pick(scenario.items);
  const extra = rng.pick(scenario.extras);
  const requirement = rng.pick(scenario.requirements);
  const payment = rng.pick(PAYMENT_METHODS);

  const time = `${hour}.${minute}`;
  const date = `${day} ${month}`;

  const questions: Question[] = [
    gap(1, 'Surname:', surname, `The caller spells the surname: "${surname.toUpperCase().split('').join('-')}".`, 'ONE WORD'),
    gap(2, 'Address: house number', String(houseNumber), `The caller says the address is ${houseNumber} ${street}.`),
    gap(3, 'Street name:', street.split(' ')[0], `The street is ${street}; only the distinctive word is needed.`, 'ONE WORD'),
    gap(4, 'Town:', city, `The caller lives in ${city}.`, 'ONE WORD'),
    gap(5, 'Phone number:', phone.replace(/\s/g, ''), `The number given is ${phone}.`, 'A NUMBER', [phone]),
    gap(6, `Date of first ${scenario.service} appointment:`, date, `They agree on ${date}.`, 'A DATE', [`${day} of ${month}`]),
    gap(7, 'Time of appointment:', time, `The time arranged is ${time}.`, 'A TIME', [`${hour}:${minute}`]),
    gap(8, `${scenario.itemLabel}:`, item, `The caller chooses the ${item} option.`, 'NO MORE THAN TWO WORDS'),
    gap(9, 'Total cost: \u00a3', String(price), `The cost quoted is \u00a3${price}.`, 'A NUMBER', [`£${price}`]),
    gap(10, `${scenario.requirementLabel}:`, requirement, `The assistant asks the caller to bring ${requirement}.`, 'NO MORE THAN TWO WORDS'),
  ];

  const transcript = [
    `Receptionist: Good morning, ${scenario.organisation}, how can I help you?`,
    `Caller: Hello, I'd like to arrange a ${scenario.service}, please.`,
    `Receptionist: Certainly. Could I take your name?`,
    `Caller: Yes, it's ${firstName} ${surname} \u2014 that's ${surname.toUpperCase().split('').join('-')}.`,
    `Receptionist: Thank you. And your address?`,
    `Caller: It's ${houseNumber} ${street}, in ${city}.`,
    `Receptionist: Lovely. A contact number?`,
    `Caller: ${phone.split('').join(' ')}. Sorry, that's ${phone}.`,
    `Receptionist: Great. When would suit you?`,
    `Caller: Could we say ${day} ${month} — the ${day}th of ${month}?`,
    `Receptionist: We have ${time} free on that day.`,
    `Caller: ${time} is fine.`,
    `Receptionist: And which option would you like? We offer ${scenario.items.join(', ')}.`,
    `Caller: The ${item} one, I think.`,
    `Receptionist: That comes to \u00a3${price} in total, and you can pay by ${payment}. ${scenario.extraLabel} is a ${extra}.`,
    `Caller: Perfect. Is there anything I need to bring?`,
    `Receptionist: Just your ${requirement}, and please arrive ten minutes early.`,
  ].join('\n');

  const group: QuestionGroup = {
    id: 'l-p1',
    type: 'form-completion',
    instructions: 'Questions 1\u201310. Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.',
    questions,
  };

  return {
    number: 1,
    title: `Part 1 \u2013 ${scenario.title}`,
    context: `A telephone conversation between a caller and a member of staff at ${scenario.organisation}.`,
    transcript,
    groups: [group],
  };
}

function buildPart2(rng: Rng): ListeningPart {
  const topic = rng.pick(PART2_TOPICS);
  const openingYear = rng.int(1968, 2023);
  const visitors = rng.int(20, 90) * 1000;
  const closedDay = rng.pick(WEEKDAYS);
  const fee = rng.int(3, 18);
  const areas = rng.sample(topic.areas, 5);
  const features = rng.shuffle(topic.features).slice(0, 5);

  const mcqData: { prompt: string; options: string[]; correct: number; explanation: string }[] = [
    {
      prompt: `When did ${topic.place} first open?`,
      options: [String(openingYear - 7), String(openingYear), String(openingYear + 4), String(openingYear + 11)],
      correct: 1,
      explanation: `The speaker says it opened in ${openingYear}.`,
    },
    {
      prompt: 'Approximately how many people use it each year?',
      options: [
        `${(visitors - 10000).toLocaleString()}`,
        `${visitors.toLocaleString()}`,
        `${(visitors + 15000).toLocaleString()}`,
        `${(visitors * 2).toLocaleString()}`,
      ],
      correct: 1,
      explanation: `About ${visitors.toLocaleString()} people use it annually.`,
    },
    {
      prompt: 'On which day is it closed to the public?',
      options: WEEKDAYS.filter((d) => d !== closedDay).slice(0, 3).concat(closedDay),
      correct: 3,
      explanation: `The speaker mentions that it closes on ${closedDay}.`,
    },
    {
      prompt: 'What does the speaker say about the entrance charge?',
      options: [
        'It has been abolished completely.',
        `It is \u00a3${fee} for adults but free for children.`,
        'It only applies at weekends.',
        'It will double next year.',
      ],
      correct: 1,
      explanation: `Adults pay \u00a3${fee} while children enter free.`,
    },
    {
      prompt: 'What does the speaker recommend for a first visit?',
      options: [
        'Booking a guided introduction',
        'Coming late in the afternoon',
        'Bringing your own equipment',
        'Joining the mailing list first',
      ],
      correct: 0,
      explanation: 'The speaker advises booking the guided introduction.',
    },
  ];

  const mcqQuestions = mcqData.map((item, i) =>
    shuffledMcq(rng, 11 + i, item.prompt, item.options, item.correct, item.explanation),
  );

  const optionOrder = rng.shuffle(features);
  const optionLabels = optionOrder.map((feature, j) => `${LETTERS[j]}. ${feature}`);
  const matchingQuestions: Question[] = areas.map((area, i) => {
    const letter = LETTERS[optionOrder.indexOf(features[i])];
    return {
      number: 16 + i,
      type: 'matching' as const,
      prompt: `${area.charAt(0).toUpperCase()}${area.slice(1)}`,
      options: optionLabels,
      answers: [letter, features[i], `${letter}. ${features[i]}`],
      explanation: `The speaker links the ${area} with ${features[i]}.`,
    };
  });

  const transcript = [
    `Good afternoon, everyone. I'm ${topic.speaker} here at ${topic.place}, and I'd like to tell you how everything works.`,
    `We first opened back in ${openingYear}, and today roughly ${visitors.toLocaleString()} people come through the doors every year.`,
    `We're open every day except ${closedDay}, when the team carries out maintenance.`,
    `Entry costs \u00a3${fee} for adults, though children come in free of charge \u2014 that surprises a lot of visitors.`,
    `If it's your first time, do book the guided introduction; it lasts about forty minutes and covers everything you need.`,
    `Now, a quick word about where to find things.`,
    ...areas.map((area, i) => `At the ${area} you'll find ${features[i]}.`),
    "That's the layout in a nutshell. Enjoy your visit.",
  ].join('\n');

  return {
    number: 2,
    title: `Part 2 \u2013 ${topic.title}`,
    context: `A talk given by ${topic.speaker} about ${topic.place}.`,
    transcript,
    groups: [
      {
        id: 'l-p2-mcq',
        type: 'multiple-choice',
        instructions: 'Questions 11\u201315. Choose the correct letter, A, B, C or D.',
        questions: mcqQuestions,
      },
      {
        id: 'l-p2-match',
        type: 'matching',
        instructions: 'Questions 16\u201320. What can be found in each area? Write the correct letter next to each area.',
        options: optionLabels,
        questions: matchingQuestions,
      },
    ],
  };
}

function buildPart3(rng: Rng): ListeningPart {
  const topic = rng.pick(PART3_TOPICS);
  const [a, b] = topic.students;
  const aspects = rng.sample(topic.aspects, 4);
  const problem = rng.pick(topic.problems);
  const solution = rng.pick(topic.solutions);
  const weeks = rng.int(4, 12);
  const participants = rng.int(20, 180);
  const wordCount = rng.int(2, 6) * 500;

  const mcqData: { prompt: string; options: string[]; correct: number; explanation: string }[] = [
    {
      prompt: `What do the students agree is the main weakness of ${topic.project}?`,
      options: [...rng.sample(topic.problems.filter((p) => p !== problem), 3), problem],
      correct: 3,
      explanation: `Both students conclude that the main weakness is ${problem}.`,
    },
    {
      prompt: 'How do they decide to solve the problem?',
      options: [...rng.sample(topic.solutions.filter((s) => s !== solution), 3), solution],
      correct: 3,
      explanation: `They agree on ${solution}.`,
    },
    {
      prompt: `What does ${a} say about the ${aspects[0]}?`,
      options: [
        'It needs to be completely rewritten.',
        'It is stronger than the rest of the work.',
        'It should be moved to an appendix.',
        'It was copied from the seminar notes.',
      ],
      correct: 1,
      explanation: `${a} praises the ${aspects[0]}.`,
    },
    {
      prompt: `Why is ${b} worried about the timetable?`,
      options: [
        `Only ${weeks} weeks remain before submission.`,
        'The tutor is away for a month.',
        'The laboratory is being refurbished.',
        'Another assignment has the same deadline.',
      ],
      correct: 0,
      explanation: `${b} points out that only ${weeks} weeks are left.`,
    },
    {
      prompt: 'What does the tutor want them to add?',
      options: ['More participants', 'A longer introduction', 'A second supervisor', 'A budget table'],
      correct: 0,
      explanation: 'The tutor asks for a larger participant group.',
    },
    {
      prompt: 'What will the students do next?',
      options: ['Meet the tutor again', 'Start writing immediately', 'Send an email survey', 'Book the lab'],
      correct: 2,
      explanation: 'They decide to send out an email survey first.',
    },
  ];

  const mcqQuestions = mcqData.map((item, i) =>
    shuffledMcq(rng, 21 + i, item.prompt, item.options, item.correct, item.explanation),
  );

  const completion: Question[] = [
    {
      number: 27,
      type: 'sentence-completion',
      prompt: `The study will now involve ${'_____'} participants.`,
      answers: [String(participants)],
      explanation: `They agree to include ${participants} participants.`,
      wordLimit: 'A NUMBER',
    },
    {
      number: 28,
      type: 'sentence-completion',
      prompt: `The report must not exceed ${'_____'} words.`,
      answers: [String(wordCount)],
      explanation: `The limit mentioned is ${wordCount} words.`,
      wordLimit: 'A NUMBER',
    },
    {
      number: 29,
      type: 'sentence-completion',
      prompt: `${b} will be responsible for the ${'_____'}.`,
      answers: [aspects[1]],
      explanation: `${b} takes on the ${aspects[1]}.`,
      wordLimit: 'NO MORE THAN TWO WORDS',
    },
    {
      number: 30,
      type: 'sentence-completion',
      prompt: `They still need approval for the ${'_____'}.`,
      answers: [aspects[2]],
      explanation: `Approval is outstanding for the ${aspects[2]}.`,
      wordLimit: 'NO MORE THAN TWO WORDS',
    },
  ];

  const transcript = [
    `Tutor: So, ${a} and ${b}, how is ${topic.project} coming along?`,
    `${a}: Reasonably well. The ${aspects[0]} is definitely the strongest part \u2014 much better than the rest.`,
    `${b}: I agree, but the real weakness is ${problem}. We keep coming back to it.`,
    `${a}: Then let's deal with it by ${solution}. That seems the most realistic option.`,
    `${b}: Fine. My worry is the timetable \u2014 there are only ${weeks} weeks before submission.`,
    `Tutor: You'll manage, but I'd like more participants; aim for ${participants} in total.`,
    `${a}: Understood. And the report is capped at ${wordCount} words, isn't it?`,
    `Tutor: That's right. Who is doing what?`,
    `${b}: I'll take the ${aspects[1]}.`,
    `${a}: And I'll finish the ${aspects[3]}. We still need approval for the ${aspects[2]}, though.`,
    `Tutor: Send out the email survey first, then come back to me.`,
  ].join('\n');

  return {
    number: 3,
    title: `Part 3 \u2013 ${topic.title}`,
    context: `A discussion between two ${topic.subject} students, ${a} and ${b}, and their tutor.`,
    transcript,
    groups: [
      {
        id: 'l-p3-mcq',
        type: 'multiple-choice',
        instructions: 'Questions 21\u201326. Choose the correct letter, A, B, C or D.',
        questions: mcqQuestions,
      },
      {
        id: 'l-p3-comp',
        type: 'sentence-completion',
        instructions: 'Questions 27\u201330. Complete the sentences below.',
        questions: completion,
      },
    ],
  };
}

function buildPart4(rng: Rng): ListeningPart {
  const topic = rng.pick(PART4_TOPICS);
  const century = rng.int(15, 19);
  const year = rng.int(1750, 1980);
  const percent = rng.int(15, 85);
  const count = rng.int(3, 40);
  const stages = topic.stages;
  const factors = rng.shuffle(topic.factors);
  const materials = rng.shuffle(topic.materials);
  const benefits = rng.shuffle(topic.benefits);

  const notes: { prompt: string; answer: string; explanation: string; limit?: string }[] = [
    {
      prompt: `Early period: ${topic.subject} began with ${'_____'}.`,
      answer: stages[0],
      explanation: `The lecturer says the earliest phase was ${stages[0]}.`,
      limit: 'NO MORE THAN TWO WORDS',
    },
    {
      prompt: `The practice spread widely in the ${'_____'}th century.`,
      answer: String(century),
      explanation: `The spread happened in the ${century}th century.`,
      limit: 'A NUMBER',
    },
    {
      prompt: `A major change followed ${'_____'}.`,
      answer: factors[0],
      explanation: `${factors[0]} is given as the trigger for change.`,
      limit: 'NO MORE THAN TWO WORDS',
    },
    {
      prompt: `The next stage was ${'_____'}.`,
      answer: stages[1],
      explanation: `The second stage described is ${stages[1]}.`,
      limit: 'NO MORE THAN TWO WORDS',
    },
    {
      prompt: `Typical equipment or material: ${'_____'}.`,
      answer: materials[0],
      explanation: `${materials[0]} is the example given.`,
      limit: 'NO MORE THAN TWO WORDS',
    },
    {
      prompt: `In ${'_____'} the modern approach was adopted.`,
      answer: String(year),
      explanation: `The modern approach dates from ${year}.`,
      limit: 'A NUMBER',
    },
    {
      prompt: `Roughly ${'_____'}% of the work is now done in this way.`,
      answer: String(percent),
      explanation: `The figure quoted is ${percent}%.`,
      limit: 'A NUMBER',
    },
    {
      prompt: `Remaining difficulty: ${'_____'}.`,
      answer: factors[1],
      explanation: `${factors[1]} is described as the outstanding problem.`,
      limit: 'NO MORE THAN TWO WORDS',
    },
    {
      prompt: `Main benefit identified: ${'_____'}.`,
      answer: benefits[0],
      explanation: `The lecturer highlights ${benefits[0]}.`,
      limit: 'NO MORE THAN TWO WORDS',
    },
    {
      prompt: `Number of sites studied by the research group: ${'_____'}.`,
      answer: String(count),
      explanation: `The group studied ${count} sites.`,
      limit: 'A NUMBER',
    },
  ];

  const questions: Question[] = notes.map((note, i) => ({
    number: 31 + i,
    type: 'note-completion',
    prompt: note.prompt,
    answers: [note.answer],
    explanation: note.explanation,
    wordLimit: note.limit,
  }));

  const transcript = [
    `Today's lecture in ${topic.field} looks at ${topic.subject}.`,
    `The story begins with ${stages[0]}, a practice that is far older than most people assume.`,
    `It spread widely during the ${century}th century, largely because of ${factors[0]}.`,
    `That pressure led to the second stage, ${stages[1]}, and later to ${stages[2]}.`,
    `Practitioners relied on ${materials[0]}, and to a lesser extent on ${materials[1]}.`,
    `The modern approach, ${stages[3]}, was adopted in ${year}, and today about ${percent}% of the work is carried out this way.`,
    `One difficulty has not gone away: ${factors[1]} continues to cause problems.`,
    `Even so, the clearest benefit is ${benefits[0]}, with ${benefits[1]} a close second.`,
    `Our own research group has now studied ${count} sites, and the results will be published next year.`,
  ].join('\n');

  return {
    number: 4,
    title: `Part 4 \u2013 ${topic.title}`,
    context: `A university lecture on ${topic.subject}.`,
    transcript,
    groups: [
      {
        id: 'l-p4',
        type: 'note-completion',
        instructions: 'Questions 31\u201340. Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
        questions,
      },
    ],
  };
}

export function buildListening(rng: Rng): ListeningPart[] {
  return [buildPart1(rng), buildPart2(rng), buildPart3(rng), buildPart4(rng)];
}
