import { useEffect, useState, useRef } from 'react';
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
};

export const TimerContainer = ({
  hasMultipleTimes,
  time: _time,
  setTimes,
  onNew,
  handleRemoveById,
  currentId,
}: Props) => {
  const timerRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState(_time.time);

  useEffect(() => {
    setTimes(_time.id, time);
  }, [time, setTimes, _time.id]);

  return (
    <div
      className="flex h-screen w-screen snap-start flex-col items-center justify-between gap-8"
      ref={timerRef}
      id={_time.id}
    >
      <div className="h-14 w-full" />
      <TimerAnimated
        hasMultipleTimes={hasMultipleTimes}
        time={time}
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
