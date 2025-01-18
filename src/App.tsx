import { useCallback, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Background from './components/Background';
import { TimerContainer } from './components/TimerContainer';
import { SideNav } from './components/SideNav';
export type Time = {
  time: string;
  id: string;
};

const useHashState = (id: string) => {
  const [currentId, setCurrentId] = useState(id);

  useEffect(() => {
    setTimeout(() => {
      window.location.hash = currentId;
    }, 100);
  }, [currentId]);

  return { currentId, setCurrentId };
};

function App() {
  const id = uuidv4();
  const [times, setTimes] = useState<Array<Time>>([{ time: '001000', id }]);
  const { currentId, setCurrentId } = useHashState(id);

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
      const id = uuidv4();
      newTimes.push({ time: '000500', id });
      setCurrentId(id);
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

        const id = times[index].id;

        if (currentId !== id) {
          setCurrentId(id);
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
        setCurrentId(times[index - 1].id);
      } else {
        setCurrentId(times[index + 1].id);
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
            currentId={currentId}
          />
        );
      })}

      <SideNav times={times} currentId={currentId} />
      <Background />
    </>
  );
}

export default App;
