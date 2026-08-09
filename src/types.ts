export type SectionId = 'listening' | 'reading' | 'writing' | 'speaking';

export type QuestionType =
  | 'form-completion'
  | 'note-completion'
  | 'sentence-completion'
  | 'multiple-choice'
  | 'matching'
  | 'true-false-notgiven'
  | 'yes-no-notgiven'
  | 'matching-headings'
  | 'short-answer';

export interface Question {
  /** Global 1-based number inside its section (1..40 for listening/reading). */
  number: number;
  type: QuestionType;
  prompt: string;
  /** Present for multiple-choice / matching style questions. */
  options?: string[];
  /** All accepted answers, lower-cased and trimmed. First one is the canonical answer. */
  answers: string[];
  explanation: string;
  /** Word limit hint shown to the candidate, e.g. "NO MORE THAN TWO WORDS". */
  wordLimit?: string;
}

export interface QuestionGroup {
  id: string;
  type: QuestionType;
  instructions: string;
  /** Optional shared option list (matching / headings). */
  options?: string[];
  questions: Question[];
}

export interface ListeningPart {
  number: 1 | 2 | 3 | 4;
  title: string;
  context: string;
  /** Spoken text, played back with speech synthesis and revealed in the analysis. */
  transcript: string;
  groups: QuestionGroup[];
}

export interface ReadingPassage {
  number: 1 | 2 | 3;
  title: string;
  /** Paragraphs, each labelled A, B, C ... for heading matching. */
  paragraphs: string[];
  groups: QuestionGroup[];
}

export interface WritingTask {
  task: 1 | 2;
  title: string;
  prompt: string;
  minWords: number;
  minutes: number;
  /** Data table rendered for Task 1 so the candidate has real figures to report. */
  table?: { caption: string; columns: string[]; rows: (string | number)[][] };
  /** Content points a strong answer is expected to cover. */
  keyPoints: string[];
}

export interface SpeakingPart {
  part: 1 | 2 | 3;
  title: string;
  instructions: string;
  questions: string[];
  /** Cue card bullets for part 2. */
  bullets?: string[];
  prepSeconds: number;
  speakSeconds: number;
}

export interface Mock {
  id: number;
  code: string;
  title: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  listening: ListeningPart[];
  reading: ReadingPassage[];
  writing: WritingTask[];
  speaking: SpeakingPart[];
}

export type AnswerMap = Record<string, string>;

export interface AttemptAnswers {
  listening: AnswerMap;
  reading: AnswerMap;
  writing: { task1: string; task2: string };
  speaking: { part1: string; part2: string; part3: string; seconds: number };
}

export interface QuestionResult {
  number: number;
  type: QuestionType;
  prompt: string;
  given: string;
  correct: string;
  isCorrect: boolean;
  explanation: string;
}

export interface CriterionScore {
  name: string;
  band: number;
  comment: string;
}

export interface SectionResult {
  section: SectionId;
  raw: number;
  total: number;
  band: number;
  results?: QuestionResult[];
  criteria?: CriterionScore[];
  byType?: { type: QuestionType; correct: number; total: number }[];
}

export interface AttemptResult {
  id: string;
  mockId: number;
  mockCode: string;
  userEmail: string;
  finishedAt: number;
  sections: SectionResult[];
  overall: number;
  strengths: string[];
  weaknesses: string[];
  advice: string[];
}

export interface User {
  email: string;
  name: string;
  country: string;
  targetBand: number;
  createdAt: number;
  passwordHash: string;
  salt: string;
}
