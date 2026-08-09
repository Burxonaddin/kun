import { useEffect, useRef, useState } from 'react';

export function formatTime(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

interface TimerProps {
  seconds: number;
  onExpire: () => void;
  label: string;
  /** Restarts the countdown whenever this value changes. */
  resetKey: string | number;
}

export function Timer({ seconds, onExpire, label, resetKey }: TimerProps) {
  const [remaining, setRemaining] = useState(seconds);
  const expired = useRef(false);

  useEffect(() => {
    setRemaining(seconds);
    expired.current = false;
  }, [seconds, resetKey]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRemaining((value) => (value > 0 ? value - 1 : 0));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [resetKey]);

  useEffect(() => {
    if (remaining === 0 && !expired.current) {
      expired.current = true;
      onExpire();
    }
  }, [remaining, onExpire]);

  const danger = remaining <= 300;
  return (
    <div className={`timer ${danger ? 'timer-danger' : ''}`} role="timer" aria-live="off">
      <span className="timer-label">{label}</span>
      <strong data-testid="timer-value">{formatTime(remaining)}</strong>
    </div>
  );
}
