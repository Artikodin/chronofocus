import { useEffect, useRef } from 'react';
import type { AnimationSubscriber } from '../contexts/AnimationContext/AnimationSubscriber';

export const hasSomeRunning = (subscribers: Map<string, AnimationSubscriber>) => {
  for (const sub of subscribers.values()) {
    if (sub.isRunning) {
      return true;
    }
  }
  return false;
};

export const useAnimation = (subscribers: Map<string, AnimationSubscriber>) => {
  const loop = useRef<FrameRequestCallback>();
  const animation = useRef<number>();
  const previousTimestamp = useRef(0);
  const isRunning = useRef(false);

  useEffect(() => {
    subscribers.forEach((subscriber) => {
      subscriber.draw();
    });

    return () => {
      if (subscribers.size === 0) {
        _reset();
      }
    };
  }, [subscribers.size]);

  useEffect(() => {
    loop.current = (timestamp: number) => {
      if (!loop.current) return;

      const isSomeRunning = hasSomeRunning(subscribers);
      if (!isSomeRunning) return;

      const deltaMs = timestamp - previousTimestamp.current;
      const delta = deltaMs / 1000;

      subscribers.forEach((subscriber) => {
        if (!subscriber.isRunning) return;

        if (subscriber.isResetting) {
          subscriber.reset(delta);
        } else {
          subscriber.update(delta);
        }
      });

      previousTimestamp.current = timestamp;
      animation.current = requestAnimationFrame(loop.current);
    };

    if (subscribers.size === 0) {
      if (!animation.current) return;
      cancelAnimationFrame(animation.current);
    }

    if (subscribers.size > 0) {
      const isSomeRunning = hasSomeRunning(subscribers);
      if (!isSomeRunning) return;

      if (!loop.current) return;
      requestAnimationFrame(loop.current);
    }

    return () => {
      _reset();
    };
  }, []);

  const _reset = () => {
    if (!animation.current) return;
    isRunning.current = false;
    previousTimestamp.current = 0;

    cancelAnimationFrame(animation.current);
  };

  const handleStartAnimation = () => {
    if (!loop.current) return;
    if (isRunning.current) return;
    isRunning.current = true;

    previousTimestamp.current = performance.now();
    requestAnimationFrame(loop.current);
  };

  const handleStopAnimation = () => {
    if (!isRunning.current) return;

    _reset();
  };

  return { handleStartAnimation, handleStopAnimation };
};
