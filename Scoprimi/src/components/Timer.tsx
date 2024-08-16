import React, { useEffect, useState, useRef, useCallback } from 'react';

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  isActive: boolean;
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeUp, isActive }) => {
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const timerRef = useRef<number | null>(null);

  const startTimer = useCallback(() => {
    const storedTimeLeft = sessionStorage.getItem('timeLeft');
    if (storedTimeLeft) {
      setTimeLeft(parseInt(storedTimeLeft, 10));
    } else {
      setTimeLeft(duration);
    }

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setTimeout(onTimeUp, 0);
          sessionStorage.removeItem('timeLeft');
          return 0;
        }
        sessionStorage.setItem('timeLeft', (prev - 1).toString());
        return prev - 1;
      });
    }, 1 * 1000);
  }, [duration, onTimeUp]);

  useEffect(() => {
    if (isActive) {
      startTimer();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, startTimer]);

  return <h3>⌛: <span id="timer">{timeLeft}</span> secondi</h3>;
};

export default Timer;
