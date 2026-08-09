import { useEffect, useRef, useState } from 'react';
import type { Mock } from '../types';
import { formatTime } from './Timer';

interface Props {
  mock: Mock;
  answers: { part1: string; part2: string; part3: string; seconds: number };
  onChange: (part: 'part1' | 'part2' | 'part3', value: string) => void;
  onSeconds: (seconds: number) => void;
}

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>>; resultIndex: number }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

function createRecognition(): SpeechRecognitionLike | null {
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  if (!Ctor) return null;
  const recognition = new Ctor();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-GB';
  return recognition;
}

export function SpeakingSection({ mock, answers, onChange, onSeconds }: Props) {
  const [partIndex, setPartIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const part = mock.speaking[partIndex];
  const key = (['part1', 'part2', 'part3'] as const)[partIndex];

  useEffect(() => {
    if (!recording) return;
    const interval = window.setInterval(() => {
      setElapsed((value) => {
        onSeconds(answers.seconds + 1);
        return value + 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
    // answers.seconds intentionally read through the callback to keep the total cumulative.
  }, [recording, answers.seconds, onSeconds]);

  function start() {
    setElapsed(0);
    setRecording(true);
    const recognition = createRecognition();
    if (!recognition) {
      setSupported(false);
      return;
    }
    recognition.onresult = (event) => {
      let text = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        text += `${event.results[i][0].transcript} `;
      }
      onChange(key, `${answers[key]} ${text}`.trim());
    };
    recognition.onerror = () => setSupported(false);
    recognition.onend = () => setRecording(false);
    recognition.start();
    recognitionRef.current = recognition;
  }

  function stop() {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setRecording(false);
  }

  return (
    <div className="section speaking">
      <div className="section-bar">
        <div className="part-tabs">
          {mock.speaking.map((item, index) => (
            <button key={item.part} className={index === partIndex ? 'active' : ''} onClick={() => setPartIndex(index)}>
              Part {item.part}
            </button>
          ))}
        </div>
        <span className="progress">Jami gapirilgan vaqt: {formatTime(answers.seconds)}</span>
      </div>

      <div className="speaking-body">
        <div className="prompt-pane">
          <h3>{part.title}</h3>
          <p className="instructions">{part.instructions}</p>
          {part.part === 2 ? (
            <div className="cue-card">
              <p className="cue-prompt">{part.questions[0]}</p>
              <ul>{part.bullets?.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
              <p className="hint">Tayyorgarlik: {part.prepSeconds}s · Javob: 1–2 daqiqa</p>
            </div>
          ) : (
            <ol className="q-list">{part.questions.map((question) => <li key={question}>{question}</li>)}</ol>
          )}
        </div>

        <div className="editor-pane">
          <div className="recorder">
            {recording ? (
              <button className="danger" onClick={stop}>■ To&lsquo;xtatish ({formatTime(elapsed)})</button>
            ) : (
              <button className="primary" onClick={start}>● Javobni yozishni boshlash</button>
            )}
          </div>
          {!supported && (
            <p className="hint">
              Brauzeringiz nutqni tanimaydi. Javobingizni matn sifatida yozing — baholash matn asosida amalga oshiriladi.
            </p>
          )}
          <textarea
            aria-label={`Speaking ${key}`}
            value={answers[key]}
            onChange={(event) => onChange(key, event.target.value)}
            placeholder="Javobingiz matni (nutq tanish ishlamasa, shu yerga yozing)…"
          />
        </div>
      </div>
    </div>
  );
}
