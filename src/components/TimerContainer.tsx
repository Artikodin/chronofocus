import { useEffect, useState, useRef } from 'react';
import { TimerAnimated } from './TimerAnimated';

type Props = {
  time: {
    time: string;
    id: string;
  };
  setTimes: (index: string, time: string) => void;
  onNew: () => void;
  handleRemoveById: (id: string) => void;
};

export const TimerContainer = ({
  time: _time,
  setTimes,
  onNew,
  handleRemoveById,
}: Props) => {
  const timerRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState(_time.time);

  useEffect(() => {
    setTimes(_time.id, time);
  }, [time, setTimes, _time.id]);

  useEffect(() => {
    window.location.href = `#${_time.id}`;
  }, [_time.id]);

  return (
    <div
      className="h-screen w-screen snap-start border-2 border-red-500"
      ref={timerRef}
      id={_time.id}
    >
      <TimerAnimated time={time} setTime={setTime} />
      <button onClick={onNew}>new</button>
      <button onClick={() => handleRemoveById(_time.id)}>remove</button>
    </div>
  );
};
