import { useState, useEffect } from 'react';

const parseHHMMSStringToMs = (value: string) => {
  const padded = value.padStart(6, '0');
  const hours = +padded.slice(0, -4);
  const minutes = +padded.slice(2, -2);
  const seconds = +padded.slice(-2);

  const cappedMinutes = Math.min(59, minutes);
  const cappedSeconds = Math.min(59, seconds);

  return (hours * 3600 + cappedMinutes * 60 + cappedSeconds) * 1000;
};

function formatMsToHHMMSS(millisecond: number) {
  const safeMs = Math.max(0, millisecond);

  const totalSeconds = Math.floor(safeMs / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  return `${hours}${minutes}${seconds}`;
}

const formatRawInput = (value: string) => {
  const padded = value.padStart(6, '0');

  const hours = padded.substring(0, 2);
  const minutes = padded.substring(2, 4);
  const seconds = padded.substring(4, 6);

  return `${hours}:${minutes}:${seconds}`;
};

const formatTimerRunning = (value: string, elapsedMs: number) => {
  const timerMS = parseHHMMSStringToMs(value);
  const newTimerMs = timerMS - elapsedMs;
  const timerHHMMSS = formatMsToHHMMSS(newTimerMs);

  return formatRawInput(timerHHMMSS);
};

export default function Timer() {
  const [time, setTime] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [renderTime, setRenderTime] = useState<number | null>(null);
  const [accumulatedTime, setAccumulatedTime] = useState<number>(0);

  useEffect(() => {
    let intervalId: number;

    if (startTime !== null) {
      intervalId = setInterval(() => {
        setRenderTime(Date.now());
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
        const newMinutes = _newMinutes % 60;

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

  const handleStart = () => {
    if (remainingMs <= 0) return;
    setStartTime(Date.now());
  };

  const handleStop = () => {
    if (!startTime) return;

    const currentElapsed = Date.now() - startTime;
    setAccumulatedTime((prev) => prev + currentElapsed);
    setStartTime(null);
  };

  const handleReset = () => {
    setStartTime(null);
    setAccumulatedTime(0);
  };

  const elapsedMs = startTime ? Date.now() - startTime + accumulatedTime : accumulatedTime;

  const formattedRaw = formatRawInput(time);
  const formattedTimer = formatTimerRunning(time, elapsedMs);

  const totalMs = parseHHMMSStringToMs(time);
  const remainingMs = totalMs - elapsedMs;

  useEffect(() => {
    if (startTime !== null && remainingMs <= 0) {
      handleStop();
    }
  }, [remainingMs, startTime]);

  return (
    <div>
      <div>{elapsedMs}</div>
      <input
        type="text"
        value={isFocused ? formattedRaw : formattedTimer}
        onKeyDown={handleTimeInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <div>
        <button onClick={handleAddTime(1)}>+1:00</button>
        <button onClick={handleAddTime(10)}>+10:00</button>
        <button onClick={handleAddTime(15)}>+15:00</button>
      </div>

      <div>
        <button onClick={handleStart}>start</button>
        <button onClick={handleStop}>stop</button>
        <button onClick={handleReset}>reset</button>
      </div>
    </div>
  );
}
