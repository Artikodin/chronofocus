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
