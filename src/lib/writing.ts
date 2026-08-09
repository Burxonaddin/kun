import { Rng } from './prng';
import { WRITING_TASK1_THEMES, WRITING_TASK1_TYPES, WRITING_TASK2_PROMPTS } from './banks';
import type { WritingTask } from '../types';

export function buildWriting(rng: Rng): WritingTask[] {
  const theme = rng.pick(WRITING_TASK1_THEMES);
  const chartType = rng.pick(WRITING_TASK1_TYPES);
  const rows = theme.categories.map((category) => {
    const base = rng.int(5, 45);
    const values = theme.series.map((_, i) => {
      const drift = rng.int(-12, 18);
      return Math.max(1, base + drift * (i + 1) / 2);
    });
    return [category, ...values.map((v) => Math.round(v))];
  });

  const task1: WritingTask = {
    task: 1,
    title: 'Writing Task 1',
    prompt:
      `The ${chartType} below shows ${theme.caption.toLowerCase()} (${theme.unit}). ` +
      'Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
    minWords: 150,
    minutes: 20,
    table: {
      caption: `${theme.caption} (${theme.unit})`,
      columns: ['Category', ...theme.series],
      rows,
    },
    keyPoints: [
      'a clear overview sentence',
      'the highest and lowest figures',
      'at least one comparison between categories',
      'accurate use of the data',
    ],
  };

  const essay = rng.pick(WRITING_TASK2_PROMPTS);
  const task2: WritingTask = {
    task: 2,
    title: 'Writing Task 2',
    prompt: `${essay.statement} Write at least 250 words.`,
    minWords: 250,
    minutes: 40,
    keyPoints: essay.keyPoints,
  };

  return [task1, task2];
}

const LINKERS = [
  'however', 'moreover', 'furthermore', 'in addition', 'therefore', 'consequently', 'for instance',
  'for example', 'on the other hand', 'in contrast', 'as a result', 'overall', 'in conclusion',
  'firstly', 'secondly', 'finally', 'although', 'whereas', 'despite', 'nevertheless',
];

const ACADEMIC_WORDS = [
  'significant', 'proportion', 'trend', 'evidence', 'factor', 'argue', 'benefit', 'drawback',
  'policy', 'sustainable', 'considerable', 'implication', 'crucial', 'demonstrate', 'majority',
  'decline', 'increase', 'stable', 'fluctuate', 'peak', 'contribute', 'address', 'invest',
];

export interface TextStats {
  words: number;
  sentences: number;
  paragraphs: number;
  uniqueRatio: number;
  averageSentenceLength: number;
  linkerCount: number;
  academicCount: number;
  longWordRatio: number;
  /** Share of sentences that merely repeat an earlier sentence. */
  repetitionRatio: number;
}

function repetitionRatio(text: string): number {
  const sentences = text
    .split(/[.!?\n]+/)
    .map((sentence) => sentence.toLowerCase().replace(/[^a-z ]/g, '').replace(/\s+/g, ' ').trim())
    .filter((sentence) => sentence.split(' ').length >= 4);
  if (sentences.length < 2) return 0;
  const seen = new Set<string>();
  let repeats = 0;
  for (const sentence of sentences) {
    if (seen.has(sentence)) repeats += 1;
    seen.add(sentence);
  }
  return repeats / sentences.length;
}

