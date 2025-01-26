import { useState, useEffect } from 'react';

import { formatRawInput, formatTimerRunning, parseHHMMSStringToMs } from './utils';

type Props = {
  time: string;
  setTime: React.Dispatch<React.SetStateAction<string>>;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
};

export function TimerInput({ time, setTime, onStart, onStop, onReset }: Props) {
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

  const buttonStyle =
    'relative px-4 pb-3 rounded-2xl border-white bg-white bg-opacity-5 backdrop-blur-md transition-all ease-in hover:scale-[101%] hover:bg-opacity-10 text-2xl text-white data-[disabled=true]:opacity-20 data-[disabled=true]:pointer-events-none ';

  const isDisabled = isRunning && !isPaused;

  return (
    <div className="relative z-10 flex flex-col items-center justify-center gap-8">
      <div className="group relative">
        <input
          type="text"
          value={isFocused ? formattedRaw : formattedTimer}
          onKeyDown={handleTimeInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={() => {}}
          className="relative z-10 h-28 w-96 bg-transparent pb-14 pt-4 text-center text-8xl text-white outline-none"
          disabled={isDisabled}
        />
        <div
          data-disabled={isDisabled}
          className="absolute bottom-0 left-0 z-0 h-full w-full rounded-2xl border-2 border-white bg-white bg-opacity-10 opacity-50 backdrop-blur-md transition-all ease-in group-hover:scale-[101%] data-[disabled=true]:opacity-0"
        ></div>
      </div>

      <div className="flex gap-4">
        <button
          className={buttonStyle}
          onClick={handleAddTime(1)}
          disabled={isDisabled}
          data-disabled={isDisabled}
        >
          +1:00
        </button>
        <button
          className={buttonStyle}
          onClick={handleAddTime(10)}
          disabled={isDisabled}
          data-disabled={isDisabled}
        >
          +10:00
        </button>
        <button
          className={buttonStyle}
          onClick={handleAddTime(15)}
          disabled={isDisabled}
          data-disabled={isDisabled}
        >
          +15:00
        </button>
      </div>

      {!isRunning ? (
        <button className={buttonStyle} onClick={handleStart}>
          start
        </button>
      ) : (
        <div className="flex gap-4">
          {isPaused ? (
            <button className={buttonStyle} onClick={handleStart}>
              start
            </button>
          ) : (
            <button className={buttonStyle} onClick={handleStop}>
              stop
            </button>
          )}
          <button className={buttonStyle} onClick={handleReset}>
            reset
          </button>
        </div>
      )}
    </div>
  );
}
