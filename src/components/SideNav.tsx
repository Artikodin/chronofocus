import { useState, useEffect } from 'react';
import { Timer } from '../App';
import { formatTimerRunning } from './Timer/utils';

type Props = {
  timers: Timer[];
  onSelect: (id: string) => void;
};

type ItemProps = {
  timer: Timer;
  onSelect: (id: string) => void;
};

const Item = ({ timer, onSelect }: ItemProps) => {
  const [render, setRender] = useState(0);
  useEffect(() => {
    let intervalId: number;

    console.log(render);

    if (timer.startTime !== 0) {
      intervalId = setInterval(() => {
        setRender((prev) => prev + 1);
      }, 500);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [timer.startTime]);

  const isActive = timer.isVisible;

  const elapsedMs = timer.startTime
    ? performance.now() - timer.startTime + timer.accumulatedTime
    : timer.accumulatedTime;
  const formattedTime = formatTimerRunning(timer.time, elapsedMs);

  return (
    <a
      key={timer.id}
      className="group flex cursor-pointer items-center justify-end gap-4"
      onClick={() => onSelect(timer.id)}
    >
      <div className="text-sm text-white">{formattedTime}</div>
      <div
        data-active={isActive}
        className="mt-2 h-1 w-5 origin-right rounded-full bg-white transition-transform duration-75 ease-in group-hover:scale-x-125 data-[active=true]:scale-x-150 data-[active=true]:group-hover:scale-x-150"
      />
    </a>
  );
};

export const SideNav = ({ timers, onSelect }: Props) => {
  const hasMultipleTimes = timers.length > 1;

  if (!hasMultipleTimes) return null;

  return (
    <div className="fixed right-6 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-1">
      {timers.map((timer) => {
        return <Item key={timer.id} timer={timer} onSelect={onSelect} />;
      })}
    </div>
  );
};
