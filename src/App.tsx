import { useCallback, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Background from './components/Background';
import { TimerContainer } from './components/TimerContainer';
import { SideNav } from './components/SideNav';
export type Time = {
  time: string;
  id: string;
};

function App() {
  const [times, setTimes] = useState<Array<Time>>([{ time: '001000', id: uuidv4() }]);

  const handleSetTime = useCallback((id: string, time: string) => {
    setTimes((prevTimes) => {
      const newTimes = [...prevTimes];
      const index = newTimes.findIndex((time) => time.id === id);
      newTimes[index].time = time;
      return newTimes;
    });
  }, []);

  const handleNew = useCallback(() => {
    setTimes((prevTimes) => {
      const newTimes = [...prevTimes];
      newTimes.push({ time: '000500', id: uuidv4() });
      return newTimes;
    });
  }, []);

  useEffect(() => {
    let timeoutId: number;

    const handleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        const scrollPosition = window.scrollY;
        const viewportHeight = window.innerHeight;
        const index = Math.round(scrollPosition / viewportHeight);

        const shownId = window.location.hash.replace('#', '');
        const id = times[index].id;

        if (shownId !== id) {
          window.location.href = `#${id}`;
        }
      }, 50);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [times]);

  const handleRemoveById = useCallback(
    (id: string) => {
      if (times.length <= 1) return;

      const index = times.findIndex((time) => time.id === id);
      const length = times.length;

      if (index === length - 1) {
        window.location.href = `#${times[index - 1].id}`;
      } else {
        window.location.href = `#${times[index + 1].id}`;
      }

      setTimeout(() => {
        setTimes((prevTimes) => {
          if (prevTimes.length <= 1) return prevTimes;
          return prevTimes.filter((time) => time.id !== id);
        });
      }, 800);
    },
    [times]
  );

  return (
    <>
      {times.map((time) => {
        return (
          <TimerContainer
            key={time.id}
            time={time}
            setTimes={handleSetTime}
            onNew={handleNew}
            handleRemoveById={handleRemoveById}
          />
        );
      })}

      <SideNav times={times} />
      <Background />
    </>
  );
}

export default App;
