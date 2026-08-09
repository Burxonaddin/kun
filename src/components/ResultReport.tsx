import { useState } from 'react';
import type { AttemptResult, SectionResult } from '../types';
import { bandLabel } from '../lib/scoring';
import { buildMock } from '../lib/mocks';

interface Props {
  result: AttemptResult;
  onBack: () => void;
  onRetake: (mockId: number) => void;
}

const SECTION_NAMES: Record<string, string> = {
  listening: 'Listening',
  reading: 'Reading',
  writing: 'Writing',
  speaking: 'Speaking',
};

function SectionCard({ section }: { section: SectionResult }) {
  return (
    <div className="score-card">
      <span className="score-section">{SECTION_NAMES[section.section]}</span>
      <strong className="score-band">{section.band.toFixed(1)}</strong>
      {section.results && <span className="score-raw">{section.raw}/{section.total} to&lsquo;g&lsquo;ri</span>}
      {!section.results && section.section === 'writing' && (
        <span className="score-raw">Task 1: {section.raw.toFixed(1)} · Task 2: {section.total.toFixed(1)}</span>
      )}
      {!section.results && section.section === 'speaking' && (
        <span className="score-raw">{section.raw} so&lsquo;z · {section.total}s</span>
      )}
    </div>
  );
}

export function ResultReport({ result, onBack, onRetake }: Props) {
  const [openSection, setOpenSection] = useState<string | null>('listening');
  const [showTranscripts, setShowTranscripts] = useState(false);
  const mock = buildMock(result.mockId);

  return (
    <div className="report">
      <header className="report-head">
        <div>
          <h2>Natijangiz — {result.mockCode}</h2>
          <p className="muted">{new Date(result.finishedAt).toLocaleString()}</p>
        </div>
        <div className="overall">
          <span>Overall band</span>
          <strong>{result.overall.toFixed(1)}</strong>
          <span className="muted">{bandLabel(result.overall)}</span>
        </div>
      </header>

      <div className="score-grid">
        {result.sections.map((section) => <SectionCard key={section.section} section={section} />)}
      </div>

      <section className="analysis">
        <div className="analysis-col">
          <h3>Kuchli tomonlar</h3>
          <ul>{result.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div className="analysis-col">
          <h3>Zaif tomonlar</h3>
          <ul>{result.weaknesses.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div className="analysis-col">
          <h3>Tavsiyalar</h3>
          <ul>{result.advice.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </section>

      {result.sections.map((section) => (
        <section className="detail" key={section.section}>
          <button className="detail-toggle" onClick={() => setOpenSection(openSection === section.section ? null : section.section)}>
            {SECTION_NAMES[section.section]} tahlili — band {section.band.toFixed(1)}
            <span>{openSection === section.section ? '−' : '+'}</span>
          </button>

          {openSection === section.section && (
            <div className="detail-body">
              {section.byType && (
                <table className="type-table">
                  <thead>
                    <tr><th>Savol turi</th><th>To&lsquo;g&lsquo;ri</th><th>Foiz</th></tr>
                  </thead>
                  <tbody>
                    {section.byType.map((type) => (
                      <tr key={type.type}>
                        <td>{type.type}</td>
                        <td>{type.correct}/{type.total}</td>
                        <td>{Math.round((type.correct / type.total) * 100)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {section.results && (
                <table className="answers-table">
                  <thead>
                    <tr><th>#</th><th>Savol</th><th>Sizning javobingiz</th><th>To&lsquo;g&lsquo;ri javob</th><th>Izoh</th></tr>
                  </thead>
                  <tbody>
                    {section.results.map((item) => (
                      <tr key={item.number} className={item.isCorrect ? 'correct' : 'wrong'}>
                        <td>{item.number}</td>
                        <td>{item.prompt}</td>
                        <td>{item.given || <em>bo&lsquo;sh</em>}</td>
                        <td>{item.correct}</td>
                        <td>{item.explanation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {section.criteria && (
                <table className="type-table">
                  <thead><tr><th>Mezon</th><th>Band</th><th>Izoh</th></tr></thead>
                  <tbody>
                    {section.criteria.map((criterion) => (
                      <tr key={criterion.name}>
                        <td>{criterion.name}</td>
                        <td>{criterion.band.toFixed(1)}</td>
                        <td>{criterion.comment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </section>
      ))}

      <section className="detail">
        <button className="detail-toggle" onClick={() => setShowTranscripts(!showTranscripts)}>
          Listening transkriptlari {showTranscripts ? '−' : '+'}
        </button>
        {showTranscripts && (
          <div className="detail-body">
            {mock.listening.map((part) => (
              <div key={part.number}>
                <h4>{part.title}</h4>
                <pre className="transcript">{part.transcript}</pre>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="row report-actions">
        <button className="primary" onClick={() => onRetake(result.mockId + 1)}>Keyingi mockni ishlash</button>
        <button onClick={onBack}>Kabinetga qaytish</button>
      </div>
    </div>
  );
}
