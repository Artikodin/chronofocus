import { useEffect, useRef, useState } from 'react';

import { TimerAnimated } from './TimerAnimated';
import { Plus } from 'lucide-react';
import { Timer } from '../App';
import { Button } from './Button';

type Props = {
  timer: Timer;
  onNew: () => void;
  handleRemoveById: (id: string) => void;
  hasMultipleTimes: boolean;
  onMount: (id: string) => void;
  onComplete: (id: string) => void;
  onResetAnimation: (id: string) => void;


  onKeyDown: (id: string) => (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onAddTime: (id: string, time: number) => void;
  onStart: (id: string) => void;
  onStop: (id: string) => void;
  onReset: (id: string) => void;
};

export const TimerContainer = ({
  hasMultipleTimes,
  timer,
  onNew,
  handleRemoveById,
  onMount,
  onComplete,
  onResetAnimation,
  onKeyDown,
  onAddTime,
  onStart,
  onStop,
  onReset,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);

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
        timer={timer}
        handleRemoveById={handleRemoveById}
        onResetAnimation={onResetAnimation}
        
        onKeyDown={onKeyDown}
        onAddTime={onAddTime}
        onStart={onStart}
        onStop={onStop}
        onReset={onReset}
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
