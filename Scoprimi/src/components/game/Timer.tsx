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
    setTimeLeft(duration);
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current !== null) {
            clearInterval(timerRef.current);
          }
          setTimeout(onTimeUp, 0);
          return 0;
        }
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

  return <p>⌛: <span id="timer">{timeLeft}</span> secondi</p>;
};

export default Timer;
