import { useContext, useEffect, useRef } from 'react';

import { Circle } from '../objects/Circle';
import { parseHHMMSStringToMs } from './Timer/utils';
import { AnimationSubscriber } from '../contexts/AnimationContext/AnimationSubscriber';
import { AnimationContext } from '../contexts/AnimationContext/context';
import { Timer } from '../App';
import { useGetWindowSize } from '../hooks/useGetWindowSize';

type Props = {
  timer: Timer;
  onAnimationComplete: (id: string) => void;
  onAnimationReset?: (id: string) => void;
};

export const CircleAnimated = ({ timer, onAnimationComplete, onAnimationReset }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const context = useContext(AnimationContext);
  const { subscribe, unsubscribe, handleComplete } = context || {};

  const durationMs = parseHHMMSStringToMs(timer.time);
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
        onAnimationComplete?.(timer.id);
      }
    };

    const reset = (delta: number) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      circle.updateReset(delta, { duration: 2 });
      circle.draw(ctx);

      const hasCircleReset = circle.dots.every((dot) => dot.progress <= 0.7);
      if (hasCircleReset) {
        handleComplete?.(timer.id);
        onAnimationReset?.(timer.id);
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
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="absolute left-1/2 top-1/2 z-0 aspect-square w-full -translate-x-1/2 -translate-y-1/2"
    />
  );
};
