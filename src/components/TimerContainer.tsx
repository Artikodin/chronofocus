import { useEffect, useState } from 'react';
import { TimerAnimated } from './TimerAnimated';

type Props = {
  time: string;
  setTimes: React.Dispatch<React.SetStateAction<string>>;
};

export const TimerContainer = ({ time: _time, setTimes }: Props) => {
  const [time, setTime] = useState(_time);

  useEffect(() => {
    setTimes(time);
  }, [time, setTimes]);

  return (
    <div className="h-screen w-screen">
      <TimerAnimated time={time} setTime={setTime} />
    </div>
  );
};
