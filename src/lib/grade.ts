import type {
  AttemptAnswers, AttemptResult, CriterionScore, Mock, QuestionResult, SectionResult,
} from '../types';
import { allQuestions } from './mocks';
import {
  criteriaBand, isAnswerCorrect, listeningBand, overallBand, readingBand,
} from './scoring';
import {
  analyseText, coherenceBand, grammarBand, lexicalBand, taskAchievementBand,
} from './writing';
import {
  analyseSpeaking, fluencyBand, pronunciationBand, speakingGrammarBand, speakingLexicalBand,
} from './speaking';

function gradeObjective(mock: Mock, section: 'listening' | 'reading', answers: Record<string, string>): SectionResult {
  const questions = allQuestions(mock, section);
  const results: QuestionResult[] = questions.map((question) => {
    const given = (answers[String(question.number)] ?? '').trim();
    return {
      number: question.number,
      type: question.type,
      prompt: question.prompt,
      given,
      correct: question.answers[0],
      isCorrect: isAnswerCorrect(given, question.answers),
      explanation: question.explanation,
    };
  });
  const raw = results.filter((r) => r.isCorrect).length;
  const byTypeMap = new Map<string, { correct: number; total: number }>();
  for (const result of results) {
    const entry = byTypeMap.get(result.type) ?? { correct: 0, total: 0 };
    entry.total += 1;
    if (result.isCorrect) entry.correct += 1;
    byTypeMap.set(result.type, entry);
  }
  return {
    section,
    raw,
    total: questions.length,
    band: section === 'listening' ? listeningBand(raw) : readingBand(raw),
    results,
    byType: [...byTypeMap.entries()].map(([type, value]) => ({
      type: type as QuestionResult['type'],
      correct: value.correct,
      total: value.total,
    })),
  };
}

function gradeWriting(mock: Mock, answers: AttemptAnswers['writing']): SectionResult {
  const tasks = mock.writing;
  const bands = [answers.task1, answers.task2].map((text, i) => {
    const stats = analyseText(text);
    const task = tasks[i];
    return {
      stats,
      text,
      task,
      criteria: [
        {
          name: i === 0 ? 'Task Achievement' : 'Task Response',
          band: taskAchievementBand(stats, task, text),
          comment: `${stats.words} words written (minimum ${task.minWords}). ${
            stats.words < task.minWords ? 'Under-length answers are penalised in the real exam.' : 'The length requirement is met.'
          }`,
        },
        {
          name: 'Coherence and Cohesion',
          band: coherenceBand(stats),
          comment: `${stats.paragraphs} paragraph(s) and ${stats.linkerCount} distinct linking expressions detected.`,
        },
        {
          name: 'Lexical Resource',
          band: lexicalBand(stats),
          comment: `Type-token ratio ${(stats.uniqueRatio * 100).toFixed(0)}%, ${stats.academicCount} academic collocations detected.`,
        },
        {
          name: 'Grammatical Range and Accuracy',
          band: grammarBand(stats, text),
          comment: `Average sentence length ${stats.averageSentenceLength.toFixed(1)} words.`,
        },
      ] as CriterionScore[],
    };
  });

  // Task 2 counts double, exactly as in the official marking scheme.
  const task1Band = criteriaBand(bands[0].criteria);
  const task2Band = criteriaBand(bands[1].criteria);
  const band = Math.round(((task1Band + task2Band * 2) / 3) * 2) / 2;

  const criteria: CriterionScore[] = [
    ...bands[0].criteria.map((c) => ({ ...c, name: `Task 1 \u2013 ${c.name}` })),
    ...bands[1].criteria.map((c) => ({ ...c, name: `Task 2 \u2013 ${c.name}` })),
  ];

  return { section: 'writing', raw: task1Band, total: task2Band, band, criteria };
}

