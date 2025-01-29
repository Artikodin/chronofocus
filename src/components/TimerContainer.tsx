import { useEffect, useRef, useState } from 'react';

import { TimerAnimated } from './TimerAnimated';
import { Plus } from 'lucide-react';
import { Timer } from '../App';
import { Button } from './Button';

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
  handleAddTime,
  handleTimeInput,
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
      className="grid h-screen w-screen snap-start grid-rows-[1fr_min-content_1fr] place-content-center"
      ref={ref}
      id={timer.id}
    >
      <div />
      <TimerAnimated
        onComplete={onComplete}
        hasMultipleTimes={hasMultipleTimes}
        time={timer.time}
        timer={timer}
        setTime={setTime}
        handleRemoveById={handleRemoveById}
        onReset={onReset}
        handleAddTime={handleAddTime}
        handleTimeInput={handleTimeInput}
      />
      <div className="flex h-14 w-full items-start justify-center">
        <Button
          onClick={onNew}
          className="flex items-center justify-center gap-2 rounded-[9999px] px-2 pb-2 pt-2"
        >
          <Plus className="h-8 w-8 text-white" />
        </Button>
      </div>
    </div>
  );
};
