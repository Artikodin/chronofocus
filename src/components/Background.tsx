import { useContext, useEffect, useRef } from 'react';
import { Blob } from '../objects/Blob';
import { AnimationContext } from '../contexts/AnimationContext/context';
import { AnimationSubscriber } from '../contexts/AnimationContext/AnimationSubscriber';

const Background = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const context = useContext(AnimationContext);
  const { subscribe, unsubscribe } = context || {};

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const blobs = [new Blob(window.innerWidth, 0, 450), new Blob(0, window.innerHeight, 400)];

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
      isRunning: true
    });
    
    subscribe?.(subscriber);

    return () => {
      unsubscribe?.('background');
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      className="fixed left-0 top-0 -z-10 brightness-50"
    />
  );
};

export default Background;
