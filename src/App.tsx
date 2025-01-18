import { useCallback, useState, useEffect } from 'react';
import Background from './components/Background';
import { TimerContainer } from './components/TimerContainer';

function App() {
  const [times, setTimes] = useState<string[]>(['001000']);

  const handleSetTime = useCallback((index: number, time: string) => {
    setTimes((prevTimes) => {
      const newTimes = [...prevTimes];
      newTimes[index] = time;
      return newTimes;
    });
  }, []);

  const handleNew = useCallback(() => {
    setTimes((prevTimes) => {
      const newTimes = [...prevTimes];
      newTimes.push('000500');
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

        const shownIndex = +window.location.hash.replace('#', '');

        if (shownIndex !== index) {
          window.location.href = `#${index}`;
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
  }, []);

  const handleRemoveFirst = useCallback(() => {
    setTimes((prevTimes) => {
      if (prevTimes.length <= 1) return prevTimes;
      const newTimes = [...prevTimes];
      newTimes.shift();
      return newTimes;
    });
  }, []);

  const hasMultipleTimes = times.length > 1;

  return (
    <>
      {times.map((time, index) => {
        return (
          <TimerContainer
            key={index}
            time={time}
            setTimes={handleSetTime}
            index={index}
            onNew={handleNew}
          />
        );
      })}

      <div className="fixed right-4 top-1/2 flex translate-y--1/2 flex-col gap-1">
        {hasMultipleTimes &&
          times.map((time, index) => {
            return (
              <a href={`#${index}`} key={index}>
                {time} new
              </a>
            );
          })}

        <button onClick={handleRemoveFirst}>Remove first</button>
      </div>
      <Background />
    </>
  );
}

export default App;
