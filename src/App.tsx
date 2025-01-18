import { useCallback, useState, useEffect } from 'react';
import Background from './components/Background';
import { TimerContainer } from './components/TimerContainer';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [times, setTimes] = useState<Array<{ time: string; id: string }>>([
    { time: '001000', id: uuidv4() },
  ]);

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
      }, 150);
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

  const hasMultipleTimes = times.length > 1;

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

      <div className="fixed right-4 top-1/2 flex translate-y--1/2 flex-col gap-1">
        {hasMultipleTimes &&
          times.map((time) => {
            return (
              <a href={`#${time.id}`} key={time.id}>
                {time.time} {time.id}
              </a>
            );
          })}
      </div>
      <Background />
    </>
  );
}

export default App;
