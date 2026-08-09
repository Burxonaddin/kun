import { useState } from 'react';
import { loginUser, registerUser } from '../lib/storage';
import type { User } from '../types';

interface AuthPageProps {
  onAuthenticated: (user: User) => void;
}

export function AuthPage({ onAuthenticated }: AuthPageProps) {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('Uzbekistan');
  const [targetBand, setTargetBand] = useState(7);
  const [error, setError] = useState<string | null>(null);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    const result =
      mode === 'register'
        ? registerUser({ name, email, password, country, targetBand })
        : loginUser(email, password);
    if (result.error || !result.user) {
      setError(result.error ?? 'Nomaʼlum xatolik.');
      return;
    }
    onAuthenticated(result.user);
  }

  return (
    <div className="auth-shell">
      <div className="auth-hero">
        <h1>IELTS Full Mock Platform</h1>
        <p>
          Haqiqiy imtihon tartibida to&lsquo;liq IELTS mock testlari: Listening, Reading, Writing va Speaking.
          Har bir urinishdan so&lsquo;ng real band score va batafsil tahlil olasiz.
        </p>
        <ul>
          <li>1200 ta noyob to&lsquo;liq mock test</li>
          <li>Imtihondagidek taymer va bo&lsquo;limlar tartibi</li>
          <li>Rasmiy raw score &rarr; band konvertatsiyasi</li>
          <li>Har bir savol bo&lsquo;yicha tahlil va tavsiyalar</li>
        </ul>
      </div>

      <form className="auth-card" onSubmit={submit}>
        <div className="tabs">
          <button
            type="button"
            className={mode === 'register' ? 'active' : ''}
            onClick={() => { setMode('register'); setError(null); }}
          >
            Ro&lsquo;yxatdan o&lsquo;tish
          </button>
          <button
            type="button"
            className={mode === 'login' ? 'active' : ''}
            onClick={() => { setMode('login'); setError(null); }}
          >
            Kirish
          </button>
        </div>

        {mode === 'register' && (
          <label>
            Ism familiya
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ism Familiya" />
          </label>
        )}

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="siz@example.com"
            autoComplete="username"
          />
        </label>

        <label>
          Parol
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Kamida 8 belgi, harf va raqam"
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
          />
        </label>

        {mode === 'register' && (
          <div className="row">
            <label>
              Davlat
              <input value={country} onChange={(e) => setCountry(e.target.value)} />
            </label>
            <label>
              Maqsadli ball
              <input
                type="number"
                min={1}
                max={9}
                step={0.5}
                value={targetBand}
                onChange={(e) => setTargetBand(Number(e.target.value))}
              />
            </label>
          </div>
        )}

        {error && <p className="error" role="alert">{error}</p>}

        <button type="submit" className="primary">
          {mode === 'register' ? 'Hisob yaratish' : 'Kirish'}
        </button>
        <p className="hint">
          Testlar faqat ro&lsquo;yxatdan o&lsquo;tgan foydalanuvchilar uchun ochiq. Maʼlumotlar shu brauzerda saqlanadi.
        </p>
      </form>
    </div>
  );
}
