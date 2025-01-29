import { useState, useEffect } from 'react';

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
  handleResetTimer,
  handleStartTimer,
  handleStopTimer,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  
  
  const [render, setRender] = useState(0);
  useEffect(() => {
    let intervalId: number;

    console.log(render);

    if (timer.startTime !== null) {
      intervalId = setInterval(() => {
        setRender((prev) => prev + 1);
      }, 500);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [timer.startTime]);



  const elapsedMs = timer.startTime ? performance.now() - timer.startTime + timer.accumulatedTime : timer.accumulatedTime;

  const formattedRaw = formatRawInput(timer.time);
  const formattedTimer = formatTimerRunning(timer.time, elapsedMs);

  const totalMs = parseHHMMSStringToMs(timer.time);
  const remainingMs = totalMs - elapsedMs;

  useEffect(() => {
    if (timer.startTime !== null && remainingMs <= 0) {
      handleStopTimer();
    }
  }, [remainingMs, timer.startTime]);

  const isDisabled = timer.isRunning && !timer.isPaused;

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

      {!timer.isRunning ? (
        <Button onClick={() => handleStartTimer(timer.id)}>start</Button>
      ) : (
        <div className="flex gap-4">
          {timer.isPaused ? (
            <Button onClick={() => handleStartTimer(timer.id)}>start</Button>
          ) : (
            <Button onClick={() => handleStopTimer(timer.id)}>stop</Button>
          )}
          <Button onClick={() => handleResetTimer(timer.id)}>reset</Button>
        </div>
      )}
    </div>
  );
}
