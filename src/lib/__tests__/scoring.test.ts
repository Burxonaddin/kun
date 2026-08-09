import { describe, expect, it } from 'vitest';
import {
  bandLabel, criteriaBand, isAnswerCorrect, listeningBand, normaliseAnswer, overallBand,
  readingBand, roundHalfBand,
} from '../scoring';

describe('band conversion', () => {
  it('matches the published listening table at key points', () => {
    expect(listeningBand(40)).toBe(9);
    expect(listeningBand(35)).toBe(8);
    expect(listeningBand(30)).toBe(7);
    expect(listeningBand(23)).toBe(6);
    expect(listeningBand(16)).toBe(5);
    expect(listeningBand(0)).toBe(0);
  });

  it('matches the published academic reading table at key points', () => {
    expect(readingBand(40)).toBe(9);
    expect(readingBand(35)).toBe(8);
    expect(readingBand(30)).toBe(7);
    expect(readingBand(23)).toBe(6);
    expect(readingBand(15)).toBe(5);
    expect(readingBand(13)).toBe(4.5);
    expect(readingBand(0)).toBe(0);
  });

  it('clamps out-of-range raw scores', () => {
    expect(listeningBand(-5)).toBe(0);
    expect(readingBand(99)).toBe(9);
  });

  it('rounds bands to the nearest half', () => {
    expect(roundHalfBand(6.24)).toBe(6);
    expect(roundHalfBand(6.25)).toBe(6.5);
    expect(roundHalfBand(9.9)).toBe(9);
  });
});

describe('overall band rounding', () => {
  it('rounds a .25 mean up to the next half band', () => {
    expect(overallBand([6.5, 6.5, 6, 6])).toBe(6.5);
  });

  it('rounds a .75 mean up to the next whole band', () => {
    expect(overallBand([7, 7, 6.5, 7])).toBe(7);
    expect(overallBand([6.5, 7, 7, 7.5])).toBe(7);
    expect(overallBand([8, 8, 7.5, 8])).toBe(8);
  });

  it('rounds down below .25', () => {
    expect(overallBand([6, 6, 6, 6.5])).toBe(6);
  });

  it('handles the classic 6.5/6.5/5/7 example', () => {
    expect(overallBand([6.5, 6.5, 5, 7])).toBe(6.5);
  });

  it('returns 0 for no sections', () => {
    expect(overallBand([])).toBe(0);
  });
});

describe('answer matching', () => {
  it('ignores case, punctuation, articles and extra spacing', () => {
    expect(isAnswerCorrect('  The Library.  ', ['library'])).toBe(true);
    expect(normaliseAnswer('A  photo ID,')).toBe('photo id');
  });

  it('accepts any listed alternative', () => {
    expect(isAnswerCorrect('07123 456789', ['07123456789', '07123 456789'])).toBe(true);
  });

  it('rejects blank and wrong answers', () => {
    expect(isAnswerCorrect('', ['library'])).toBe(false);
    expect(isAnswerCorrect('museum', ['library'])).toBe(false);
  });
});

describe('criteria averaging and labels', () => {
  it('averages criteria to the nearest half band', () => {
    const band = criteriaBand([
      { name: 'a', band: 6, comment: '' },
      { name: 'b', band: 7, comment: '' },
      { name: 'c', band: 6, comment: '' },
      { name: 'd', band: 6, comment: '' },
    ]);
    expect(band).toBe(6.5);
  });

  it('describes bands with the official CEFR-style labels', () => {
    expect(bandLabel(9)).toBe('Expert user');
    expect(bandLabel(6.5)).toBe('Good user');
    expect(bandLabel(5)).toBe('Modest user');
    expect(bandLabel(0)).toBe('Did not attempt');
  });
});
