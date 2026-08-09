import type { CriterionScore } from '../types';

/**
 * Official IELTS raw-score to band conversion (Academic).
 * Index = raw score out of 40.
 */
const LISTENING_BANDS: number[] = [
  /* 0 */ 0, 1, 1.5, 2, 2.5, 2.5, 3, 3, 3.5, 3.5,
  /* 10 */ 3.5, 4, 4, 4.5, 4.5, 4.5, 5, 5, 5.5, 5.5,
  /* 20 */ 5.5, 5.5, 5.5, 6, 6, 6, 6.5, 6.5, 6.5, 6.5,
  /* 30 */ 7, 7, 7.5, 7.5, 7.5, 8, 8, 8.5, 8.5, 9, 9,
];

const READING_ACADEMIC_BANDS: number[] = [
  /* 0 */ 0, 1, 1.5, 2, 2.5, 2.5, 3, 3, 3.5, 3.5,
  /* 10 */ 4, 4, 4, 4.5, 4.5, 5, 5, 5, 5, 5.5,
  /* 20 */ 5.5, 5.5, 5.5, 6, 6, 6, 6, 6.5, 6.5, 6.5,
  /* 30 */ 7, 7, 7, 7.5, 7.5, 8, 8, 8.5, 8.5, 9, 9,
];

function bandFromTable(raw: number, table: number[]): number {
  const clamped = Math.max(0, Math.min(table.length - 1, Math.round(raw)));
  return table[clamped];
}

export function listeningBand(raw: number): number {
  return bandFromTable(raw, LISTENING_BANDS);
}

export function readingBand(raw: number): number {
  return bandFromTable(raw, READING_ACADEMIC_BANDS);
}

/** Rounds a band to the nearest 0.5, which is how IELTS reports section scores. */
export function roundHalfBand(value: number): number {
  return Math.max(0, Math.min(9, Math.round(value * 2) / 2));
}

/**
 * Overall band: mean of the four sections, rounded to the nearest half band.
 * A mean ending in .25 rounds up to the next half band, .75 rounds up to the next whole band,
 * anything below .25 rounds down — exactly the published IELTS rule.
 */
export function overallBand(bands: number[]): number {
  if (bands.length === 0) return 0;
  const mean = bands.reduce((sum, band) => sum + band, 0) / bands.length;
  const whole = Math.floor(mean);
  const fraction = mean - whole;
  if (fraction < 0.25) return whole;
  if (fraction < 0.75) return whole + 0.5;
  return whole + 1;
}

/** Writing and speaking bands are the average of four criteria, rounded to the nearest half. */
export function criteriaBand(criteria: CriterionScore[]): number {
  if (criteria.length === 0) return 0;
  const mean = criteria.reduce((sum, c) => sum + c.band, 0) / criteria.length;
  return roundHalfBand(mean);
}

export function bandLabel(band: number): string {
  if (band >= 8.5) return 'Expert user';
  if (band >= 7.5) return 'Very good user';
  if (band >= 6.5) return 'Good user';
  if (band >= 5.5) return 'Competent user';
  if (band >= 4.5) return 'Modest user';
  if (band >= 3.5) return 'Limited user';
  if (band >= 2.5) return 'Extremely limited user';
  if (band >= 1) return 'Intermittent user';
  return 'Did not attempt';
}

/** Normalises a candidate answer so that spelling-insensitive comparison is fair. */
export function normaliseAnswer(value: string): string {
  return value
    .toLowerCase()
    .replace(/[.,;:!?"'`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^(a|an|the)\s+/, '');
}

export function isAnswerCorrect(given: string, accepted: string[]): boolean {
  const normalised = normaliseAnswer(given);
  if (!normalised) return false;
  return accepted.some((answer) => normaliseAnswer(answer) === normalised);
}
