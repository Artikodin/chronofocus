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
  onTimerComplete: (id: string) => void;
  onKeyDown: (id: string) => (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onAddTime: (id: string, time: number) => void;
  onStart: (id: string) => void;
  onPause: (id: string) => void;
  onReset: (id: string) => void;
  onSubmit?: (id: string) => void;
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
  onPause,
  onTimerComplete,
  onReset,
  onAnimationReset,
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

  const handlePauseTimer = (id: string) => {
    handlePause?.(id);
    onPause(id);
  };

  const handleResetTimer = (id: string) => {
    handleReset?.(id);
    onReset(id);
  };

  return (
    <div
      className="grid h-[100dvh] w-[100dvw] snap-start grid-rows-[1fr_min-content_1fr] place-content-center"
      ref={ref}
      id={timer.id}
    >
      <div />
      <div className="relative h-[500px] w-screen grid place-content-center sm:h-[min(750px,100dvh)] sm:w-[min(750px,100dvw)]">
        {hasMultipleTimes && (
          <Button
            onClick={() => handleRemoveById(timer.id)}
            icon
            className="absolute -top-10 right-10 z-10 sm:top-10"
          >
            <X className="h-8 w-8 text-white" />
          </Button>
        )}
        <TimerInput
          timer={timer}
          onTimerComplete={onTimerComplete}
          onStart={handleStartTimer}
          onPause={handlePauseTimer}
          onReset={handleResetTimer}
          onKeyDown={onKeyDown}
          onAddTime={onAddTime}
          onSubmit={handleStartTimer}
        />
        <CircleAnimated
          onAnimationComplete={onAnimationComplete}
          timer={timer}
          onAnimationReset={onAnimationReset}
        />
      </div>

      <div className="flex h-14 w-full items-start justify-center">
        <Button onClick={onNew} icon>
          <Plus className="h-8 w-8 text-white" />
        </Button>
      </div>
    </div>
  );
};
