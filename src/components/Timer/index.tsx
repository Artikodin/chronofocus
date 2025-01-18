import { useState, useEffect } from 'react';

import { formatRawInput, formatTimerRunning, parseHHMMSStringToMs } from './utils';
import { useHashChange } from '../../hooks/useHashchange';

type Props = {
  time: string;
  setTime: React.Dispatch<React.SetStateAction<string>>;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
};



export default function Timer({ time, setTime, onStart, onStop, onReset }: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [accumulatedTime, setAccumulatedTime] = useState<number>(0);
  const [renderTime, setRenderTime] = useState<number | null>(null);

  useEffect(() => {
    let intervalId: number;

    if (startTime !== null) {
      intervalId = setInterval(() => {
        setRenderTime(performance.now());
      }, 500);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [startTime]);

  const handleTimeInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      setTime((prev) => prev.slice(0, -1));
      e.preventDefault();
      return;
    }

    if (/^\d$/.test(e.key)) {
      setTime((prev) => {
        if (prev.length >= 6) {
          return prev.slice(1, 6) + e.key;
        }
        return prev + e.key;
      });
    }
  };

  const handleAddTime = (time: number) => () => {
    setTime((prev) => {
      const hours = +prev.slice(0, -4);
      const minutes = +prev.slice(2, -2);
      const seconds = +prev.slice(-2);

      const _newMinutes = minutes + time;

      if (_newMinutes >= 60) {
        const newHours = hours + 1 > 99 ? 1 : hours + 1;
        const cappedMinutes = Math.min(60, _newMinutes);
        const newMinutes = cappedMinutes % 60;

        const paddedHours = newHours.toString().padStart(2, '0');
        const paddedMinutes = newMinutes.toString().padStart(2, '0');
        const paddedSeconds = seconds.toString().padStart(2, '0');

        return `${paddedHours}${paddedMinutes}${paddedSeconds}`;
      }

      const paddedHours = hours.toString().padStart(2, '0');
      const paddedMinutes = _newMinutes.toString().padStart(2, '0');
      const paddedSeconds = seconds.toString().padStart(2, '0');

      return `${paddedHours}${paddedMinutes}${paddedSeconds}`;
    });
  };

  const pause = () => {
    if (!startTime) return;

    const currentElapsed = performance.now() - startTime;
    setAccumulatedTime((prev) => prev + currentElapsed);
    setStartTime(null);
  };

  const handleStart = () => {
    if (remainingMs <= 0) return;
    setStartTime(performance.now());
    onStart();
  };

  const handleStop = () => {
    pause();
    onStop();
  };

  const handleReset = () => {
    setStartTime(null);
    setAccumulatedTime(0);
    onReset();
  };

  useHashChange(handleReset);

  const elapsedMs = startTime ? performance.now() - startTime + accumulatedTime : accumulatedTime;

  const formattedRaw = formatRawInput(time);
  const formattedTimer = formatTimerRunning(time, elapsedMs);

  const totalMs = parseHHMMSStringToMs(time);
  const remainingMs = totalMs - elapsedMs;

  useEffect(() => {
    if (startTime !== null && remainingMs <= 0) {
      pause();
    }
  }, [remainingMs, startTime]);

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="text-white">{elapsedMs}</div>
      <input
        type="text"
        value={isFocused ? formattedRaw : formattedTimer}
        onKeyDown={handleTimeInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={() => {}}
      />
      <div className="bg-white">
        <button onClick={handleAddTime(1)}>+1:00</button>
        <button onClick={handleAddTime(10)}>+10:00</button>
        <button onClick={handleAddTime(15)}>+15:00</button>
      </div>

      <div className="bg-white">
        <button onClick={handleStart}>start</button>
        <button onClick={handleStop}>stop</button>
        <button onClick={handleReset}>reset</button>
      </div>
    </div>
  );
}
