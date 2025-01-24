import { useRef } from 'react';
import { AnimationContext } from './context';
import { useAnimation } from '../../hooks/useAnimation';
import type { AnimationSubscriber } from './AnimationSubscriber';

type Props = {
  children: React.ReactNode;
};

export const AnimationProvider = ({ children }: Props) => {
  const subscribersRef = useRef(new Map<string, AnimationSubscriber>());

  const { handleStartAnimation, handleStopAnimation } = useAnimation(subscribersRef.current);

  const subscribe = (sub: AnimationSubscriber) => {
    subscribersRef.current.set(sub.id, sub);
  };

  const unsubscribe = (id: string) => {
    subscribersRef.current.delete(id);
  };

  const start = (id: string) => {
    const sub = subscribersRef.current.get(id);
    if (!sub) return;
    if (sub.isRunning) return;
    handleStartAnimation();

    sub.isRunning = true;
    sub.isResetting = false;
    sub.isStarted = true;
  };

  const pause = (id: string) => {
    const sub = subscribersRef.current.get(id);
    if (!sub) return;
    if (!sub.isRunning) return;
    sub.isRunning = false;

    handleStopAnimation();
  };

  const reset = (id: string) => {
    const sub = subscribersRef.current.get(id);
    if (!sub) return;
    if (!sub.isStarted) return;
    handleStartAnimation();

    sub.isResetting = true;
    sub.isRunning = true;
    sub.isStarted = false;
  };

  const onComplete = (id: string) => {
    const sub = subscribersRef.current.get(id);
    if (!sub) return;

    sub.isRunning = false;
    sub.isResetting = false;
    sub.isStarted = false;
    handleStopAnimation();
  };

  return (
    <AnimationContext.Provider value={{ subscribe, unsubscribe, start, pause, reset, onComplete }}>
      {children}
    </AnimationContext.Provider>
  );
};
