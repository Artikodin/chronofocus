import { useEffect, useRef } from 'react';

interface Props {
  size?: number;
  dotCount?: number;
  dotSize?: number;
  duration?: number;
  isResetting?: boolean;
  isPlaying?: boolean;
  onReset?: () => void;
}

interface AnimatedDot {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  opacity: number;
  progress: number;
  index: number;
  visible: boolean;
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
  duration = 0,
  isResetting = false,
  isPlaying = false,
  onReset,
}: Props) => {
  const isPlayingRef = useRef(isPlaying);
  const isResettingRef = useRef(isResetting);
  const animationState = useRef({
    startTime: 0,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<AnimatedDot[]>([]);
  const animationFrameRef = useRef<number>();
  const resetStartRef = useRef<number | null>(null);
  const resetStartTimeRef = useRef<number>(0);

  useEffect(() => {
    isPlayingRef.current = isPlaying;

    if (isPlaying) {
      animationState.current.startTime = performance.now();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isResetting) {
      isResettingRef.current = true;
      resetStartTimeRef.current = performance.now();
    }
  }, [isResetting]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size - dotSize - 50) / 2;

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
          opacity: 1,
          progress: 0,
          visible: true,
          index: i,
        };
      });
    }

    ctx.clearRect(0, 0, size, size);
    dotsRef.current.forEach((dot) => {
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

    const draw = (timestamp: number) => {
      if (!isPlayingRef.current) {
        animationFrameRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, size, size);

      const elapsed = timestamp - animationState.current.startTime;
      const durationMillis = duration * 1000;
      let completion = Math.min(100, (elapsed / durationMillis) * 100);
      console.log('completion', completion);

      if (isResettingRef.current) {
        // Store the completion where reset started
        if (resetStartRef.current === null) {
          resetStartRef.current = completion;
        }

        // Calculate reset progress (going from stored completion back to 0)
        const resetElapsed = timestamp - resetStartTimeRef.current;
        const resetDuration = 1000; // 1 second for reset animation
        const resetProgress = Math.min(1, resetElapsed / resetDuration);

        // Linear interpolation from stored completion to 0
        completion = resetStartRef.current * (1 - resetProgress);

        const resetDone = dotsRef.current.every((dot) => dot.progress === 0);
        // Reset is done
        if (resetDone) {
          isResettingRef.current = false;
          resetStartRef.current = null;
          onReset?.();
        }
      }

      const dotsToHide = Math.floor((completion / 100) * dotCount);

      dotsRef.current.forEach((dot) => {
        if (isResettingRef.current && !dot.visible) {
          if (dot.index >= dotsToHide) {
            // Update progress
            dot.progress = Math.max(0, dot.progress - 0.02);
            const easedProgress = easeOutCubic(dot.progress);

            // Calculate angle once
            const angle = Math.atan2(dot.originalY - centerY, dot.originalX - centerX);

            // Apply movement based on progress
            const distance =
              Math.hypot(dot.x - dot.originalX, dot.y - dot.originalY) * easedProgress;
            dot.x = dot.originalX + Math.cos(angle) * distance;
            dot.y = dot.originalY + Math.sin(angle) * distance;

            // Derive opacity from progress
            dot.opacity = 1 - easedProgress;
          }
        }

        if (dot.opacity > 0 && dot.index <= dotsToHide && !isResettingRef.current) {
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
          dot.visible = false;
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

    draw(performance.now());

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [duration]);

  return <canvas ref={canvasRef} width={size} height={size} className="relative" />;
};

export default CountDownCircle;
