import { Rng } from './prng';
import { SPEAKING_PART1_TOPICS, SPEAKING_PART2_CARDS } from './banks';
import type { SpeakingPart } from '../types';
import { analyseText } from './writing';

export function buildSpeaking(rng: Rng): SpeakingPart[] {
  const topics = rng.sample(SPEAKING_PART1_TOPICS, 2);
  const card = rng.pick(SPEAKING_PART2_CARDS);

  return [
    {
      part: 1,
      title: 'Speaking Part 1 \u2013 Introduction and interview',
      instructions:
        'The examiner asks general questions about you and familiar topics. Answer each question in two or three sentences.',
      questions: [...topics[0].questions, ...topics[1].questions.slice(0, 3)],
      prepSeconds: 0,
      speakSeconds: 300,
    },
    {
      part: 2,
      title: 'Speaking Part 2 \u2013 Individual long turn',
      instructions:
        'You have one minute to prepare, then speak for one to two minutes. You should say:',
      questions: [card.prompt],
      bullets: card.bullets,
      prepSeconds: 60,
      speakSeconds: 120,
    },
    {
      part: 3,
      title: 'Speaking Part 3 \u2013 Two-way discussion',
      instructions: 'The examiner asks broader questions connected with the topic in Part 2.',
      questions: card.part3,
      prepSeconds: 0,
      speakSeconds: 300,
    },
  ];
}

const DISCOURSE_MARKERS = [
  'well', 'actually', 'i mean', 'to be honest', 'personally', 'in my view', 'for example',
  'such as', 'that said', 'on top of that', 'the thing is', 'basically', 'i suppose',
];

const HESITATIONS = ['um', 'uh', 'erm', 'like like', 'you know you know'];

function clampBand(value: number): number {
  return Math.max(0, Math.min(9, Math.round(value * 2) / 2));
}

/** Nobody speaks faster than this; a higher figure means the timer was not running. */
const MAX_PLAUSIBLE_WPM = 200;

export interface SpeakingStats {
  words: number;
  wordsPerMinute: number;
  /** True when the delivery rate had to be inferred because no speaking time was recorded. */
  rateEstimated: boolean;
  uniqueRatio: number;
  markerCount: number;
  hesitationCount: number;
  averageSentenceLength: number;
  complexDensity: number;
}

export function analyseSpeaking(transcript: string, seconds: number): SpeakingStats {
  const stats = analyseText(transcript);
  const lower = transcript.toLowerCase();
  const complexMarkers = (transcript.match(/\b(which|that|because|although|while|if|when|so that)\b/gi) || []).length;
  // A typed answer records no speaking time, so cap the rate instead of reporting a nonsense figure.
  const minimumSeconds = (stats.words / MAX_PLAUSIBLE_WPM) * 60;
  const rateEstimated = stats.words > 0 && seconds < minimumSeconds;
  const minutes = Math.max(seconds, minimumSeconds, 1) / 60;
  return {
    words: stats.words,
    wordsPerMinute: stats.words ? stats.words / minutes : 0,
    rateEstimated,
    uniqueRatio: stats.uniqueRatio,
    markerCount: DISCOURSE_MARKERS.filter((marker) => lower.includes(marker)).length,
    hesitationCount: HESITATIONS.filter((h) => lower.includes(h)).length,
    averageSentenceLength: stats.averageSentenceLength,
    complexDensity: stats.sentences ? complexMarkers / stats.sentences : 0,
  };
}

export function fluencyBand(stats: SpeakingStats): number {
  if (stats.words === 0) return 0;
  let band = 4;
  if (stats.words >= 60) band = 5;
  if (stats.words >= 140 && stats.wordsPerMinute >= 80) band = 6;
  if (stats.words >= 240 && stats.wordsPerMinute >= 110 && stats.markerCount >= 3) band = 7;
  if (stats.words >= 340 && stats.wordsPerMinute >= 125 && stats.markerCount >= 6) band = 7.5;
  band -= Math.min(1, stats.hesitationCount * 0.25);
  // Without a recorded delivery time there is no evidence of fluent, unhesitating speech.
  if (stats.rateEstimated) band = Math.min(band, 6);
  return clampBand(band);
}

export function speakingLexicalBand(stats: SpeakingStats): number {
  if (stats.words === 0) return 0;
  let band = 4;
  if (stats.uniqueRatio >= 0.35) band = 5;
  if (stats.uniqueRatio >= 0.45) band = 6;
  if (stats.uniqueRatio >= 0.52 && stats.words >= 200) band = 7;
  if (stats.uniqueRatio >= 0.58 && stats.words >= 300) band = 7.5;
  return clampBand(band);
}

export function speakingGrammarBand(stats: SpeakingStats): number {
  if (stats.words === 0) return 0;
  let band = 4;
  if (stats.complexDensity >= 0.3) band = 5;
  if (stats.complexDensity >= 0.5 && stats.averageSentenceLength >= 10) band = 6;
  if (stats.complexDensity >= 0.8 && stats.averageSentenceLength >= 13) band = 7;
  if (stats.complexDensity >= 1 && stats.averageSentenceLength >= 15) band = 7.5;
  return clampBand(band);
}

/**
 * Pronunciation cannot be judged from a text transcript, so it is estimated from delivery rate
 * and length. The report makes this limitation explicit to the candidate.
 */
export function pronunciationBand(stats: SpeakingStats): number {
  if (stats.words === 0) return 0;
  if (stats.rateEstimated) return 5;
  let band = 5;
  if (stats.wordsPerMinute >= 90 && stats.words >= 120) band = 6;
  if (stats.wordsPerMinute >= 115 && stats.words >= 220) band = 6.5;
  if (stats.wordsPerMinute >= 130 && stats.words >= 320) band = 7;
  return clampBand(band);
}