export function analyseText(text: string): TextStats {
  const trimmed = text.trim();
  const wordList = trimmed ? trimmed.split(/\s+/) : [];
  const lower = trimmed.toLowerCase();
  const sentences = trimmed ? trimmed.split(/[.!?]+\s|[.!?]+$/).filter((s) => s.trim().length > 0).length : 0;
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length : 0;
  const cleaned = wordList.map((w) => w.toLowerCase().replace(/[^a-z']/g, '')).filter(Boolean);
  const unique = new Set(cleaned);
  return {
    words: wordList.length,
    sentences,
    paragraphs,
    uniqueRatio: cleaned.length ? unique.size / cleaned.length : 0,
    averageSentenceLength: sentences ? wordList.length / sentences : 0,
    linkerCount: LINKERS.filter((linker) => lower.includes(linker)).length,
    academicCount: ACADEMIC_WORDS.filter((word) => lower.includes(word)).length,
    longWordRatio: cleaned.length ? cleaned.filter((w) => w.length >= 7).length / cleaned.length : 0,
    repetitionRatio: repetitionRatio(trimmed),
  };
}

function clampBand(value: number): number {
  return Math.max(0, Math.min(9, Math.round(value * 2) / 2));
}

/** Up to a 3 band deduction once most of the answer is copied from itself. */
function repetitionPenalty(stats: TextStats): number {
  if (stats.repetitionRatio <= 0.15) return 0;
  return Math.min(3, (stats.repetitionRatio - 0.15) * 4);
}

/** Rewards hitting the word count and covering the required content points. */
export function taskAchievementBand(stats: TextStats, task: WritingTask, text: string): number {
  if (stats.words === 0) return 0;
  const ratio = stats.words / task.minWords;
  let band = 4;
  if (ratio >= 0.6) band = 5;
  if (ratio >= 0.85) band = 6;
  if (ratio >= 1) band = 6.5;
  if (ratio >= 1.15 && stats.paragraphs >= 3) band = 7;
  if (ratio >= 1.25 && stats.paragraphs >= 4 && stats.sentences >= 12) band = 7.5;
  const lower = text.toLowerCase();
  const covered = task.keyPoints.filter((point) =>
    point
      .split(/\s+/)
      .filter((w) => w.length > 4)
      .some((w) => lower.includes(w.toLowerCase().slice(0, 5))),
  ).length;
  band += covered >= 3 ? 0.5 : covered === 0 ? -0.5 : 0;
  if (ratio < 0.5) band -= 1;
  // Padding the answer with repeated sentences does not develop the task.
  band -= repetitionPenalty(stats);
  return clampBand(band);
}

export function coherenceBand(stats: TextStats): number {
  if (stats.words === 0) return 0;
  let band = 4;
  if (stats.paragraphs >= 2) band = 5;
  if (stats.paragraphs >= 3 && stats.linkerCount >= 3) band = 6;
  if (stats.paragraphs >= 4 && stats.linkerCount >= 5) band = 7;
  if (stats.paragraphs >= 4 && stats.linkerCount >= 8 && stats.sentences >= 14) band = 7.5;
  if (stats.averageSentenceLength > 32 || stats.averageSentenceLength < 8) band -= 0.5;
  band -= repetitionPenalty(stats);
  return clampBand(band);
}

export function lexicalBand(stats: TextStats): number {
  if (stats.words === 0) return 0;
  let band = 4;
  if (stats.uniqueRatio >= 0.35) band = 5;
  if (stats.uniqueRatio >= 0.42 && stats.academicCount >= 3) band = 6;
  if (stats.uniqueRatio >= 0.48 && stats.academicCount >= 6) band = 7;
  if (stats.uniqueRatio >= 0.55 && stats.academicCount >= 9 && stats.longWordRatio >= 0.2) band = 7.5;
  band -= repetitionPenalty(stats);
  return clampBand(band);
}

export function grammarBand(stats: TextStats, text: string): number {
  if (stats.words === 0) return 0;
  const complexMarkers = (text.match(/\b(which|that|because|although|while|whereas|if|when|since)\b/gi) || []).length;
  const density = stats.sentences ? complexMarkers / stats.sentences : 0;
  const punctuationIssues = (text.match(/\s,|,,|\.\./g) || []).length;
  const missingCapitals = (text.match(/(?:^|[.!?]\s+)[a-z]/g) || []).length;
  let band = 4;
  if (density >= 0.3) band = 5;
  if (density >= 0.5) band = 6;
  if (density >= 0.8 && stats.averageSentenceLength >= 12) band = 7;
  if (density >= 1.1 && stats.averageSentenceLength >= 14) band = 7.5;
  band -= Math.min(1.5, (punctuationIssues + missingCapitals) * 0.25);
  return clampBand(band);
}
