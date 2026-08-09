import { useMemo, useState } from 'react';
import type { AnswerMap, Mock } from '../types';
import { QuestionField } from './QuestionField';

interface Props {
  mock: Mock;
  answers: AnswerMap;
  onAnswer: (questionNumber: number, value: string) => void;
}

const PARAGRAPH_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

export function ReadingSection({ mock, answers, onAnswer }: Props) {
  const [passageIndex, setPassageIndex] = useState(0);
  const passage = mock.reading[passageIndex];

  const answered = useMemo(
    () => mock.reading.flatMap((p) => p.groups.flatMap((g) => g.questions)).filter((q) => answers[String(q.number)]).length,
    [mock, answers],
  );

  return (
    <div className="section reading">
      <div className="section-bar">
        <div className="part-tabs">
          {mock.reading.map((item, index) => (
            <button key={item.number} className={index === passageIndex ? 'active' : ''} onClick={() => setPassageIndex(index)}>
              Passage {item.number}
            </button>
          ))}
        </div>
        <span className="progress">{answered}/40 javob berildi</span>
      </div>

      <div className="reading-split">
        <article className="passage">
          <h3>{passage.title}</h3>
          {passage.paragraphs.map((paragraph, index) => (
            <p key={index}>
              <strong className="para-letter">{PARAGRAPH_LETTERS[index]}</strong> {paragraph}
            </p>
          ))}
        </article>

        <div className="questions-pane">
          {passage.groups.map((group) => (
            <div className="group" key={group.id}>
              <p className="instructions">{group.instructions}</p>
              {group.options && group.type === 'matching-headings' && (
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
        </div>
      </div>

      <div className="section-footer">
        <button disabled={passageIndex === 0} onClick={() => setPassageIndex((i) => i - 1)}>Oldingi passage</button>
        <button disabled={passageIndex === mock.reading.length - 1} onClick={() => setPassageIndex((i) => i + 1)}>
          Keyingi passage
        </button>
      </div>
    </div>
  );
}
