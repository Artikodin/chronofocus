import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Background from './components/Background';
import { TimerContainer } from './components/TimerContainer';
import { SideNav } from './components/SideNav';
import { useScroll } from './hooks/useScroll';

type TimerOptions = {
  time: string;
  id: string;
  isComplete?: boolean;
  isRunning?: boolean;
  isVisible?: boolean;
};

export class Timer {
  time: string;
  id: string;
  isComplete: boolean;
  isRunning: boolean;
  isVisible: boolean;

  constructor({
    time,
    id,
    isComplete = false,
    isRunning = false,
    isVisible = false,
  }: TimerOptions) {
    this.time = time;
    this.id = id;
    this.isComplete = isComplete;
    this.isRunning = isRunning;
    this.isVisible = isVisible;
  }
}

function App() {
  const id = uuidv4();
  const timer = new Timer({ time: '001000', id, isVisible: true });

  const [timers, setTimers] = useState<Array<Timer>>([timer]);

  useEffect(() => {
    console.log('timers', timers);
  }, [timers]);

  const handleTimeInput = (id: string) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      setTimers((prevTimers) => {
        const newTimers = [...prevTimers];
        const index = newTimers.findIndex((timer) => timer.id === id);
        if (index === -1) return prevTimers;

        const newTime = newTimers[index].time;
        newTimers[index].time = newTime.slice(0, -1);

        return newTimers;
      });
      e.preventDefault();
      return;
    }

    if (/^\d$/.test(e.key)) {
      setTimers((prevTimers) => {
        const newTimers = [...prevTimers];
        const index = newTimers.findIndex((timer) => timer.id === id);
        if (index === -1) return prevTimers;

        const newTime = newTimers[index].time;

        if (newTime.length >= 6) {
          newTimers[index].time = newTime.slice(1, 6) + e.key;
        } else {
          newTimers[index].time = newTime + e.key;
        }

        return newTimers;
      });
    }
  };

  const handleAddTime = (id: string, time: number) => {
    setTimers((prevTimers) => {
      const newTimers = [...prevTimers];
      const index = newTimers.findIndex((timer) => timer.id === id);
      if (index === -1) return prevTimers;

      const newTime = newTimers[index].time;

      const hours = +newTime.slice(0, -4);
      const minutes = +newTime.slice(2, -2);
      const seconds = +newTime.slice(-2);

      const cappedMinutes = Math.min(60, minutes);
      const _newMinutes = cappedMinutes + time;

      if (_newMinutes >= 60) {
        const newHours = hours + 1 > 99 ? 1 : hours + 1;
        const newMinutes = _newMinutes % 60;

        const paddedHours = newHours.toString().padStart(2, '0');
        const paddedMinutes = newMinutes.toString().padStart(2, '0');
        const paddedSeconds = seconds.toString().padStart(2, '0');

        newTimers[index].time = `${paddedHours}${paddedMinutes}${paddedSeconds}`;
        return newTimers;
      }

      const paddedHours = hours.toString().padStart(2, '0');
      const paddedMinutes = _newMinutes.toString().padStart(2, '0');
      const paddedSeconds = seconds.toString().padStart(2, '0');

      newTimers[index].time = `${paddedHours}${paddedMinutes}${paddedSeconds}`;
      return newTimers;
    });
  };

  const setVisible = (id: string) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) =>
        timer.id === id ? { ...timer, isVisible: true } : { ...timer, isVisible: false }
      )
    );
  };

  const handleSetTime = useCallback((id: string, time: string) => {
    setTimers((prevTimers) => {
      const newTimers = [...prevTimers];
      const index = newTimers.findIndex((timer) => timer.id === id);
      newTimers[index].time = time;
      return newTimers;
    });
  }, []);

  const handleNew = useCallback(() => {
    setTimers((prevTimers) => {
      const newTimers = [...prevTimers];
      const id = uuidv4();
      newTimers.push(new Timer({ time: '000500', id }));
      return newTimers;
    });
  }, []);

  const { scrollTo } = useScroll({
    onEnd: () => {
      const viewportHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
      const currentIndex = Math.round(scrollPosition / viewportHeight);
      const currentTime = timers[currentIndex];

      if (!currentTime) return;

      setVisible(currentTime.id);
      const element = document.getElementById(currentTime.id);

      if (!element) return;
      element.scrollIntoView({ behavior: 'smooth' });
    },
  });

  const handleRemoveById = useCallback(
    async (id: string) => {
      if (timers.length <= 1) return;

      const index = timers.findIndex((timer) => timer.id === id);
      const length = timers.length;

      const nextId = index === length - 1 ? timers[index - 1].id : timers[index + 1].id;

      setVisible(nextId);
      scrollTo(nextId, () => {
        setTimers((prevTimers) => {
          if (prevTimers.length <= 1) return prevTimers;
          return prevTimers.filter((timer) => timer.id !== id);
        });
      });
    },
    [timers]
  );

  const handleSelect = useCallback((id: string) => {
    setVisible(id);
    scrollTo(id);
  }, []);

  const handleMount = useCallback((id: string) => {
    setVisible(id);
    scrollTo(id);
  }, []);

  const handleComplete = (id: string) => {
    setTimers((prevTimers) => {
      const newTimers = [...prevTimers];
      const index = newTimers.findIndex((timer) => timer.id === id);
      newTimers[index].isComplete = true;

      const length = newTimers.length;
      const hasNext = index < length - 1;

      if (hasNext) {
        const nextId = newTimers[index + 1].id;
        scrollTo(nextId);
        return newTimers.map((timer) =>
          timer.id === nextId ? { ...timer, isVisible: true } : { ...timer, isVisible: false }
        );
      }

      return newTimers;
    });
  };

  const handleReset = (id: string) => {
    setTimers((prevTimers) => {
      const newTimers = [...prevTimers];
      const index = newTimers.findIndex((timer) => timer.id === id);
      newTimers[index].isComplete = false;
      return newTimers;
    });
  };

  const hasMultipleTimes = timers.length > 1;

  return (
    <>
      {timers.map((timer) => {
        return (
          <TimerContainer
            onComplete={handleComplete}
            onMount={handleMount}
            key={timer.id}
            hasMultipleTimes={hasMultipleTimes}
            timer={timer}
            setTimes={handleSetTime}
            onNew={handleNew}
            handleRemoveById={handleRemoveById}
            onReset={handleReset}
            handleAddTime={handleAddTime}
            handleTimeInput={handleTimeInput}
          />
        );
      })}

      <SideNav timers={timers} onSelect={handleSelect} />
      <Background />
    </>
  );
}

export default App;
