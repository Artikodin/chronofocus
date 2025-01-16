import { useCallback, useRef } from 'react';
import { useAnimation } from '../hooks/useAnimation';
import { Circle } from '../objects/Circle';
import { parseHHMMSStringToMs } from './Timer/utils';
import Timer from './Timer';

type Props = {
  size?: number;
  dotCount?: number;
  radius?: number;
  duration?: number;
  time: string;
  setTime: React.Dispatch<React.SetStateAction<string>>;
};

export const TimerAnimated = ({
  size = 400,
  radius = 150,
  dotCount = 60,
  time,
  setTime,
}: Props) => {
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
      <canvas ref={canvasRef} width={size} height={size} className="relative" />
      <div className="bg-white/50">
        <Timer
          time={time}
          setTime={setTime}
          onStart={handleStart}
          onStop={handleStop}
          onReset={handleReset}
        />
      </div>
    </>
  );
};
