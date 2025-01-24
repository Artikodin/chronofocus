import { createContext } from 'react';
import type { AnimationSubscriber } from './AnimationSubscriber';

export const AnimationContext = createContext<{
  subscribe: (sub: AnimationSubscriber) => void;
  unsubscribe: (id: string) => void;
  start: (id: string) => void;
  pause: (id: string) => void;
  reset: (id: string) => void;
  onComplete: (id: string) => void;
} | null>(null);
