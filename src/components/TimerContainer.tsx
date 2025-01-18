import { useEffect, useState, useRef } from 'react';
import { TimerAnimated } from './TimerAnimated';

type Props = {
  time: string;
  setTimes: (index: number, time: string) => void;
  index: number;
  onNew: () => void;
};

export const TimerContainer = ({ time: _time, setTimes, index, onNew }: Props) => {
  const timerRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState(_time);

  useEffect(() => {
    setTimes(index, time);
  }, [time, setTimes, index]);

  useEffect(() => {
    window.location.href = `#${index}`;
  }, [index]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.99,
    };

    const callback = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        const target = entries[0].target;
        const _index = target.id;
        console.log(_index);
        window.location.href = `#${_index}`;
      }
    };

    const observer = new IntersectionObserver(callback, options);

    if (!timerRef.current) return;
    observer.observe(timerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className="h-screen w-screen snap-start border-2 border-red-500"
      ref={timerRef}
      id={index.toString()}
    >
      <TimerAnimated time={time} setTime={setTime} />
      <button onClick={onNew}>new</button>
    </div>
  );
};
