import { useCallback, useMemo, useState } from 'react';
import type { AttemptAnswers, AttemptResult, Mock, SectionId, User } from '../types';
import { buildMock } from '../lib/mocks';
import { gradeAttempt } from '../lib/grade';
import { saveResult } from '../lib/storage';
import { Timer } from './Timer';
import { ListeningSection } from './ListeningSection';
import { ReadingSection } from './ReadingSection';
import { WritingSection } from './WritingSection';
import { SpeakingSection } from './SpeakingSection';

/** Section order and official timing, in minutes. */
export const SECTION_PLAN: { id: SectionId; label: string; minutes: number }[] = [
  { id: 'listening', label: 'Listening', minutes: 30 },
  { id: 'reading', label: 'Reading', minutes: 60 },
  { id: 'writing', label: 'Writing', minutes: 60 },
  { id: 'speaking', label: 'Speaking', minutes: 14 },
];

export function emptyAnswers(): AttemptAnswers {
  return {
    listening: {},
    reading: {},
    writing: { task1: '', task2: '' },
    speaking: { part1: '', part2: '', part3: '', seconds: 0 },
  };
}

interface ExamProps {
  mockId: number;
  user: User;
  onFinished: (result: AttemptResult) => void;
  onQuit: () => void;
}

export function Exam({ mockId, user, onFinished, onQuit }: ExamProps) {
  const mock: Mock = useMemo(() => buildMock(mockId), [mockId]);
  const [stage, setStage] = useState<'briefing' | 'running'>('briefing');
  const [sectionIndex, setSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<AttemptAnswers>(emptyAnswers);
  const [confirming, setConfirming] = useState(false);
  const section = SECTION_PLAN[sectionIndex];

  const finish = useCallback(
    (finalAnswers: AttemptAnswers) => {
      const result = gradeAttempt(mock, user.email, finalAnswers);
      saveResult(result);
      onFinished(result);
    },
    [mock, user.email, onFinished],
  );

  const advance = useCallback(() => {
    setConfirming(false);
    if (sectionIndex < SECTION_PLAN.length - 1) {
      setSectionIndex((index) => index + 1);
    } else {
      finish(answers);
    }
  }, [sectionIndex, answers, finish]);

  if (stage === 'briefing') {
    return (
      <div className="briefing">
        <h2>{mock.title}</h2>
        <p className="code">{mock.code} &middot; {mock.difficulty}</p>
        <ol className="plan">
          {SECTION_PLAN.map((item) => (
            <li key={item.id}>
              <strong>{item.label}</strong> — {item.minutes} daqiqa
            </li>
          ))}
        </ol>
        <ul className="rules">
          <li>Har bir bo&lsquo;lim uchun taymer ishlaydi; vaqt tugaganda keyingi bo&lsquo;limga avtomatik o&lsquo;tiladi.</li>
          <li>Listening audiosi har bir part uchun faqat bir marta ijro etiladi.</li>
          <li>Bo&lsquo;lim yakunlangach, unga qaytib bo&lsquo;lmaydi — xuddi haqiqiy imtihondagidek.</li>
          <li>Test oxirida real band score va to&lsquo;liq tahlil beriladi.</li>
        </ul>
        <div className="row">
          <button className="primary" onClick={() => setStage('running')}>Imtihonni boshlash</button>
          <button onClick={onQuit}>Bekor qilish</button>
        </div>
      </div>
    );
  }

  return (
    <div className="exam">
      <header className="exam-header">
        <div>
          <strong>{mock.code}</strong>
          <span className="muted"> · {section.label}</span>
        </div>
        <div className="steps">
          {SECTION_PLAN.map((item, index) => (
            <span key={item.id} className={index === sectionIndex ? 'step active' : index < sectionIndex ? 'step done' : 'step'}>
              {item.label}
            </span>
          ))}
        </div>
        <Timer
          key={section.id}
          resetKey={section.id}
          seconds={section.minutes * 60}
          label={`${section.label} qolgan vaqt`}
          onExpire={advance}
        />
      </header>

      {section.id === 'listening' && (
        <ListeningSection
          mock={mock}
          answers={answers.listening}
          onAnswer={(number, value) =>
            setAnswers((prev) => ({ ...prev, listening: { ...prev.listening, [number]: value } }))
          }
        />
      )}
      {section.id === 'reading' && (
        <ReadingSection
          mock={mock}
          answers={answers.reading}
          onAnswer={(number, value) =>
            setAnswers((prev) => ({ ...prev, reading: { ...prev.reading, [number]: value } }))
          }
        />
      )}
      {section.id === 'writing' && (
        <WritingSection
          mock={mock}
          answers={answers.writing}
          onChange={(task, value) => setAnswers((prev) => ({ ...prev, writing: { ...prev.writing, [task]: value } }))}
        />
      )}
      {section.id === 'speaking' && (
        <SpeakingSection
          mock={mock}
          answers={answers.speaking}
          onChange={(part, value) => setAnswers((prev) => ({ ...prev, speaking: { ...prev.speaking, [part]: value } }))}
          onSeconds={(seconds) => setAnswers((prev) => ({ ...prev, speaking: { ...prev.speaking, seconds } }))}
        />
      )}

      <footer className="exam-footer">
        <button onClick={onQuit} className="ghost">Imtihondan chiqish</button>
        <button className="primary" onClick={() => setConfirming(true)}>
          {sectionIndex === SECTION_PLAN.length - 1 ? 'Imtihonni yakunlash' : `${SECTION_PLAN[sectionIndex + 1].label} bo\u2018limiga o\u2018tish`}
        </button>
      </footer>

      {confirming && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Ishonchingiz komilmi?</h3>
            <p>
              {sectionIndex === SECTION_PLAN.length - 1
                ? 'Imtihon yakunlanadi va natijangiz hisoblanadi.'
                : `${section.label} bo\u2018limi yopiladi va unga qaytib bo\u2018lmaydi.`}
            </p>
            <div className="row">
              <button className="primary" onClick={advance}>Ha, davom etish</button>
              <button onClick={() => setConfirming(false)}>Orqaga</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
