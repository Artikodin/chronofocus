import { useContext, useEffect, useRef } from 'react';

import { Circle } from '../objects/Circle';
import { parseHHMMSStringToMs } from './Timer/utils';
import { TimerInput } from './Timer';
import { X } from 'lucide-react';
import { AnimationSubscriber } from '../contexts/AnimationContext/AnimationSubscriber';
import { AnimationContext } from '../contexts/AnimationContext/context';
import { Timer } from '../App';
import { Button } from './Button';
import { useGetWindowSize } from '../hooks/useGetWindowSize';
type Props = {
  time: string;
  setTime: React.Dispatch<React.SetStateAction<string>>;
  handleRemoveById: (id: string) => void;
  hasMultipleTimes: boolean;
  timer: Timer;
  onComplete: (id: string) => void;
  onReset: (id: string) => void;
};

export const TimerAnimated = ({
  time,
  setTime,
  handleRemoveById,
  hasMultipleTimes,
  timer,
  onComplete,
  onReset,
  handleAddTime,
  handleTimeInput,
  handleResetTimer,
  handleStartTimer,
  handleStopTimer,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const context = useContext(AnimationContext);
  const { subscribe, unsubscribe, handleStart, handlePause, handleReset, handleComplete } =
    context || {};

  const durationMs = parseHHMMSStringToMs(time);
  const duration = durationMs / 1000;

  const { width, dpi } = useGetWindowSize();

  const MAX_SIZE = 750 * dpi.current;
  const size = Math.min(MAX_SIZE, width.dpi);

  const radius = 0.4 * size;
  const dotCount = Math.floor(0.07 * size);
  const centerX = size / 2;
  const centerY = size / 2;
  const circle = new Circle(dotCount, radius, centerX, centerY);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    circle.draw(ctx);
  }, [width.native]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      circle.draw(ctx);
    };

    const update = (delta: number) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      circle.update(delta, { duration });
      circle.draw(ctx);

      const hasCircleComplete = circle.dots.every((dot) => dot.progress === 1);
      if (hasCircleComplete) {
        handleComplete?.(timer.id);
        onComplete?.(timer.id);
      }
    };

    const reset = (delta: number) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      circle.updateReset(delta, { duration: 2 });
      circle.draw(ctx);

      const hasCircleReset = circle.dots.every((dot) => dot.progress === 0);
      if (hasCircleReset) {
        handleComplete?.(timer.id);
        onReset(timer.id);
      }
    };

    const subscriber = new AnimationSubscriber({
      id: timer.id,
      draw,
      update,
      reset,
    });

    subscribe?.(subscriber);

    return () => {
      unsubscribe?.(timer.id);
    };
  }, [duration, width.native]);

  return (
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
        handleAddTime={handleAddTime}
        handleTimeInput={handleTimeInput}
        timer={timer}
        time={time}
        setTime={setTime}
        onStart={() => handleStart?.(timer.id)}
        onStop={() => handlePause?.(timer.id)}
        onReset={() => handleReset?.(timer.id)}
        handleResetTimer={handleResetTimer}
        handleStartTimer={handleStartTimer}
        handleStopTimer={handleStopTimer}
      />
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="absolute left-1/2 top-1/2 z-0 aspect-square w-full -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
};
