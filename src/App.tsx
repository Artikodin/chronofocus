import { useCallback, useState } from 'react';
import Background from './components/Background';
import { TimerContainer } from './components/TimerContainer';

function App() {
  const [times, setTimes] = useState<string[]>(['000001', '001000', '001500', '002000']);

  const handleSetTime = (index: number) => (time: string) => {
    setTimes((prevTimes) => {
      const newTimes = [...prevTimes];
      newTimes[index] = time;
      return newTimes;
    });
  };

  return (
    <>
      {times.map((time, index) => {
        const _handleSetTime = useCallback(() => handleSetTime(index), [index]);

        return <TimerContainer key={time} time={time} setTimes={_handleSetTime} />;
      })}
      <Background />
    </>
  );
}

export default App;
