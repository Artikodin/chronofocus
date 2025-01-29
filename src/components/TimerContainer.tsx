import { useContext, useEffect, useRef } from 'react';
import { Plus, X } from 'lucide-react';

import { CircleAnimated } from './CircleAnimated';
import { Timer } from '../App';
import { Button } from './Button';
import { AnimationContext } from '../contexts/AnimationContext/context';
import { TimerInput } from './Timer';

type Props = {
  timer: Timer;
  onNew: () => void;
  handleRemoveById: (id: string) => void;
  hasMultipleTimes: boolean;
  onMount: (id: string) => void;
  onAnimationComplete: (id: string) => void;
  onAnimationReset?: (id: string) => void;

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
  onAnimationComplete,
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

  const context = useContext(AnimationContext);
  const { handleStart, handlePause, handleReset } = context || {};

  const handleStartTimer = (id: string) => {
    handleStart?.(id);
    onStart(id);
  };

  const handleStopTimer = (id: string) => {
    handlePause?.(id);
    onStop(id);
  };

  const handleResetTimer = (id: string) => {
    handleReset?.(id);
    onReset(id);
  };

  return (
    <div
      className="grid h-screen w-screen snap-start grid-rows-[1fr_min-content_1fr] place-content-center"
      ref={ref}
      id={timer.id}
    >
      <div />
      <div className="relative h-[min(750px,100vh)] w-[min(750px,100vw)] place-content-center">
        {hasMultipleTimes && (
          <Button
            onClick={() => handleRemoveById(timer.id)}
            className="absolute right-10 top-10 z-10 flex items-center justify-center gap-2 rounded-[9999px] px-2 pb-2 pt-2"
          >
            <X className="h-8 w-8 text-white" />
          </Button>
        )}
        <TimerInput
          timer={timer}
          onStart={handleStartTimer}
          onStop={handleStopTimer}
          onReset={handleResetTimer}
          onKeyDown={onKeyDown}
          onAddTime={onAddTime}
        />
        <CircleAnimated onAnimationComplete={onAnimationComplete} timer={timer} />
      </div>

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
