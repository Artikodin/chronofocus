import { createContext } from 'react';
import type { AnimationSubscriber } from './AnimationSubscriber';

export const AnimationContext = createContext<{
  subscribe: (sub: AnimationSubscriber) => void;
  unsubscribe: (id: string) => void;
  handleStart: (id: string) => void;
  handlePause: (id: string) => void;
  handleReset: (id: string) => void;
  handleComplete: (id: string) => void;
} | null>(null);
