import { useContext, useEffect, useRef, useState } from 'react';

import { AnimationProvider } from '../contexts/AnimationContext';
import { AnimationContext } from '../contexts/AnimationContext/context';
import { Circle } from '../objects/Circle';
import { AnimationSubscriber } from '../contexts/AnimationContext/AnimationSubscriber';

const AnimationChild = ({ id }: { id: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const context = useContext(AnimationContext);
  const { subscribe, unsubscribe, handleStart, handlePause, handleReset, handleComplete } =
    context || {};

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const circle = new Circle(60, 200, 500, 500);

    const draw = () => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      circle.draw(ctx);
    };

    const update = (delta: number) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      circle.update(delta, { duration: 60 });
      circle.draw(ctx);
    };

    const reset = (delta: number) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      circle.updateReset(delta, { duration: 2 });
      circle.draw(ctx);

      const hasCircleReset = circle.dots.every((dot) => dot.progress === 0);
      if (hasCircleReset) {
        handleComplete?.(id);
      }
    };

    const subscriber = new AnimationSubscriber({
      id,
      draw,
      update,
      reset
    });

    subscribe?.(subscriber);

    return () => {
      unsubscribe?.(id);
    };
  }, []);

  return (
    <div className="relative border border-red-500">
      <canvas style={{ background: 'black' }} height={1000} width={1000} ref={canvasRef} />
      <div className="absolute left-0 top-0">
        <button
          className="rounded-md bg-blue-500 px-4 py-2 text-white"
          onClick={() => handleStart?.(id)}
        >
          Start
        </button>
        <button
          className="rounded-md bg-blue-500 px-4 py-2 text-white"
          onClick={() => handlePause?.(id)}
        >
          Pause
        </button>
        <button
          className="rounded-md bg-blue-500 px-4 py-2 text-white"
          onClick={() => handleReset?.(id)}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

const AnimationTest = () => {
  const [show, setShow] = useState(true);
  const [count, setCount] = useState(0);

  const array = Array.from({ length: count }, (_, i) => i);

  return (
    <AnimationProvider>
      {show && <AnimationChild id="test" />}

      {array.map((item) => (
        <AnimationChild key={item} id={`test-${item}`} />
      ))}
      <div className="absolute left-0 top-[100px]">
        <button
          className="rounded-md bg-red-500 px-4 py-2 text-white"
          onClick={() => setShow((prev) => !prev)}
        >
          toggle
        </button>
        <button
          className="rounded-md bg-red-500 px-4 py-2 text-white"
          onClick={() => setCount((prev) => prev + 1)}
        >
          count
        </button>
        <button
          className="rounded-md bg-red-500 px-4 py-2 text-white"
          onClick={() => setCount((prev) => prev - 1)}
        >
          decount
        </button>
      </div>
    </AnimationProvider>
  );
};

export default AnimationTest;
