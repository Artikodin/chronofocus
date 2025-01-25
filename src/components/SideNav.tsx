import { Time } from '../App';
import { formatTimerRunning } from './Timer/utils';

type Props = {
  times: Time[];
  currentId: string;
  onSelect: (id: string) => void;
};

const Item = ({
  time,
  currentId,
  onSelect,
}: {
  time: Time;
  currentId: string;
  onSelect: (id: string) => void;
}) => {
  const isActive = currentId === time.id;

  const formattedTime = formatTimerRunning(time.time, 0);

  return (
    <a
      key={time.id}
      className="group flex items-center justify-end gap-4"
      onClick={() => onSelect(time.id)}
    >
      <div className="text-sm text-white">{formattedTime}</div>
      <div
        data-active={isActive}
        className="mt-2 h-1 w-5 origin-right rounded-full bg-white transition-transform duration-75 ease-in group-hover:scale-x-125 data-[active=true]:scale-x-150 data-[active=true]:group-hover:scale-x-150"
      />
    </a>
  );
};

export const SideNav = ({ times, currentId, onSelect }: Props) => {
  const hasMultipleTimes = times.length > 1;

  if (!hasMultipleTimes) return null;

  return (
    <div className="fixed right-6 top-1/2 flex -translate-y-1/2 flex-col gap-1">
      {times.map((time) => {
        return (
          <Item
            key={time.id}
            time={time}
            currentId={currentId}
            onSelect={onSelect}
          />
        );
      })}
    </div>
  );
};
