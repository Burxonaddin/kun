import type { Question } from '../types';

interface QuestionFieldProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

/** Renders the right input for a question type: radio buttons for choices, a text box otherwise. */
export function QuestionField({ question, value, onChange }: QuestionFieldProps) {
  const choiceOptions =
    question.type === 'multiple-choice' ||
    question.type === 'matching' ||
    question.type === 'matching-headings' ||
    question.type === 'true-false-notgiven' ||
    question.type === 'yes-no-notgiven'
      ? question.options ?? []
      : null;

  return (
    <div className="question" id={`q-${question.number}`}>
      <div className="question-head">
        <span className="qnum">{question.number}</span>
        <p className="qprompt">{question.prompt}</p>
      </div>

      {choiceOptions ? (
        <div className={`options ${choiceOptions.length > 4 ? 'options-grid' : ''}`}>
          {choiceOptions.map((option) => {
            const letter = option.includes('.') ? option.split('.')[0].trim() : option;
            return (
              <label key={option} className={value === letter ? 'option selected' : 'option'}>
                <input
                  type="radio"
                  name={`q-${question.number}`}
                  value={letter}
                  checked={value === letter}
                  onChange={() => onChange(letter)}
                />
                <span>{option}</span>
              </label>
            );
          })}
        </div>
      ) : (
        <div className="text-answer">
          <input
            type="text"
            aria-label={`Question ${question.number}`}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Javobingiz"
          />
          {question.wordLimit && <span className="limit">{question.wordLimit}</span>}
        </div>
      )}
    </div>
  );
}
