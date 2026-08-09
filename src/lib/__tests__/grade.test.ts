import { describe, expect, it } from 'vitest';
import { buildMock, allQuestions } from '../mocks';
import { gradeAttempt } from '../grade';
import type { AttemptAnswers } from '../../types';

function blankAnswers(): AttemptAnswers {
  return {
    listening: {},
    reading: {},
    writing: { task1: '', task2: '' },
    speaking: { part1: '', part2: '', part3: '', seconds: 0 },
  };
}

function perfectObjectiveAnswers(mockId: number): AttemptAnswers {
  const mock = buildMock(mockId);
  const answers = blankAnswers();
  for (const section of ['listening', 'reading'] as const) {
    for (const question of allQuestions(mock, section)) {
      answers[section][String(question.number)] = question.answers[0];
    }
  }
  return answers;
}

const STRONG_ESSAY = `
Public transport funding is a contested issue. In my view, governments should prioritise buses and trains, although new roads are occasionally necessary.

Firstly, investment in public transport reduces congestion. For example, a city that doubles its bus fleet can move a considerable proportion of commuters without adding vehicles to the road, because each bus replaces many cars. Moreover, the environmental benefit is significant, since emissions per passenger decline sharply when trains are electrified.

On the other hand, opponents argue that road building creates economic benefit by shortening freight journeys. This is a reasonable point, and evidence from several countries demonstrates that rural regions with poor roads struggle to attract investment. Nevertheless, urban motorways tend to fill with traffic soon after they open, a trend which economists call induced demand.

In conclusion, although a limited road programme is justified, the majority of transport spending should address public networks, because this policy delivers a more sustainable and equitable outcome for the whole population.
`;

const STRONG_REPORT = `
The table compares household spending across four categories over three decades.

Overall, housing consumed the largest proportion of income throughout the period, whereas leisure accounted for the smallest share. Spending on housing increased considerably, while the figure for food declined steadily.

In detail, housing rose from around a quarter of income to a significant peak at the end of the period. In contrast, food fell by roughly a third, and transport remained relatively stable. Leisure fluctuated, although it demonstrates a modest increase overall.

These trends therefore suggest that fixed costs have crowded out discretionary spending, a considerable implication for policy.
`;

const STRONG_SPEECH = `
Well, personally I would say the skill that took me longest to learn was driving, because I grew up in a city
where nobody in my family owned a car. I mean, I started lessons when I was twenty, and at first I found the
whole thing overwhelming, such as judging distances and watching mirrors at the same time. To be honest, what
helped most was practising early in the morning when the roads were quiet, so that I could concentrate on one
thing at a time. For example, one week I only practised parking, which sounds boring but it built my confidence.
That said, I still avoid motorways if I can, although I know that is something I should work on. In my view,
learning a practical skill as an adult is harder because you are impatient with yourself, whereas children simply
enjoy the process. Basically, the experience taught me that steady repetition matters more than natural talent,
and I have applied the same approach to other things, such as learning to swim last summer.
`;

