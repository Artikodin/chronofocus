import { useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Background from './components/Background';
import { TimerContainer } from './components/TimerContainer';
import { SideNav } from './components/SideNav';
import { useScroll } from './hooks/useScroll';

export type Time = {
  time: string;
  id: string;
};

function App() {
  const id = uuidv4();
  const [times, setTimes] = useState<Array<Time>>([{ time: '001000', id }]);
  const [currentId, setCurrentId] = useState(id);

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
      return newTimes;
    });
  }, []);

  const { scrollTo } = useScroll({
    onEnd: () => {
      const viewportHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
      const currentIndex = Math.round(scrollPosition / viewportHeight);
      const currentTime = times[currentIndex];

      if (!currentTime) return;
      setCurrentId(currentTime.id);
      const element = document.getElementById(currentTime.id);

      if (!element) return;
      element.scrollIntoView({ behavior: 'smooth' });
    },
  });

  const handleRemoveById = useCallback(
    async (id: string) => {
      if (times.length <= 1) return;

      const index = times.findIndex((time) => time.id === id);
      const length = times.length;

      const nextId = index === length - 1 ? times[index - 1].id : times[index + 1].id;

      setCurrentId(nextId);
      scrollTo(nextId, () => {
        setTimes((prevTimes) => {
          if (prevTimes.length <= 1) return prevTimes;
          return prevTimes.filter((time) => time.id !== id);
        });
      });
    },
    [times]
  );

  const handleSelect = useCallback((id: string) => {
    setCurrentId(id);
    scrollTo(id);
  }, []);

  const handleMount = useCallback((id: string) => {
    setCurrentId(id);
    scrollTo(id);
  }, []);

  const hasMultipleTimes = times.length > 1;

  return (
    <>
      {times.map((time) => {
        return (
          <TimerContainer
            onMount={handleMount}
            key={time.id}
            hasMultipleTimes={hasMultipleTimes}
            time={time}
            setTimes={handleSetTime}
            onNew={handleNew}
            handleRemoveById={handleRemoveById}
            currentId={currentId}
          />
        );
      })}

      <SideNav times={times} currentId={currentId} onSelect={handleSelect} />
      <Background />
    </>
  );
}

export default App;
