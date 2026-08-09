import { Rng, hashSeed } from './prng';
import { buildListening } from './listening';
import { buildReading } from './reading';
import { buildWriting } from './writing';
import { buildSpeaking } from './speaking';
import type { Mock } from '../types';

/** Total number of full mock tests available in the catalogue. */
export const MOCK_COUNT = 1200;

const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;

const CACHE = new Map<number, Mock>();

export function mockCode(id: number): string {
  return `IELTS-${String(id).padStart(4, '0')}`;
}

export function buildMock(id: number): Mock {
  if (id < 1 || id > MOCK_COUNT || !Number.isInteger(id)) {
    throw new Error(`Mock id must be an integer between 1 and ${MOCK_COUNT}, received ${id}`);
  }
  const cached = CACHE.get(id);
  if (cached) return cached;

  const rng = new Rng(hashSeed('ielts-mock', id));
  const listening = buildListening(rng);
  const reading = buildReading(rng);
  const writing = buildWriting(rng);
  const speaking = buildSpeaking(rng);
  const difficulty = DIFFICULTIES[(id - 1) % DIFFICULTIES.length];

  const mock: Mock = {
    id,
    code: mockCode(id),
    title: `Academic Full Mock Test ${id}`,
    topic: reading[0].title,
    difficulty,
    listening,
    reading,
    writing,
    speaking,
  };
  CACHE.set(id, mock);
  return mock;
}

export interface MockSummary {
  id: number;
  code: string;
  title: string;
  topic: string;
  difficulty: Mock['difficulty'];
}

/** Cheap listing metadata; avoids generating full papers for the catalogue view. */
export function mockSummary(id: number): MockSummary {
  const rng = new Rng(hashSeed('ielts-mock-summary', id));
  const themes = [
    'Environment', 'Education', 'Technology', 'Health', 'Urban life', 'History', 'Work',
    'Science', 'Travel', 'Society', 'Media', 'Food and farming',
  ];
  return {
    id,
    code: mockCode(id),
    title: `Academic Full Mock Test ${id}`,
    topic: rng.pick(themes),
    difficulty: DIFFICULTIES[(id - 1) % DIFFICULTIES.length],
  };
}

export function listMocks(page: number, pageSize: number, query = ''): { items: MockSummary[]; total: number } {
  const all: MockSummary[] = [];
  for (let id = 1; id <= MOCK_COUNT; id++) {
    const summary = mockSummary(id);
    if (!query) {
      all.push(summary);
    } else {
      const q = query.toLowerCase();
      if (
        summary.code.toLowerCase().includes(q) ||
        summary.topic.toLowerCase().includes(q) ||
        String(summary.id) === q ||
        summary.difficulty.includes(q)
      ) {
        all.push(summary);
      }
    }
  }
  const start = (page - 1) * pageSize;
  return { items: all.slice(start, start + pageSize), total: all.length };
}

export function allQuestions(mock: Mock, section: 'listening' | 'reading') {
  const containers = section === 'listening' ? mock.listening : mock.reading;
  return containers.flatMap((container) => container.groups.flatMap((group) => group.questions));
}
