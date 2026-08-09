import { Rng } from './prng';
import { READING_HEADINGS_POOL, READING_TOPICS, type ReadingTopic } from './banks';
import type { Question, QuestionGroup, ReadingPassage } from '../types';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

interface PassageFacts {
  startYear: number;
  sampleSize: number;
  percentChange: number;
  durationYears: number;
  costMillions: number;
  teamSize: number;
  countryCount: number;
  successRate: number;
}

function makeFacts(rng: Rng): PassageFacts {
  return {
    startYear: rng.int(1958, 2015),
    sampleSize: rng.int(40, 900),
    percentChange: rng.int(11, 78),
    durationYears: rng.int(3, 22),
    costMillions: rng.int(2, 90),
    teamSize: rng.int(4, 45),
    countryCount: rng.int(3, 19),
    successRate: rng.int(35, 95),
  };
}

/** Paragraph roles, each with its correct heading and the prose that supports it. */
function buildParagraphs(topic: ReadingTopic, f: PassageFacts): { heading: string; text: string }[] {
  return [
    {
      heading: 'The turning point in the research',
      text:
        `For decades ${topic.subject} was treated as a marginal concern within ${topic.field}. ` +
        `That changed in ${f.startYear}, when ${topic.researcher} of ${topic.institution} began a systematic study in ${topic.place}. ` +
        `What had previously been anecdote was, for the first time, recorded in a consistent form, and colleagues who had dismissed the subject began to pay attention.`,
    },
    {
      heading: 'How the method actually works',
      text:
        `The approach adopted by the group rests on ${topic.method}. Each of the ${f.sampleSize} ${topic.unit} in the study is registered, ` +
        `measured at fixed intervals and compared against a control group drawn from the same region. A team of ${f.teamSize} researchers processes the readings, ` +
        `and any result that cannot be reproduced twice is discarded before analysis begins.`,
    },
    {
      heading: 'Measuring the scale of the change',
      text:
        `The headline finding is a change of ${f.percentChange} per cent over ${f.durationYears} years \u2014 far larger than the small shifts predicted by earlier models. ` +
        `Roughly ${f.successRate} per cent of the recorded cases followed the same pattern, which suggests the effect is general rather than local. ` +
        `Comparable work is now under way in ${f.countryCount} countries.`,
    },
    {
      heading: 'Objections from local communities',
      text:
        `Not everyone welcomed the results. The most persistent difficulty has been ${topic.challenge}, and public meetings in ${topic.place} were at times uncomfortable. ` +
        `Critics argued that the research team had underestimated the practical costs borne by people living alongside the changes, and several local groups asked for the programme to be suspended.`,
    },
    {
      heading: 'Practical uses beyond research',
      text:
        `The work has nevertheless found an audience among planners. Its clearest application is ${topic.application}, where the data allow decisions to be tested before money is spent. ` +
        `A pilot scheme costing ${f.costMillions} million pounds is already running, and early reports describe it as good value.`,
    },
    {
      heading: 'A problem that remains unsolved',
      text:
        `Two weaknesses persist. The first is that the record before ${f.startYear} is patchy, so long-term comparisons rely on estimates. ` +
        `The second is that ${topic.method} performs poorly in extreme conditions, which is precisely when reliable information matters most. ` +
        `${topic.researcher} accepts both criticisms and describes the current figures as provisional.`,
    },
    {
      heading: 'Plans for the next decade',
      text:
        `A second phase is planned. It will double the number of ${topic.unit} under observation, extend the work to neighbouring regions and publish the raw data openly. ` +
        `If funding is renewed, the team expects results within ${f.durationYears > 10 ? 5 : 8} years, by which time ${topic.subject} may look like a settled field rather than a contested one.`,
    },
  ];
}

function tfng(number: number, statement: string, answer: 'TRUE' | 'FALSE' | 'NOT GIVEN', explanation: string): Question {
  return {
    number,
    type: 'true-false-notgiven',
    prompt: statement,
    options: ['TRUE', 'FALSE', 'NOT GIVEN'],
    answers: [answer],
    explanation,
  };
}

function ynng(number: number, statement: string, answer: 'YES' | 'NO' | 'NOT GIVEN', explanation: string): Question {
  return {
    number,
    type: 'yes-no-notgiven',
    prompt: statement,
    options: ['YES', 'NO', 'NOT GIVEN'],
    answers: [answer],
    explanation,
  };
}

interface PassagePlan {
  headings: number;
  truthStatements: number;
  completion: number;
  multipleChoice: number;
}

/** Question mix per passage; the three passages always add up to exactly 40 questions. */
const PASSAGE_PLANS: Record<1 | 2 | 3, PassagePlan> = {
  1: { headings: 6, truthStatements: 4, completion: 4, multipleChoice: 0 },
  2: { headings: 0, truthStatements: 4, completion: 5, multipleChoice: 4 },
  3: { headings: 5, truthStatements: 4, completion: 0, multipleChoice: 4 },
};

