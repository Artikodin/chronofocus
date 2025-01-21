import { useState, useEffect } from 'react';

import { formatRawInput, formatTimerRunning, parseHHMMSStringToMs } from './utils';

type Props = {
  time: string;
  setTime: React.Dispatch<React.SetStateAction<string>>;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  currentId: string;
};

export default function Timer({ time, setTime, onStart, onStop, onReset, currentId }: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [accumulatedTime, setAccumulatedTime] = useState<number>(0);
  const [renderTime, setRenderTime] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

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

      const cappedMinutes = Math.min(60, minutes);
      const _newMinutes = cappedMinutes + time;

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

  const pause = () => {
    if (!startTime) return;

    const currentElapsed = performance.now() - startTime;
    setAccumulatedTime((prev) => prev + currentElapsed);
    setStartTime(null);
  };

  const handleStart = () => {
    if (remainingMs <= 0) return;
    setStartTime(performance.now());
    setIsRunning(true);
    setIsPaused(false);
    onStart();
  };

  const handleStop = () => {
    pause();
    setIsPaused(true);
    onStop();
  };

  const handleReset = () => {
    setStartTime(null);
    setAccumulatedTime(0);
    setIsRunning(false);
    setIsPaused(false);
    onReset();
  };

  useEffect(() => {
    handleReset();
  }, [currentId]);

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

  const hoverStyle =
    " relative after:absolute after:bottom-0 after:left-0 after:z-0 after:h-[2px] after:w-full after:origin-right after:scale-x-50 after:rounded-full after:bg-white after:transition-transform after:duration-75 after:ease-in after:content-[''] hover:after:scale-x-100";

  const hoverInputStyle =
    "relative after:absolute after:-bottom-4 after:left-0 after:z-0 after:h-[4px] after:w-full after:origin-right after:scale-x-50 after:rounded-full after:bg-white after:transition-transform after:duration-75 after:ease-in after:content-[''] hover:after:scale-x-100";

  const isDisabled = isRunning && !isPaused;

  return (
    <div className="relative z-10 flex flex-col items-center justify-center gap-8">
      <div className={isDisabled ? undefined : hoverInputStyle}>
        <input
          type="text"
          value={isFocused ? formattedRaw : formattedTimer}
          onKeyDown={handleTimeInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={() => {}}
          className={`h-32 w-96 bg-transparent text-center text-8xl text-white outline-none`}
          disabled={isDisabled}
          data-disabled={isDisabled}
        />
      </div>
      <div className="flex gap-4">
        <button
          className={`h-14 w-16 text-2xl text-white transition-opacity data-[disabled=true]:opacity-20 ${hoverStyle}`}
          onClick={handleAddTime(1)}
          disabled={isDisabled}
          data-disabled={isDisabled}
        >
          +1:00
        </button>
        <button
          className={`h-14 w-16 text-2xl text-white transition-opacity data-[disabled=true]:opacity-20 ${hoverStyle}`}
          onClick={handleAddTime(10)}
          disabled={isDisabled}
          data-disabled={isDisabled}
        >
          +10:00
        </button>
        <button
          className={`h-14 w-16 text-2xl text-white transition-opacity data-[disabled=true]:opacity-20 ${hoverStyle}`}
          onClick={handleAddTime(15)}
          disabled={isDisabled}
          data-disabled={isDisabled}
        >
          +15:00
        </button>
      </div>

      {!isRunning ? (
        <button className={`h-14 w-16 text-2xl text-white ${hoverStyle}`} onClick={handleStart}>
          start
        </button>
      ) : (
        <div className="flex gap-4">
          {isPaused ? (
            <button className={`h-14 w-16 text-2xl text-white ${hoverStyle}`} onClick={handleStart}>
              start
            </button>
          ) : (
            <button className={`h-14 w-16 text-2xl text-white ${hoverStyle}`} onClick={handleStop}>
              stop
            </button>
          )}
          <button className={`h-14 w-16 text-2xl text-white ${hoverStyle}`} onClick={handleReset}>
            reset
          </button>
        </div>
      )}
    </div>
  );
}