function gradeSpeaking(answers: AttemptAnswers['speaking']): SectionResult {
  const transcript = [answers.part1, answers.part2, answers.part3].join('\n\n');
  const stats = analyseSpeaking(transcript, answers.seconds || 1);
  const criteria: CriterionScore[] = [
    {
      name: 'Fluency and Coherence',
      band: fluencyBand(stats),
      comment: `${stats.words} words at about ${stats.wordsPerMinute.toFixed(0)} words per minute.`,
    },
    {
      name: 'Lexical Resource',
      band: speakingLexicalBand(stats),
      comment: `Vocabulary variety ${(stats.uniqueRatio * 100).toFixed(0)}%.`,
    },
    {
      name: 'Grammatical Range and Accuracy',
      band: speakingGrammarBand(stats),
      comment: `${stats.complexDensity.toFixed(2)} subordinate clauses per sentence.`,
    },
    {
      name: 'Pronunciation (estimated)',
      band: pronunciationBand(stats),
      comment: 'Estimated from delivery rate only \u2014 a human examiner is needed for a definitive pronunciation score.',
    },
  ];
  return { section: 'speaking', raw: stats.words, total: Math.round(answers.seconds), band: criteriaBand(criteria), criteria };
}

const TYPE_LABELS: Record<string, string> = {
  'form-completion': 'form completion',
  'note-completion': 'note completion',
  'sentence-completion': 'sentence completion',
  'multiple-choice': 'multiple choice',
  matching: 'matching',
  'true-false-notgiven': 'True/False/Not Given',
  'yes-no-notgiven': 'Yes/No/Not Given',
  'matching-headings': 'matching headings',
  'short-answer': 'short answer',
};

export function gradeAttempt(mock: Mock, userEmail: string, answers: AttemptAnswers): AttemptResult {
  const sections: SectionResult[] = [
    gradeObjective(mock, 'listening', answers.listening),
    gradeObjective(mock, 'reading', answers.reading),
    gradeWriting(mock, answers.writing),
    gradeSpeaking(answers.speaking),
  ];
  const overall = overallBand(sections.map((s) => s.band));

  const sorted = [...sections].sort((a, b) => b.band - a.band);
  const strengths = [`Strongest section: ${sorted[0].section} (band ${sorted[0].band.toFixed(1)})`];
  const weaknesses = [`Weakest section: ${sorted[sorted.length - 1].section} (band ${sorted[sorted.length - 1].band.toFixed(1)})`];
  const advice: string[] = [];

  for (const section of sections) {
    if (!section.byType) continue;
    const weakTypes = section.byType
      .filter((t) => t.total >= 3 && t.correct / t.total < 0.6)
      .sort((a, b) => a.correct / a.total - b.correct / b.total);
    for (const type of weakTypes.slice(0, 2)) {
      weaknesses.push(
        `${section.section}: ${TYPE_LABELS[type.type] ?? type.type} \u2014 ${type.correct}/${type.total} correct`,
      );
      advice.push(
        `Practise ${TYPE_LABELS[type.type] ?? type.type} questions in the ${section.section} section; you scored below 60% on them.`,
      );
    }
    const strongTypes = section.byType.filter((t) => t.total >= 3 && t.correct / t.total >= 0.85);
    for (const type of strongTypes.slice(0, 2)) {
      strengths.push(`${section.section}: ${TYPE_LABELS[type.type] ?? type.type} \u2014 ${type.correct}/${type.total} correct`);
    }
  }

  const writing = sections[2];
  const weakWritingCriterion = writing.criteria?.slice().sort((a, b) => a.band - b.band)[0];
  if (weakWritingCriterion && weakWritingCriterion.band < 6.5) {
    advice.push(`Writing: focus on ${weakWritingCriterion.name} (band ${weakWritingCriterion.band.toFixed(1)}).`);
  }
  const speaking = sections[3];
  const weakSpeakingCriterion = speaking.criteria?.slice().sort((a, b) => a.band - b.band)[0];
  if (weakSpeakingCriterion && weakSpeakingCriterion.band < 6.5) {
    advice.push(`Speaking: focus on ${weakSpeakingCriterion.name} (band ${weakSpeakingCriterion.band.toFixed(1)}).`);
  }
  if (advice.length === 0) advice.push('A consistent performance \u2014 keep practising under full exam timing to hold this level.');

  return {
    id: `${mock.id}-${Date.now()}`,
    mockId: mock.id,
    mockCode: mock.code,
    userEmail,
    finishedAt: Date.now(),
    sections,
    overall,
    strengths,
    weaknesses,
    advice,
  };
}
