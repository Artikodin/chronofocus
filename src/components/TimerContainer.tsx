import { useEffect, useRef, useState } from 'react';

import { TimerAnimated } from './TimerAnimated';
import { CirclePlus } from 'lucide-react';
import { Timer } from '../App';

type Props = {
  timer: Timer;
  setTimes: (index: string, time: string) => void;
  onNew: () => void;
  handleRemoveById: (id: string) => void;
  hasMultipleTimes: boolean;
  onMount: (id: string) => void;
  onComplete: (id: string) => void;
  onReset: (id: string) => void;
};

export const TimerContainer = ({
  hasMultipleTimes,
  timer,
  setTimes,
  onNew,
  handleRemoveById,
  onMount,
  onComplete,
  onReset,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState(timer.time);

  useEffect(() => {
    setTimes(timer.id, time);
  }, [time, setTimes, timer.id]);

  useEffect(() => {
    onMount(timer.id);
  }, []);

  return (
    <div
      className="flex h-screen w-screen snap-start flex-col items-center justify-between gap-8"
      ref={ref}
      id={timer.id}
    >
      <div className="h-14 w-full" />
      <TimerAnimated
        onComplete={onComplete}
        hasMultipleTimes={hasMultipleTimes}
        time={time}
        timer={timer}
        setTime={setTime}
        handleRemoveById={handleRemoveById}
        onReset={onReset}
      />
      <div className="flex h-14 w-full items-start justify-center">
        <button onClick={onNew}>
          <CirclePlus className="h-8 w-8 text-white" />
        </button>
      </div>
    </div>
  );
};
