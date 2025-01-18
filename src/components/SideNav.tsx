import { useHashChange } from '../hooks/useHashchange';
import { Time } from '../App';
import { formatTimerRunning } from './Timer/utils';

type Props = {
  times: Time[];
};

const Item = ({ time }: { time: Time }) => {
  const { id } = useHashChange();

  // [TODO]: why this makes delete animation not work?
  const isActive = id === time.id;

  const formattedTime = formatTimerRunning(time.time, 0);

  return (
    <a href={`#${time.id}`} key={time.id} className="group flex items-center justify-end gap-4">
      <div className="text-sm text-white">{formattedTime}</div>
      <div
        data-active={isActive}
        className="mt-2 h-1 w-5 origin-right rounded-full bg-white transition-transform duration-75 ease-in group-hover:scale-x-125 data-[active=true]:scale-x-150 data-[active=true]:group-hover:scale-x-150"
      />
    </a>
  );
};

export const SideNav = ({ times }: Props) => {
  const hasMultipleTimes = times.length > 1;

  if (!hasMultipleTimes) return null;

  return (
    <div className="fixed right-6 top-1/2 flex -translate-y-1/2 flex-col gap-1">
      {times.map((time) => {
        return <Item key={time.id} time={time} />;
      })}
    </div>
  );
};
