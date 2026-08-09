import { useCallback, useEffect, useState } from 'react';
import type { AttemptResult, User } from './types';
import { currentUser, getResults, logout } from './lib/storage';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { Exam } from './components/Exam';
import { ResultReport } from './components/ResultReport';
import './styles.css';

type View =
  | { name: 'dashboard' }
  | { name: 'exam'; mockId: number }
  | { name: 'result'; result: AttemptResult };

export default function App() {
  const [user, setUser] = useState<User | null>(() => currentUser());
  const [results, setResults] = useState<AttemptResult[]>([]);
  const [view, setView] = useState<View>({ name: 'dashboard' });

  useEffect(() => {
    setResults(user ? getResults(user.email) : []);
  }, [user]);

  const handleFinished = useCallback(
    (result: AttemptResult) => {
      setResults((previous) => [result, ...previous]);
      setView({ name: 'result', result });
    },
    [],
  );

  if (!user) {
    return <AuthPage onAuthenticated={(authenticated) => { setUser(authenticated); setView({ name: 'dashboard' }); }} />;
  }

  return (
    <div className="app">
      <nav className="topbar">
        <button className="brand" onClick={() => setView({ name: 'dashboard' })}>IELTS Mock Platform</button>
        <div className="topbar-right">
          <span className="muted">{user.email}</span>
          <button
            onClick={() => {
              logout();
              setUser(null);
              setView({ name: 'dashboard' });
            }}
          >
            Chiqish
          </button>
        </div>
      </nav>

      <main>
        {view.name === 'dashboard' && (
          <Dashboard
            user={user}
            results={results}
            onStart={(mockId) => setView({ name: 'exam', mockId })}
            onOpenResult={(result) => setView({ name: 'result', result })}
          />
        )}
        {view.name === 'exam' && (
          <Exam
            mockId={view.mockId}
            user={user}
            onFinished={handleFinished}
            onQuit={() => setView({ name: 'dashboard' })}
          />
        )}
        {view.name === 'result' && (
          <ResultReport
            result={view.result}
            onBack={() => setView({ name: 'dashboard' })}
            onRetake={(mockId) => setView({ name: 'exam', mockId })}
          />
        )}
      </main>
    </div>
  );
}
