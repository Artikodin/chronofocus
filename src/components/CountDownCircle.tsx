import { useEffect, useRef } from 'react';

interface Props {
  size?: number;
  dotCount?: number;
  dotSize?: number;
  completion?: number;
  isResetting?: boolean;
  onReset?: () => void;
}

interface AnimatedDot {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  velocity: { x: number; y: number };
  opacity: number;
  progress: number;
  index: number;
}

// Add easing function
const easeInCubic = (x: number): number => {
  return x * x * x;
};
// Add ease out function
const easeOutCubic = (x: number): number => {
  return 1 - Math.pow(1 - x, 3);
};

const CountDownCircle = ({
  size = 400,
  dotCount = 60,
  dotSize = 2,
  completion = 0,
  isResetting = false,
  onReset,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<AnimatedDot[]>([]);
  const animationFrameRef = useRef<number>();
  const resetStartTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size - dotSize * 30) / 2;

    // Initialize dots if not already done
    if (dotsRef.current.length === 0) {
      dotsRef.current = Array.from({ length: dotCount }, (_, i) => {
        // Start from top (subtract PI/2 from angle to rotate 90 degrees counterclockwise)
        const angle = (i / dotCount) * Math.PI * 2 - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        return {
          x,
          y,
          originalX: x,
          originalY: y,
          velocity: { x: 0, y: 0 },
          opacity: 1,
          progress: 0,
          index: i,
        };
      });
    }

    const normalizedCompletion = Math.min(100, Math.max(0, completion));
    const dotsToHide = Math.floor((normalizedCompletion / 100) * dotCount);
    let resetProgress = normalizedCompletion / 100;
    let dotsToShow = 0;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);

      if (isResetting) {
        resetProgress = Math.min(1, resetProgress + 0.02);
        const resetCompletion = easeOutCubic(resetProgress) * 100;
        dotsToShow = Math.floor(dotCount - (resetCompletion / 100) * dotCount);
        if (resetCompletion === 100) {
          setTimeout(() => {
            onReset?.();
            resetProgress = 0;
            dotsToShow = 0;
          }, 1000);
        }
      }

      dotsRef.current.forEach((dot) => {
        if (isResetting && (dot.x !== dot.originalX || dot.y !== dot.originalY)) {
          if (dot.index >= dotsToShow) {
            // Update progress
            dot.progress = Math.max(0, dot.progress - 0.02);
            const easedProgress = easeOutCubic(dot.progress);

            // Calculate angle once
            const angle = Math.atan2(dot.originalY - centerY, dot.originalX - centerX);

            // Apply movement based on progress
            const distance = Math.hypot(
                dot.x - dot.originalX,
                dot.y - dot.originalY
            ) * easedProgress;
            dot.x = dot.originalX + Math.cos(angle) * distance;
            dot.y = dot.originalY + Math.sin(angle) * distance;

            // Derive opacity from progress
            dot.opacity = 1 - easedProgress;
          }
        }

        if (dot.index < dotsToHide && dot.progress < 1 && !isResetting) {
          // Update progress
          dot.progress = Math.min(1, dot.progress + 0.02);
          const easedProgress = easeInCubic(dot.progress);

          // Calculate angle once
          const angle = Math.atan2(dot.originalY - centerY, dot.originalX - centerX);

          // Apply movement based on progress
          const distance = 50 * easedProgress;
          dot.x = dot.originalX + Math.cos(angle) * distance;
          dot.y = dot.originalY + Math.sin(angle) * distance;

          // Derive opacity from progress
          dot.opacity = 1 - easedProgress;
        }

        // Draw glow (always at original position)
        ctx.beginPath();
        ctx.arc(dot.originalX, dot.originalY, dotSize * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, 0.2)`;
        ctx.fill();

        // Draw main dot (at animated position)
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${dot.opacity})`;
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [size, dotCount, dotSize, completion, isResetting]);

  useEffect(() => {
    if (isResetting) {
      resetStartTimeRef.current = performance.now();
    }
  }, [isResetting]);

  return <canvas ref={canvasRef} width={size} height={size} className="relative" />;
};

export default CountDownCircle;
