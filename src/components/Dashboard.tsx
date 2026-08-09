import { useMemo, useState } from 'react';
import type { AttemptResult, User } from '../types';
import { MOCK_COUNT, listMocks } from '../lib/mocks';

interface Props {
  user: User;
  results: AttemptResult[];
  onStart: (mockId: number) => void;
  onOpenResult: (result: AttemptResult) => void;
}

const PAGE_SIZE = 12;

export function Dashboard({ user, results, onStart, onOpenResult }: Props) {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');

  const { items, total } = useMemo(() => listMocks(page, PAGE_SIZE, query), [page, query]);
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const best = results.reduce((max, result) => Math.max(max, result.overall), 0);
  const average = results.length
    ? results.reduce((sum, result) => sum + result.overall, 0) / results.length
    : 0;
  const latest = results[0];

  return (
    <div className="dashboard">
      <section className="stats">
        <div className="stat">
          <span>Salom,</span>
          <strong>{user.name}</strong>
          <span className="muted">Maqsad: band {user.targetBand}</span>
        </div>
        <div className="stat"><span>Ishlangan mocklar</span><strong>{results.length}</strong></div>
        <div className="stat"><span>Eng yaxshi ball</span><strong>{best ? best.toFixed(1) : '—'}</strong></div>
        <div className="stat"><span>O&lsquo;rtacha ball</span><strong>{average ? average.toFixed(1) : '—'}</strong></div>
        <div className="stat">
          <span>Oxirgi urinish</span>
          <strong>{latest ? latest.overall.toFixed(1) : '—'}</strong>
          <span className="muted">{latest ? latest.mockCode : 'hali yo\u2018q'}</span>
        </div>
      </section>

      {results.length > 0 && (
        <section className="history">
          <h3>Natijalar tarixi</h3>
          <table>
            <thead>
              <tr><th>Sana</th><th>Mock</th><th>L</th><th>R</th><th>W</th><th>S</th><th>Overall</th><th /></tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.id}>
                  <td>{new Date(result.finishedAt).toLocaleDateString()}</td>
                  <td>{result.mockCode}</td>
                  {result.sections.map((section) => (
                    <td key={section.section}>{section.band.toFixed(1)}</td>
                  ))}
                  <td><strong>{result.overall.toFixed(1)}</strong></td>
                  <td><button onClick={() => onOpenResult(result)}>Tahlil</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section className="catalogue">
        <div className="catalogue-head">
          <h3>Mock testlar ({MOCK_COUNT} ta)</h3>
          <input
            value={query}
            onChange={(event) => { setQuery(event.target.value); setPage(1); }}
            placeholder="Qidiruv: kod, mavzu yoki daraja"
            aria-label="Mock qidirish"
          />
        </div>
        <div className="mock-grid">
          {items.map((mock) => (
            <article className="mock-card" key={mock.id}>
              <span className={`badge ${mock.difficulty}`}>{mock.difficulty}</span>
              <h4>{mock.code}</h4>
              <p className="muted">{mock.topic}</p>
              <button className="primary" onClick={() => onStart(mock.id)}>Boshlash</button>
            </article>
          ))}
        </div>
        <div className="pager">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Oldingi</button>
          <span>{page} / {pageCount}</span>
          <button disabled={page >= pageCount} onClick={() => setPage((p) => p + 1)}>Keyingi</button>
        </div>
      </section>
    </div>
  );
}
