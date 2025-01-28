import { useContext, useEffect, useRef } from 'react';
import { Blob } from '../objects/Blob';
import { AnimationContext } from '../contexts/AnimationContext/context';
import { AnimationSubscriber } from '../contexts/AnimationContext/AnimationSubscriber';
import { useGetWindowSize } from '../hooks/useGetWindowSize';

const Background = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const context = useContext(AnimationContext);
  const { subscribe, unsubscribe } = context || {};

  const { width, height } = useGetWindowSize();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const blobs = [
      new Blob(ctx.canvas.width, 0, 0.5 * ctx.canvas.width),
      new Blob(0, ctx.canvas.height, 0.5 * ctx.canvas.width),
    ];

    const draw = () => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      blobs.forEach((blob) => {
        blob.draw(ctx);
      });
    };

    const update = (delta: number) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      blobs.forEach((blob) => {
        blob.update(delta);
        blob.draw(ctx);
      });
    };

    const subscriber = new AnimationSubscriber({
      id: 'background',
      draw,
      update,
      isRunning: true,
    });

    subscribe?.(subscriber);

    return () => {
      unsubscribe?.('background');
    };
  }, [width.dpi]);

  return (
    <canvas
      ref={canvasRef}
      width={width.dpi}
      height={height.dpi}
      className="fixed left-0 top-0 -z-10 brightness-50 w-full h-full"
    />
  );
};

export default Background;
