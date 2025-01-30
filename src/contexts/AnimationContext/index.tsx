import { useRef, useState } from 'react';
import { AnimationContext } from './context';
import { useAnimation, hasSomeRunning } from '../../hooks/useAnimation';
import type { AnimationSubscriber } from './AnimationSubscriber';

type Props = {
  children: React.ReactNode;
};

export const AnimationProvider = ({ children }: Props) => {
  const [version, setVersion] = useState(0);
  const subscribersRef = useRef(new Map<string, AnimationSubscriber>());

  const { handleStartAnimation, handleStopAnimation } = useAnimation(subscribersRef.current);

  const subscribe = (sub: AnimationSubscriber) => {
    // console.log(version);

    subscribersRef.current.set(sub.id, sub);
    setVersion((prev) => prev + 1);
  };

  const unsubscribe = (id: string) => {
    subscribersRef.current.delete(id);
    setVersion((prev) => prev + 1);
  };

  const handleStart = (id: string) => {
    const sub = subscribersRef.current.get(id);
    if (!sub) return;
    if (sub.isRunning) return;

    sub.isRunning = true;
    sub.isResetting = false;
    sub.isStarted = true;

    const isSomeRunning = hasSomeRunning(subscribersRef.current);
    if (isSomeRunning) {
      handleStartAnimation();
    }
  };

  const handlePause = (id: string) => {
    const sub = subscribersRef.current.get(id);
    if (!sub) return;
    if (!sub.isRunning) return;
    sub.isRunning = false;

    const isSomeRunning = hasSomeRunning(subscribersRef.current);
    if (!isSomeRunning) {
      handleStopAnimation();
    }
  };

  const handleReset = (id: string) => {
    const sub = subscribersRef.current.get(id);
    if (!sub) return;
    if (!sub.isStarted) return;

    sub.isResetting = true;
    sub.isRunning = true;
    sub.isStarted = false;

    const isSomeRunning = hasSomeRunning(subscribersRef.current);
    if (isSomeRunning) {
      handleStartAnimation();
    }
  };

  const handleComplete = (id: string) => {
    const sub = subscribersRef.current.get(id);
    if (!sub) return;

    sub.isRunning = false;
    sub.isResetting = false;

    const isSomeRunning = hasSomeRunning(subscribersRef.current);
    if (!isSomeRunning) {
      handleStopAnimation();
    }
  };

  return (
    <AnimationContext.Provider
      value={{ subscribe, unsubscribe, handleStart, handlePause, handleReset, handleComplete }}
    >
      {children}
    </AnimationContext.Provider>
  );
};
