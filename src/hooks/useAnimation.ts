import { useEffect, useRef } from 'react';

export const useAnimation = (
  draw: (ctx: CanvasRenderingContext2D) => void,
  update: (delta: number, ctx: CanvasRenderingContext2D) => void,
  reset: (delta: number, ctx: CanvasRenderingContext2D, cancelRAF: () => void) => void
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loop = useRef<FrameRequestCallback>();

  type Animation = {
    animationFrameRef: number | null;
    pauseAt: number;
    previousTimestamp: number;
    isRunning: boolean;
    isResetting: boolean;
  };

  const initialAnimation: Animation = {
    animationFrameRef: null,
    pauseAt: 0,
    previousTimestamp: 0,
    isRunning: false,
    isResetting: false,
  };

  const resetAnimation: Animation = { ...initialAnimation };

  const animation = useRef<Animation>(initialAnimation);

  useEffect(() => {
    animation.current.previousTimestamp = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    draw(ctx);

    const cancelRAF = () => {
      if (animation.current.animationFrameRef) {
        cancelAnimationFrame(animation.current.animationFrameRef);
        animation.current = { ...resetAnimation };
      }
    };

    loop.current = (timestamp: number) => {
      if (!loop.current) return;
      if (!animation.current.previousTimestamp) {
        animation.current.previousTimestamp = timestamp;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const deltaMs = timestamp - animation.current.previousTimestamp;
      const delta = deltaMs / 1000;

      if (animation.current.isResetting) {
        reset(delta, ctx, cancelRAF);
      } else {
        update(delta, ctx);
      }

      if (!animation.current.isRunning) return;
      animation.current.previousTimestamp = timestamp;
      animation.current.animationFrameRef = requestAnimationFrame(loop.current);
    };

    return () => {
      if (!animation.current.animationFrameRef) return;
      cancelAnimationFrame(animation.current.animationFrameRef);
    };
  }, []);

  const run = () => {
    if (!loop.current) return;
    animation.current.previousTimestamp += performance.now() - animation.current.pauseAt;
    requestAnimationFrame(loop.current);
    animation.current.isRunning = true;
  };

  const handleStart = () => {
    if (animation.current.isRunning) return;
    run();

    if (animation.current.isResetting) return;
    animation.current.isResetting = false;
  };

  const handleStop = () => {
    if (!animation.current.isRunning) return;
    if (!animation.current.animationFrameRef) return;
    cancelAnimationFrame(animation.current.animationFrameRef);
    animation.current.animationFrameRef = null;
    animation.current.pauseAt = performance.now();
    animation.current.isRunning = false;
  };

  const handleReset = () => {
    if (animation.current.isResetting) return;
    animation.current.isResetting = true;

    if (!animation.current.isRunning) {
      run();
    }
  };

  return {
    canvasRef,
    handleStart,
    handleStop,
    handleReset,
  };
};
