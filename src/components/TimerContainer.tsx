import { useEffect, useRef, useState } from 'react';
import { TimerAnimated } from './TimerAnimated';
import { CirclePlus } from 'lucide-react';

type Props = {
  time: {
    time: string;
    id: string;
  };
  setTimes: (index: string, time: string) => void;
  onNew: () => void;
  handleRemoveById: (id: string) => void;
  currentId: string;
  hasMultipleTimes: boolean;
  onMount: (id: string) => void;
  onComplete: (id: string) => void;
};

export const TimerContainer = ({
  hasMultipleTimes,
  time: _time,
  setTimes,
  onNew,
  handleRemoveById,
  currentId,
  onMount,
  onComplete,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState(_time.time);

  useEffect(() => {
    setTimes(_time.id, time);
  }, [time, setTimes, _time.id]);

  useEffect(() => {
    onMount(_time.id);
  }, []);

  return (
    <div
      className="flex h-screen w-screen snap-start flex-col items-center justify-between gap-8"
      ref={ref}
      id={_time.id}
    >
      <div className="h-14 w-full" />
      <TimerAnimated
        onComplete={onComplete}
        hasMultipleTimes={hasMultipleTimes}
        time={time}
        timer={_time}
        setTime={setTime}
        currentId={currentId}
        handleRemoveById={handleRemoveById}
      />
      <div className="flex h-14 w-full items-start justify-center">
        <button onClick={onNew}>
          <CirclePlus className="h-8 w-8 text-white" />
        </button>
      </div>
    </div>
  );
};
