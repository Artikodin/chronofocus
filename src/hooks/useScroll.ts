import { useCallback } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

export const useScroll = ({ onEnd }: { onEnd?: () => void } = {}) => {
  const [isUsingScroll, setIsUsingScroll] = useState(false);

  useEffect(() => {
    if (!onEnd) return;
    if (isUsingScroll) return;

    const handleScrollEnd = () => {
      onEnd();
    };

    let scrollEndTimeout: number;
    const handleScroll = () => {
      clearTimeout(scrollEndTimeout);
      scrollEndTimeout = setTimeout(handleScrollEnd, 100);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isUsingScroll]);

  const scrollTo = useCallback((id: string | HTMLElement, callback?: () => void) => {
    const element = typeof id === 'string' ? document.getElementById(id) : id;
    if (!element) return;

    setIsUsingScroll(true);
    element.scrollIntoView({ behavior: 'smooth' });

    const handleScrollEnd = () => {
      window.removeEventListener('scroll', handleScroll);
      callback?.();
      setIsUsingScroll(false);
    };

    let scrollEndTimeout: number;
    const handleScroll = () => {
      clearTimeout(scrollEndTimeout);
      scrollEndTimeout = setTimeout(handleScrollEnd, 100);
    };

    window.addEventListener('scroll', handleScroll);
  }, []);

  return { scrollTo };
};