describe('gradeAttempt', () => {
  it('gives band 9 on both objective sections for a perfect paper', () => {
    const mock = buildMock(11);
    const result = gradeAttempt(mock, 'a@b.com', perfectObjectiveAnswers(11));
    const listening = result.sections[0];
    const reading = result.sections[1];
    expect(listening.raw).toBe(40);
    expect(listening.band).toBe(9);
    expect(reading.raw).toBe(40);
    expect(reading.band).toBe(9);
  });

  it('scores a blank paper as zero everywhere', () => {
    const mock = buildMock(12);
    const result = gradeAttempt(mock, 'a@b.com', blankAnswers());
    expect(result.overall).toBe(0);
    for (const section of result.sections) expect(section.band).toBe(0);
  });

  it('reports every question with the correct answer and an explanation', () => {
    const mock = buildMock(13);
    const answers = perfectObjectiveAnswers(13);
    answers.listening['1'] = 'definitely wrong';
    const result = gradeAttempt(mock, 'a@b.com', answers);
    const listening = result.sections[0];
    expect(listening.results).toHaveLength(40);
    expect(listening.raw).toBe(39);
    const first = listening.results?.[0];
    expect(first?.isCorrect).toBe(false);
    expect(first?.given).toBe('definitely wrong');
    expect(first?.correct.length).toBeGreaterThan(0);
    expect(first?.explanation.length).toBeGreaterThan(0);
  });

  it('breaks the objective sections down by question type', () => {
    const result = gradeAttempt(buildMock(14), 'a@b.com', perfectObjectiveAnswers(14));
    const byType = result.sections[1].byType ?? [];
    expect(byType.length).toBeGreaterThan(1);
    expect(byType.reduce((sum, entry) => sum + entry.total, 0)).toBe(40);
  });

  it('rewards a developed essay far more than a one-line answer', () => {
    const mock = buildMock(15);
    const weak = blankAnswers();
    weak.writing = { task1: 'The chart goes up.', task2: 'I agree with this because it is good.' };
    const strong = blankAnswers();
    strong.writing = { task1: STRONG_REPORT, task2: STRONG_ESSAY };
    const weakBand = gradeAttempt(mock, 'a@b.com', weak).sections[2].band;
    const strongBand = gradeAttempt(mock, 'a@b.com', strong).sections[2].band;
    expect(strongBand).toBeGreaterThan(weakBand + 1);
    expect(strongBand).toBeLessThanOrEqual(9);
  });

  it('weights writing task 2 twice as heavily as task 1', () => {
    const mock = buildMock(16);
    const onlyTask1 = blankAnswers();
    onlyTask1.writing = { task1: STRONG_REPORT, task2: '' };
    const onlyTask2 = blankAnswers();
    onlyTask2.writing = { task1: '', task2: STRONG_ESSAY };
    const band1 = gradeAttempt(mock, 'a@b.com', onlyTask1).sections[2].band;
    const band2 = gradeAttempt(mock, 'a@b.com', onlyTask2).sections[2].band;
    expect(band2).toBeGreaterThan(band1);
  });

  it('scores a fluent speaking transcript above a short one', () => {
    const mock = buildMock(17);
    const short = blankAnswers();
    short.speaking = { part1: 'Yes. I like it.', part2: 'It is good.', part3: 'Maybe.', seconds: 60 };
    const long = blankAnswers();
    long.speaking = { part1: STRONG_SPEECH, part2: STRONG_SPEECH, part3: STRONG_SPEECH, seconds: 420 };
    const shortResult = gradeAttempt(mock, 'a@b.com', short).sections[3];
    const longResult = gradeAttempt(mock, 'a@b.com', long).sections[3];
    expect(longResult.band).toBeGreaterThan(shortResult.band);
    expect(longResult.criteria).toHaveLength(4);
  });

  it('produces analysis text: strengths, weaknesses and advice', () => {
    const mock = buildMock(18);
    const answers = perfectObjectiveAnswers(18);
    for (let n = 1; n <= 25; n++) answers.reading[String(n)] = 'wrong';
    const result = gradeAttempt(mock, 'a@b.com', answers);
    expect(result.strengths.length).toBeGreaterThan(0);
    expect(result.weaknesses.length).toBeGreaterThan(1);
    expect(result.advice.length).toBeGreaterThan(0);
    expect(result.weaknesses.join(' ')).toContain('reading');
  });

  it('keeps the overall band consistent with the four section bands', () => {
    const mock = buildMock(19);
    const answers = perfectObjectiveAnswers(19);
    answers.writing = { task1: STRONG_REPORT, task2: STRONG_ESSAY };
    answers.speaking = { part1: STRONG_SPEECH, part2: STRONG_SPEECH, part3: STRONG_SPEECH, seconds: 420 };
    const result = gradeAttempt(mock, 'a@b.com', answers);
    const bands = result.sections.map((section) => section.band);
    const mean = bands.reduce((sum, band) => sum + band, 0) / bands.length;
    expect(Math.abs(result.overall - mean)).toBeLessThanOrEqual(0.5);
    expect(result.mockCode).toBe(mock.code);
    expect(result.userEmail).toBe('a@b.com');
  });
});
