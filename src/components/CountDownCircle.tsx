import { useCallback, useEffect, useRef } from 'react';

interface Props {
  size?: number;
  dotCount?: number;
  radius?: number;
  duration?: number;
}

// Add easing function
const easeInCubic = (x: number): number => {
  return x * x * x;
};
// Add ease out function
const easeOutCubic = (x: number): number => {
  return 1 - Math.pow(1 - x, 3);
};

class Dot {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  opacity: number;
  progress: number;
  visible: boolean;
  size: number;
  index: number;

  constructor(x: number, y: number, index: number) {
    this.x = x;
    this.y = y;
    this.originalX = x;
    this.originalY = y;
    this.index = index;

    this.opacity = 1;
    this.size = 2;
    this.progress = 0;
    this.visible = true;
  }

  update(delta: number, options: { angle: number; distance: number; duration: number }) {
    const { angle, distance, duration } = options;
    if (this.progress >= 1) {
      this.visible = false;
      return;
    }

    this.progress = this.progress + delta / duration;
    this.progress = Math.min(1, this.progress);
    const eased = easeInCubic(this.progress);

    this.x = this.originalX + Math.cos(angle) * distance * eased;
    this.y = this.originalY + Math.sin(angle) * distance * eased;
    this.opacity = 1 - eased;
  }

  updateReset(delta: number, options: { angle: number; duration: number }) {
    const { angle, duration } = options;
    if (this.progress <= 0) {
      this.visible = true;
      return;
    }

    this.progress = this.progress - delta / duration;
    this.progress = Math.max(0, this.progress);
    const eased = easeInCubic(this.progress);

    const distance = Math.hypot(this.x - this.originalX, this.y - this.originalY);
    this.x = this.originalX + Math.cos(angle) * distance * eased;
    this.y = this.originalY + Math.sin(angle) * distance * eased;
    this.opacity = 1 - eased;
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Draw glow (always at original position)
    ctx.beginPath();
    ctx.arc(this.originalX, this.originalY, this.size * 3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, 0.2)`;
    ctx.fill();

    // Draw main dot (at animated position)
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.fill();
  }
}

class Circle {
  dots: Dot[];
  radius: number;
  progress: number;
  centerX: number;
  centerY: number;
  dotCount: number;
  resetRAF?: number;

  constructor(dotCount: number, radius: number, centerX: number, centerY: number) {
    this.dots = Array.from({ length: dotCount }, (_, i) => {
      const angle = (i / dotCount) * Math.PI * 2 - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      return new Dot(x, y, i);
    });
    this.dotCount = dotCount;
    this.centerX = centerX;
    this.centerY = centerY;
    this.radius = radius;
    this.progress = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.dots.forEach((dot) => {
      dot.draw(ctx);
    });
  }

  update(delta: number, options: { duration: number }) {
    const { duration } = options;

    this.progress = this.progress + delta / duration;
    this.progress = Math.min(1, this.progress);

    const dotToHide = Math.floor(this.progress * this.dotCount);

    this.dots.forEach((dot) => {
      const angle = Math.atan2(dot.originalY - this.centerY, dot.originalX - this.centerX);

      if (dotToHide >= dot.index) {
        dot.update(delta, { angle, distance: 40, duration: 1 });
      }
    });
  }

  updateReset(delta: number, options: { duration: number }) {
    const { duration } = options;

    this.progress = this.progress - delta / duration;
    this.progress = Math.max(0, this.progress);

    const dotToShow = Math.floor(this.progress * this.dotCount);

    this.dots.forEach((dot) => {
      const angle = Math.atan2(dot.originalY - this.centerY, dot.originalX - this.centerX);

      if (dotToShow <= dot.index) {
        dot.updateReset(delta, { angle, duration: 1 });
      }
    });
  }
}

const useAnimation = (
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

const CountDownCircle = ({ size = 400, radius = 150, dotCount = 60, duration = 10 }: Props) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const circleRef = useRef(new Circle(dotCount, radius, centerX, centerY));

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

  const { canvasRef, handleStart, handleStop, handleReset } = useAnimation(draw, update, reset);

  return (
    <>
      <canvas ref={canvasRef} width={size} height={size} className="relative" />
      <div className="bg-white/50">
        <button onClick={handleStart}>Start</button>
        <button onClick={handleStop}>Stop</button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </>
  );
};

export default CountDownCircle;
