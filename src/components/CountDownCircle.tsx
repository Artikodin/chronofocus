import { useEffect, useRef } from 'react';

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

const CountDownCircle = ({ size = 400, radius = 150, dotCount = 60, duration = 3 }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const previousTimestampRef = useRef<number>(0);
  const resetRef = useRef<boolean>(false);

  useEffect(() => {
    const interval = setTimeout(
      () => {
        resetRef.current = true;
      },
      (duration + 1) * 1000
    );

    return () => clearInterval(interval);
  }, [duration]);

  useEffect(() => {
    previousTimestampRef.current = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = size / 2;
    const centerY = size / 2;
    const circle = new Circle(dotCount, radius, centerX, centerY);

    circle.draw(ctx);

    const update = (timestamp: number) => {
      if (!previousTimestampRef.current) {
        previousTimestampRef.current = timestamp;
      }

      ctx.clearRect(0, 0, size, size);

      const deltaMs = timestamp - previousTimestampRef.current;
      const delta = deltaMs / 1000;

      if (!resetRef.current) {
        circle.update(delta, { duration });
      } else {
        circle.updateReset(delta, { duration: 2 });
      }

      circle.draw(ctx);

      previousTimestampRef.current = timestamp;

      animationFrameRef.current = requestAnimationFrame(update);
    };

    update(performance.now());

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [duration]);

  return <canvas ref={canvasRef} width={size} height={size} className="relative" />;
};

export default CountDownCircle;