function buildPassage(
  rng: Rng,
  topic: ReadingTopic,
  number: 1 | 2 | 3,
  firstQuestion: number,
): ReadingPassage {
  const plan = PASSAGE_PLANS[number];
  const facts = makeFacts(rng);
  const paragraphRoles = buildParagraphs(topic, facts);
  const paragraphs = paragraphRoles.map((p) => p.text);
  const groups: QuestionGroup[] = [];
  let n = firstQuestion;

  // --- Matching headings (one per paragraph, with distractors) ---
  const correctHeadings = paragraphRoles.map((p) => p.heading);
  const distractors = rng.sample(
    READING_HEADINGS_POOL.filter((h) => !correctHeadings.includes(h)),
    3,
  );
  const headingOptions = rng.shuffle([...correctHeadings, ...distractors]);
  const headingLabels = headingOptions.map((h, i) => `${LETTERS[i]}. ${h}`);
  const headingCount = plan.headings;
  const headingQuestions: Question[] = paragraphRoles.slice(0, headingCount).map((role, i) => {
    const letter = LETTERS[headingOptions.indexOf(role.heading)];
    return {
      number: n + i,
      type: 'matching-headings' as const,
      prompt: `Paragraph ${LETTERS[i]}`,
      options: headingLabels,
      answers: [letter, role.heading, `${letter}. ${role.heading}`],
      explanation: `Paragraph ${LETTERS[i]} is about "${role.heading.toLowerCase()}".`,
    };
  });
  n += headingCount;
  if (headingCount > 0) {
    groups.push({
      id: `r-p${number}-headings`,
      type: 'matching-headings',
      instructions: `Questions ${firstQuestion}\u2013${n - 1}. Choose the correct heading for each paragraph from the list of headings below.`,
      options: headingLabels,
      questions: headingQuestions,
    });
  }

  // --- True / False / Not Given (or Yes / No / Not Given for passage 3) ---
  const tfCount = plan.truthStatements;
  const useYesNo = number === 3;
  const factory = useYesNo ? ynng : tfng;
  const yes = useYesNo ? 'YES' : 'TRUE';
  const no = useYesNo ? 'NO' : 'FALSE';
  type TruthKey = 'TRUE' | 'FALSE' | 'NOT GIVEN';
  const tfStatements: { text: string; key: TruthKey; why: string }[] = rng.shuffle<{
    text: string;
    key: TruthKey;
    why: string;
  }>([
    {
      text: `The study of ${topic.subject} in ${topic.place} began in ${facts.startYear}.`,
      key: 'TRUE',
      why: `Paragraph A states that the work began in ${facts.startYear}.`,
    },
    {
      text: `Fewer than ${Math.max(10, facts.sampleSize - 25)} ${topic.unit} were included in the study.`,
      key: 'FALSE',
      why: `The passage says ${facts.sampleSize} ${topic.unit} were included, which is more than that figure.`,
    },
    {
      text: `${topic.researcher} has received a national award for the research.`,
      key: 'NOT GIVEN',
      why: 'No award of any kind is mentioned in the passage.',
    },
    {
      text: `The research team accepts that its current figures are provisional.`,
      key: 'TRUE',
      why: `${topic.researcher} explicitly describes the figures as provisional.`,
    },
    {
      text: `The pilot scheme has been criticised as poor value for money.`,
      key: 'FALSE',
      why: 'Early reports describe the pilot scheme as good value.',
    },
    {
      text: `Researchers in ${topic.place} work more quickly than teams elsewhere.`,
      key: 'NOT GIVEN',
      why: 'The passage never compares the speed of different teams.',
    },
  ]).slice(0, tfCount);

  const tfQuestions = tfStatements.map((s, i) => {
    const key = s.key === 'TRUE' ? yes : s.key === 'FALSE' ? no : 'NOT GIVEN';
    return factory(n + i, s.text, key as never, s.why);
  });
  n += tfCount;
  groups.push({
    id: `r-p${number}-tfng`,
    type: useYesNo ? 'yes-no-notgiven' : 'true-false-notgiven',
    instructions: useYesNo
      ? `Questions ${n - tfCount}\u2013${n - 1}. Do the following statements agree with the claims of the writer? Write YES, NO or NOT GIVEN.`
      : `Questions ${n - tfCount}\u2013${n - 1}. Do the following statements agree with the information in the passage? Write TRUE, FALSE or NOT GIVEN.`,
    options: useYesNo ? ['YES', 'NO', 'NOT GIVEN'] : ['TRUE', 'FALSE', 'NOT GIVEN'],
    questions: tfQuestions,
  });

  // --- Sentence / summary completion straight from the passage figures ---
  const completionItems: { prompt: string; answer: string; why: string; limit: string }[] = [
    {
      prompt: `The method used by the team is based on ${'_____'}.`,
      answer: topic.method,
      why: `Paragraph B states that the approach rests on ${topic.method}.`,
      limit: 'NO MORE THAN THREE WORDS',
    },
    {
      prompt: `The recorded change was ${'_____'} per cent.`,
      answer: String(facts.percentChange),
      why: `The passage reports a change of ${facts.percentChange} per cent.`,
      limit: 'A NUMBER',
    },
    {
      prompt: `Similar work is now being carried out in ${'_____'} countries.`,
      answer: String(facts.countryCount),
      why: `Comparable work is under way in ${facts.countryCount} countries.`,
      limit: 'A NUMBER',
    },
    {
      prompt: `The main practical application of the research is ${'_____'}.`,
      answer: topic.application,
      why: `The passage names ${topic.application} as the clearest application.`,
      limit: 'NO MORE THAN THREE WORDS',
    },
    {
      prompt: `The pilot scheme cost ${'_____'} million pounds.`,
      answer: String(facts.costMillions),
      why: `The pilot scheme is described as costing ${facts.costMillions} million pounds.`,
      limit: 'A NUMBER',
    },
  ];
  const completionCount = plan.completion;
  const chosenCompletion = rng.sample(completionItems, completionCount);
  const completionQuestions: Question[] = chosenCompletion.map((item, i) => ({
    number: n + i,
    type: 'sentence-completion',
    prompt: item.prompt,
    answers: [item.answer],
    explanation: item.why,
    wordLimit: item.limit,
  }));
  n += completionCount;
  if (completionCount > 0) {
    groups.push({
      id: `r-p${number}-completion`,
      type: 'sentence-completion',
      instructions: `Questions ${n - completionCount}\u2013${n - 1}. Complete the sentences below using words from the passage.`,
      questions: completionQuestions,
    });
  }

  // --- Multiple choice ---
  const mcqPool: { prompt: string; options: string[]; correct: string; why: string }[] = [
    {
      prompt: 'What is the writer\u2019s main purpose in the passage?',
      options: [
        `To describe how research into ${topic.subject} developed and what it is used for`,
        `To argue that funding for ${topic.field} should be cut`,
        `To compare two competing laboratories`,
        `To explain a technique to specialists only`,
      ],
      correct: `To describe how research into ${topic.subject} developed and what it is used for`,
      why: 'The passage traces the development of the research and its applications.',
    },
    {
      prompt: 'What was the greatest obstacle faced by the project?',
      options: [
        topic.challenge,
        'a change of government',
        'the loss of the original data',
        'disagreement about terminology',
      ],
      correct: topic.challenge,
      why: `The passage identifies ${topic.challenge} as the most persistent difficulty.`,
    },
    {
      prompt: 'What will the second phase of the project involve?',
      options: [
        `doubling the number of ${topic.unit} observed`,
        'moving the laboratory abroad',
        'replacing the whole research team',
        'abandoning the original method',
      ],
      correct: `doubling the number of ${topic.unit} observed`,
      why: 'The final paragraph says the number under observation will be doubled.',
    },
    {
      prompt: 'Why are long-term comparisons difficult?',
      options: [
        `Records before ${facts.startYear} are incomplete`,
        'The team refuses to publish data',
        'Two different units of measurement are used',
        'Earlier studies were never written up',
      ],
      correct: `Records before ${facts.startYear} are incomplete`,
      why: `The passage notes that the record before ${facts.startYear} is patchy.`,
    },
  ];
  const mcqCount = plan.multipleChoice;
  const chosenMcq = rng.sample(mcqPool, mcqCount);
  const mcqQuestions: Question[] = chosenMcq.map((item, i) => {
    const shuffled = rng.shuffle(item.options);
    const letter = LETTERS[shuffled.indexOf(item.correct)];
    return {
      number: n + i,
      type: 'multiple-choice',
      prompt: item.prompt,
      options: shuffled.map((option, j) => `${LETTERS[j]}. ${option}`),
      answers: [letter, item.correct, `${letter}. ${item.correct}`],
      explanation: item.why,
    };
  });
  n += mcqCount;
  if (mcqCount > 0) {
    groups.push({
      id: `r-p${number}-mcq`,
      type: 'multiple-choice',
      instructions: `Questions ${n - mcqCount}\u2013${n - 1}. Choose the correct letter, A, B, C or D.`,
      questions: mcqQuestions,
    });
  }

  return { number, title: topic.title, paragraphs, groups };
}

export function buildReading(rng: Rng): ReadingPassage[] {
  const topics = rng.sample(READING_TOPICS, 3);
  const p1 = buildPassage(rng, topics[0], 1, 1);
  const used1 = countQuestions(p1);
  const p2 = buildPassage(rng, topics[1], 2, 1 + used1);
  const used2 = countQuestions(p2);
  const p3 = buildPassage(rng, topics[2], 3, 1 + used1 + used2);
  return [p1, p2, p3];
}

export function countQuestions(passage: ReadingPassage): number {
  return passage.groups.reduce((sum, group) => sum + group.questions.length, 0);
}
