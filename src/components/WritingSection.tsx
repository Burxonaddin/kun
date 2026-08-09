import { useState } from 'react';
import type { Mock } from '../types';

interface Props {
  mock: Mock;
  answers: { task1: string; task2: string };
  onChange: (task: 'task1' | 'task2', value: string) => void;
}

function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export function WritingSection({ mock, answers, onChange }: Props) {
  const [taskIndex, setTaskIndex] = useState(0);
  const task = mock.writing[taskIndex];
  const key = taskIndex === 0 ? 'task1' : 'task2';
  const value = answers[key];
  const words = countWords(value);

  return (
    <div className="section writing">
      <div className="section-bar">
        <div className="part-tabs">
          {mock.writing.map((item, index) => (
            <button key={item.task} className={index === taskIndex ? 'active' : ''} onClick={() => setTaskIndex(index)}>
              Task {item.task}
            </button>
          ))}
        </div>
        <span className={words >= task.minWords ? 'progress ok' : 'progress'}>
          {words} / {task.minWords} so&lsquo;z
        </span>
      </div>

      <div className="writing-split">
        <div className="prompt-pane">
          <h3>{task.title}</h3>
          <p className="prompt">{task.prompt}</p>
          <p className="hint">Tavsiya etilgan vaqt: {task.minutes} daqiqa</p>
          {task.table && (
            <figure>
              <figcaption>{task.table.caption}</figcaption>
              <table>
                <thead>
                  <tr>{task.table.columns.map((column) => <th key={column}>{column}</th>)}</tr>
                </thead>
                <tbody>
                  {task.table.rows.map((row) => (
                    <tr key={String(row[0])}>
                      {row.map((cell, i) => <td key={i}>{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </figure>
          )}
        </div>

        <div className="editor-pane">
          <textarea
            aria-label={task.title}
            value={value}
            onChange={(event) => onChange(key, event.target.value)}
            placeholder="Javobingizni shu yerga yozing…"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
