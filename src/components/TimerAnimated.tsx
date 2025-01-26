import { useContext, useEffect, useRef } from 'react';

import { Circle } from '../objects/Circle';
import { parseHHMMSStringToMs } from './Timer/utils';
import { TimerInput } from './Timer';
import { CircleX } from 'lucide-react';
import { AnimationSubscriber } from '../contexts/AnimationContext/AnimationSubscriber';
import { AnimationContext } from '../contexts/AnimationContext/context';
import { Timer } from '../App';
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
}: Props) => {
  const size = 800;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const context = useContext(AnimationContext);
  const { subscribe, unsubscribe, handleStart, handlePause, handleReset, handleComplete } =
    context || {};

  const durationMs = parseHHMMSStringToMs(time);
  const duration = durationMs / 1000;

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const radius = 350;
    const dotCount = 120;
    const centerX = size / 2;
    const centerY = size / 2;
    const circle = new Circle(dotCount, radius, centerX, centerY);

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
  }, [duration]);

  return (
    <>
      <div className="relative">
        {hasMultipleTimes && (
          <button
            onClick={() => handleRemoveById(timer.id)}
            className="absolute right-0 top-0 z-20 -translate-y-1/2 translate-x-1/2"
          >
            <CircleX className="h-8 w-8 text-white" />
          </button>
        )}
        <TimerInput
          time={time}
          setTime={setTime}
          onStart={() => handleStart?.(timer.id)}
          onStop={() => handlePause?.(timer.id)}
          onReset={() => handleReset?.(timer.id)}
        />
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </>
  );
};
