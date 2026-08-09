import { useMemo, useState } from 'react';
import type { AnswerMap, Mock } from '../types';
import { QuestionField } from './QuestionField';

interface Props {
  mock: Mock;
  answers: AnswerMap;
  onAnswer: (questionNumber: number, value: string) => void;
}

function speak(text: string, onEnd: () => void): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEnd();
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text.replace(/^[A-Za-z ]+:\s?/gm, ''));
  utterance.rate = 0.95;
  utterance.lang = 'en-GB';
  utterance.onend = onEnd;
  utterance.onerror = onEnd;
  window.speechSynthesis.speak(utterance);
}

export function ListeningSection({ mock, answers, onAnswer }: Props) {
  const [partIndex, setPartIndex] = useState(0);
  const [playedParts, setPlayedParts] = useState<number[]>([]);
  const [playing, setPlaying] = useState(false);
  const part = mock.listening[partIndex];
  const played = playedParts.includes(partIndex);

  const answered = useMemo(
    () => mock.listening.flatMap((p) => p.groups.flatMap((g) => g.questions)).filter((q) => answers[String(q.number)]).length,
    [mock, answers],
  );

  return (
    <div className="section listening">
      <div className="section-bar">
        <div className="part-tabs">
          {mock.listening.map((item, index) => (
            <button
              key={item.number}
              className={index === partIndex ? 'active' : ''}
              onClick={() => setPartIndex(index)}
            >
              Part {item.number}
            </button>
          ))}
        </div>
        <span className="progress">{answered}/40 javob berildi</span>
      </div>

      <div className="audio-panel">
        <div>
          <h3>{part.title}</h3>
          <p>{part.context}</p>
        </div>
        <button
          className="primary"
          disabled={played || playing}
          onClick={() => {
            setPlaying(true);
            setPlayedParts((parts) => [...parts, partIndex]);
            speak(part.transcript, () => setPlaying(false));
          }}
        >
          {playing ? 'Ijro etilmoqda\u2026' : played ? 'Audio allaqachon ijro etildi' : '\u25b6 Audioni ijro etish (1 marta)'}
        </button>
      </div>

      {part.groups.map((group) => (
        <div className="group" key={group.id}>
          <p className="instructions">{group.instructions}</p>
          {group.options && group.type === 'matching' && (
            <ul className="option-bank">
              {group.options.map((option) => <li key={option}>{option}</li>)}
            </ul>
          )}
          {group.questions.map((question) => (
            <QuestionField
              key={question.number}
              question={question}
              value={answers[String(question.number)] ?? ''}
              onChange={(value) => onAnswer(question.number, value)}
            />
          ))}
        </div>
      ))}

      <div className="section-footer">
        <button disabled={partIndex === 0} onClick={() => setPartIndex((i) => i - 1)}>Oldingi part</button>
        <button
          disabled={partIndex === mock.listening.length - 1}
          onClick={() => setPartIndex((i) => i + 1)}
        >
          Keyingi part
        </button>
      </div>
    </div>
  );
}
