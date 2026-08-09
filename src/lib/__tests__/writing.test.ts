import { describe, expect, it } from 'vitest';
import { analyseText, coherenceBand, grammarBand, lexicalBand, taskAchievementBand } from '../writing';
import { analyseSpeaking, fluencyBand, pronunciationBand, speakingGrammarBand, speakingLexicalBand } from '../speaking';
import { buildMock } from '../mocks';

const ESSAY = `Some people argue that universities should focus only on employment. In my view this is too narrow.

Firstly, vocational courses clearly benefit graduates, because employers value practical evidence of ability. For example, engineering students who complete a placement usually find work quickly, which demonstrates the value of applied study.

However, subjects such as history contribute in a different way. They develop the ability to argue, to weigh evidence and to write clearly, and these skills remain crucial in almost every profession. Moreover, a society without historians would struggle to understand its own policy mistakes.

In conclusion, although employability is a legitimate goal, universities should therefore protect the humanities as well, since both types of study contribute to a sustainable economy.`;

describe('analyseText', () => {
  it('counts words, sentences and paragraphs', () => {
    const stats = analyseText('One two three. Four five!\n\nSecond paragraph here.');
    expect(stats.words).toBe(8);
    expect(stats.sentences).toBe(3);
    expect(stats.paragraphs).toBe(2);
  });

  it('returns zeroes for empty input', () => {
    const stats = analyseText('   ');
    expect(stats).toMatchObject({ words: 0, sentences: 0, paragraphs: 0, uniqueRatio: 0, linkerCount: 0 });
  });

  it('detects linking expressions and academic vocabulary', () => {
    const stats = analyseText(ESSAY);
    expect(stats.linkerCount).toBeGreaterThanOrEqual(5);
    expect(stats.academicCount).toBeGreaterThanOrEqual(4);
    expect(stats.uniqueRatio).toBeGreaterThan(0.4);
  });
});

describe('writing criteria bands', () => {
  const task = buildMock(3).writing[1];

  it('scores every criterion 0 for an empty answer', () => {
    const stats = analyseText('');
    expect(taskAchievementBand(stats, task, '')).toBe(0);
    expect(coherenceBand(stats)).toBe(0);
    expect(lexicalBand(stats)).toBe(0);
    expect(grammarBand(stats, '')).toBe(0);
  });

  it('penalises an under-length answer', () => {
    const short = 'I agree with this statement because it is good for everyone.';
    const stats = analyseText(short);
    expect(taskAchievementBand(stats, task, short)).toBeLessThan(5);
  });

  it('rewards a developed, well organised answer', () => {
    const stats = analyseText(ESSAY);
    expect(coherenceBand(stats)).toBeGreaterThanOrEqual(6);
    expect(lexicalBand(stats)).toBeGreaterThanOrEqual(5.5);
    expect(grammarBand(stats, ESSAY)).toBeGreaterThanOrEqual(6);
  });

  it('never returns a band above 9 or below 0', () => {
    const stats = analyseText(`${ESSAY}\n\n${ESSAY}\n\n${ESSAY}`);
    for (const band of [
      taskAchievementBand(stats, task, ESSAY),
      coherenceBand(stats),
      lexicalBand(stats),
      grammarBand(stats, ESSAY),
    ]) {
      expect(band).toBeGreaterThanOrEqual(0);
      expect(band).toBeLessThanOrEqual(9);
    }
  });

  it('penalises an answer padded with repeated sentences', () => {
    const padded = 'The chart shows a clear increase in spending. This is a significant trend.\n\n'.repeat(40);
    const stats = analyseText(padded);
    expect(stats.repetitionRatio).toBeGreaterThan(0.9);
    expect(stats.words).toBeGreaterThan(400);
    expect(taskAchievementBand(stats, task, padded)).toBeLessThanOrEqual(4);
    expect(coherenceBand(stats)).toBeLessThanOrEqual(3);
    expect(lexicalBand(stats)).toBeLessThanOrEqual(3);
  });

  it('does not treat a genuine answer as repetitive', () => {
    expect(analyseText(ESSAY).repetitionRatio).toBe(0);
  });

  it('marks bands in half-band steps only', () => {
    const stats = analyseText(ESSAY);
    const band = coherenceBand(stats);
    expect(band * 2).toBe(Math.round(band * 2));
  });
});

describe('speaking analysis', () => {
  const speech = `Well, to be honest I would say my hometown has changed a great deal, because new housing has
  appeared on the edges of the city. For example, the area near the river used to be industrial, whereas now it is
  full of cafés, which local people seem to enjoy. Personally I prefer it, although I do miss the old market.`;

  it('measures delivery rate from the recorded duration', () => {
    const stats = analyseSpeaking(speech, 30);
    expect(stats.words).toBeGreaterThan(50);
    expect(stats.wordsPerMinute).toBeGreaterThan(stats.words);
    expect(stats.markerCount).toBeGreaterThanOrEqual(3);
  });

  it('caps the reported rate and the fluency band when no speaking time was recorded', () => {
    const typed = analyseSpeaking(speech, 0);
    expect(typed.rateEstimated).toBe(true);
    expect(typed.wordsPerMinute).toBeLessThanOrEqual(200);
    expect(fluencyBand(typed)).toBeLessThanOrEqual(6);
    expect(pronunciationBand(typed)).toBe(5);

    const spoken = analyseSpeaking(speech, 45);
    expect(spoken.rateEstimated).toBe(false);
  });

  it('gives zero for silence', () => {
    const stats = analyseSpeaking('', 60);
    expect(fluencyBand(stats)).toBe(0);
    expect(speakingLexicalBand(stats)).toBe(0);
    expect(speakingGrammarBand(stats)).toBe(0);
    expect(pronunciationBand(stats)).toBe(0);
  });

  it('penalises heavy hesitation', () => {
    const fluent = analyseSpeaking(speech.repeat(3), 120);
    const hesitant = analyseSpeaking(`um uh erm ${speech.repeat(3)}`, 120);
    expect(fluencyBand(hesitant)).toBeLessThan(fluencyBand(fluent));
  });

  it('keeps speaking bands inside the 0-9 scale', () => {
    const stats = analyseSpeaking(speech.repeat(10), 200);
    for (const band of [fluencyBand(stats), speakingLexicalBand(stats), speakingGrammarBand(stats), pronunciationBand(stats)]) {
      expect(band).toBeGreaterThanOrEqual(0);
      expect(band).toBeLessThanOrEqual(9);
    }
  });
});
