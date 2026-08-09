import { describe, expect, it } from 'vitest';
import { MOCK_COUNT, allQuestions, buildMock, listMocks } from '../mocks';

describe('mock catalogue', () => {
  it('offers more than 1000 full mock tests', () => {
    expect(MOCK_COUNT).toBeGreaterThan(1000);
  });

  it('is deterministic: the same id always yields the same paper', () => {
    const a = buildMock(42);
    const b = buildMock(42);
    expect(JSON.stringify(a)).toEqual(JSON.stringify(b));
  });

  it('produces different papers for different ids', () => {
    const a = JSON.stringify(buildMock(7));
    const b = JSON.stringify(buildMock(8));
    expect(a).not.toEqual(b);
  });

  it('rejects ids outside the catalogue', () => {
    expect(() => buildMock(0)).toThrow();
    expect(() => buildMock(MOCK_COUNT + 1)).toThrow();
    expect(() => buildMock(1.5)).toThrow();
  });

  it('paginates the catalogue and filters by query', () => {
    const page = listMocks(2, 10);
    expect(page.items).toHaveLength(10);
    expect(page.items[0].id).toBe(11);
    expect(page.total).toBe(MOCK_COUNT);

    const filtered = listMocks(1, 10, 'IELTS-0005');
    expect(filtered.total).toBe(1);
    expect(filtered.items[0].id).toBe(5);
  });
});

const SAMPLE_IDS = [1, 2, 3, 17, 99, 250, 613, 1000, 1200];

describe.each(SAMPLE_IDS)('mock %i structure', (id) => {
  const mock = buildMock(id);

  it('has four listening parts numbered 1-40', () => {
    expect(mock.listening).toHaveLength(4);
    const numbers = allQuestions(mock, 'listening').map((q) => q.number);
    expect(numbers).toEqual(Array.from({ length: 40 }, (_, i) => i + 1));
  });

  it('has three reading passages numbered 1-40', () => {
    expect(mock.reading).toHaveLength(3);
    const numbers = allQuestions(mock, 'reading').map((q) => q.number);
    expect(numbers).toEqual(Array.from({ length: 40 }, (_, i) => i + 1));
  });

  it('gives every question at least one answer and an explanation', () => {
    for (const section of ['listening', 'reading'] as const) {
      for (const question of allQuestions(mock, section)) {
        expect(question.answers.length).toBeGreaterThan(0);
        expect(question.answers[0].trim()).not.toBe('');
        expect(question.explanation.trim()).not.toBe('');
      }
    }
  });

  it('keeps every choice answer inside its own option list', () => {
    for (const section of ['listening', 'reading'] as const) {
      for (const question of allQuestions(mock, section)) {
        if (!question.options) continue;
        const letters = question.options.map((option) => option.split('.')[0].trim());
        expect(letters).toContain(question.answers[0]);
      }
    }
  });

  it('has two writing tasks and three speaking parts', () => {
    expect(mock.writing.map((task) => task.task)).toEqual([1, 2]);
    expect(mock.writing[0].table).toBeDefined();
    expect(mock.speaking.map((part) => part.part)).toEqual([1, 2, 3]);
    expect(mock.speaking[1].bullets?.length).toBeGreaterThan(0);
  });

  it('mentions every listening answer somewhere in the transcript', () => {
    // Spacing is ignored so that a phone number read out digit by digit still counts as spoken.
    const squash = (value: string) => value.toLowerCase().replace(/\s+/g, '');
    for (const part of mock.listening) {
      const transcript = squash(part.transcript);
      for (const group of part.groups) {
        if (group.type !== 'form-completion' && group.type !== 'note-completion') continue;
        for (const question of group.questions) {
          expect(transcript).toContain(squash(question.answers[0]));
        }
      }
    }
  });
});
