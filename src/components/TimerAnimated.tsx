import { useCallback, useRef } from 'react';
import { useAnimation } from '../hooks/useAnimation';
import { Circle } from '../objects/Circle';
import { parseHHMMSStringToMs } from './Timer/utils';
import Timer from './Timer';
import { CircleX } from 'lucide-react';

type Props = {
  time: string;
  setTime: React.Dispatch<React.SetStateAction<string>>;
  currentId: string;
  handleRemoveById: (id: string) => void;
  hasMultipleTimes: boolean;
};

export const TimerAnimated = ({
  time,
  setTime,
  currentId,
  handleRemoveById,
  hasMultipleTimes,
}: Props) => {
  const size = 800;
  const radius = 350;
  const dotCount = 120;

  const centerX = size / 2;
  const centerY = size / 2;
  const circleRef = useRef(new Circle(dotCount, radius, centerX, centerY));

  const durationMs = parseHHMMSStringToMs(time);
  const duration = durationMs / 1000;

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    circleRef.current.draw(ctx);
  }, []);

  const update = useCallback(
    (delta: number, ctx: CanvasRenderingContext2D) => {
      circleRef.current.update(delta, { duration });

      circleRef.current.draw(ctx);
    },
    [duration]
  );

  const reset = useCallback(
    (delta: number, ctx: CanvasRenderingContext2D, cancelRAF: () => void) => {
      circleRef.current.updateReset(delta, { duration: 2 });

      circleRef.current.draw(ctx);

      if (circleRef.current.dots.every((dot) => dot.visible)) {
        cancelRAF();
      }
    },
    []
  );

  const { canvasRef, handleStart, handleStop, handleReset } = useAnimation(
    draw,
    update,
    reset,
    duration
  );

  return (
    <>
      <div className="relative">
        {hasMultipleTimes && (
        <button
          onClick={() => handleRemoveById(currentId)}
          className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 z-20"
        >
          <CircleX className="h-8 w-8 text-white" />
          </button>
        )}
        <Timer
          time={time}
          setTime={setTime}
          onStart={handleStart}
          onStop={handleStop}
          onReset={handleReset}
          currentId={currentId}
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
