import { useState, useEffect, useCallback } from 'react';

import { formatRawInput, formatTimerRunning, parseHHMMSStringToMs } from './utils';
import { Button } from '../Button';

type Props = {
  time: string;
  setTime: React.Dispatch<React.SetStateAction<string>>;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
};

export function TimerInput({
  time,
  setTime,
  onStart,
  onStop,
  onReset,
  timer,
  handleAddTime,
  handleTimeInput,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  
  const [startTime, setStartTime] = useState<number | null>(null);
  const [accumulatedTime, setAccumulatedTime] = useState<number>(0);
  
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const [render, setRender] = useState(0);
  useEffect(() => {
    let intervalId: number;

    console.log(render);

    if (startTime !== null) {
      intervalId = setInterval(() => {
        setRender((prev) => prev + 1);
      }, 500);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [startTime]);


  
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

  const isDisabled = isRunning && !isPaused;

  return (
    <div className="relative z-10 flex flex-col items-center justify-center gap-8">
      <div className="group relative">
        <input
          type="text"
          value={isFocused ? formattedRaw : formattedTimer}
          onKeyDown={handleTimeInput(timer.id)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={() => {}}
          className="relative z-10 h-28 w-96 bg-transparent pb-14 pt-4 text-center text-8xl text-white outline-none"
          disabled={isDisabled}
        />
        <div
          // background
          data-disabled={isDisabled}
          className="absolute bottom-0 left-0 z-0 h-full w-full rounded-2xl bg-white bg-opacity-5 shadow-inner shadow-[rgba(255,255,255,0.4)] backdrop-blur-sm transition-all ease-in group-hover:scale-[101%] group-hover:shadow-[rgba(255,255,255,0.5)] data-[disabled=true]:opacity-0"
        ></div>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={() => handleAddTime(timer.id, 1)}
          disabled={isDisabled}
          data-disabled={isDisabled}
          className="data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-20"
        >
          +1:00
        </Button>
        <Button
          onClick={() => handleAddTime(timer.id, 10)}
          disabled={isDisabled}
          data-disabled={isDisabled}
          className="data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-20"
        >
          +10:00
        </Button>
        <Button
          onClick={() => handleAddTime(timer.id, 15)}
          disabled={isDisabled}
          data-disabled={isDisabled}
          className="data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-20"
        >
          +15:00
        </Button>
      </div>

      {!isRunning ? (
        <Button onClick={handleStart}>start</Button>
      ) : (
        <div className="flex gap-4">
          {isPaused ? (
            <Button onClick={handleStart}>start</Button>
          ) : (
            <Button onClick={handleStop}>stop</Button>
          )}
          <Button onClick={handleReset}>reset</Button>
        </div>
      )}
    </div>
  );
}
