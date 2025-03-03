import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Background from './components/Background';
import { TimerContainer } from './components/TimerContainer';
import { SideNav } from './components/SideNav';
import { useScroll } from './hooks/useScroll';
import { useMediaQuery } from './hooks/useMediaQuery';

type TimerOptions = {
  time: string;
  id: string;
  isRunning?: boolean;
  isVisible?: boolean;
  accumulatedTime?: number;
  startTime?: number;
  isPaused?: boolean;
  isResetting?: boolean;
};

export class Timer {
  time: string;
  id: string;
  isRunning: boolean;
  isVisible: boolean;
  accumulatedTime: number;
  startTime: number;
  isPaused: boolean;
  isResetting: boolean;
  constructor({
    time,
    id,
    isRunning = false,
    isVisible = false,
    accumulatedTime = 0,
    startTime = 0,
    isPaused = false,
    isResetting = false,
  }: TimerOptions) {
    this.time = time;
    this.id = id;
    this.isRunning = isRunning;
    this.isVisible = isVisible;
    this.accumulatedTime = accumulatedTime;
    this.startTime = startTime;
    this.isPaused = isPaused;
    this.isResetting = isResetting;
  }
}

function App() {
  const id = uuidv4();
  const timer = new Timer({
    time: '000001',
    id,
    isVisible: true,
  });

  const [timers, setTimers] = useState<Array<Timer>>(() => {
    const saved = localStorage.getItem('timers');
    const savedTimers = saved ? JSON.parse(saved) : [timer];

    const resetTimerOption = {
      startTime: 0,
      accumulatedTime: 0,
      isRunning: false,
      isPaused: false,
    };

    return savedTimers.map((timer: Timer) => new Timer({ ...timer, ...resetTimerOption }));
  });

  const query = useMediaQuery();

  useEffect(() => {
    localStorage.setItem('timers', JSON.stringify(timers));
  }, [timers]);

  const handlePauseTimer = (id: string) => {
    setTimers((prevTimers) => {
      const newTimers = [...prevTimers];
      const index = newTimers.findIndex((timer) => timer.id === id);
      if (index === -1) return prevTimers;

      const timerStartTime = newTimers[index].startTime;
      const timerAccumulatedTime = newTimers[index].accumulatedTime;
      if (timerStartTime === 0) return prevTimers;

      newTimers[index].isPaused = true;
      newTimers[index].startTime = 0;

      const elapsed = performance.now() - timerStartTime;
      newTimers[index].accumulatedTime = timerAccumulatedTime + elapsed;

      return newTimers;
    });
  };

  const handleCompleteTimer = (id: string) => {
    setTimers((prevTimers) => {
      const newTimers = [...prevTimers];
      const index = newTimers.findIndex((timer) => timer.id === id);
      if (index === -1) return prevTimers;

      const timerStartTime = newTimers[index].startTime;
      const timerAccumulatedTime = newTimers[index].accumulatedTime;
      if (timerStartTime === 0) return prevTimers;

      const elapsed = performance.now() - timerStartTime;
      newTimers[index].accumulatedTime = timerAccumulatedTime + elapsed;
      newTimers[index].startTime = 0;

      return newTimers;
    });
  };

  const handleStartTimer = (id: string) => {
    setTimers((prevTimers) => {
      const newTimers = [...prevTimers];
      const index = newTimers.findIndex((timer) => timer.id === id);
      if (index === -1) return prevTimers;

      const timerStartTime = newTimers[index].startTime;
      if (timerStartTime !== 0) return prevTimers;

      newTimers[index].startTime = performance.now();
      newTimers[index].isRunning = true;
      newTimers[index].isPaused = false;

      return newTimers;
    });
  };

  const handleResetTimer = (id: string) => {
    setTimers((prevTimers) => {
      const newTimers = [...prevTimers];
      const index = newTimers.findIndex((timer) => timer.id === id);
      if (index === -1) return prevTimers;

      newTimers[index].startTime = 0;
      newTimers[index].isRunning = false;
      newTimers[index].isPaused = true;
      newTimers[index].accumulatedTime = 0;
      newTimers[index].isResetting = true;

      return newTimers;
    });
  };

  const handleAnimationReset = (id: string) => {
    setTimers((prevTimers) => {
      const newTimers = [...prevTimers];
      const index = newTimers.findIndex((timer) => timer.id === id);
      if (index === -1) return prevTimers;

      newTimers[index].isResetting = false;

      return newTimers;
    });
  };

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

  const handleNew = () => {
    setTimers((prevTimers) => {
      const newTimers = [...prevTimers];

      const id = uuidv4();

      const resetVisiblity = newTimers.map((timer) => ({
        ...timer,
        isVisible: false,
      }));

      resetVisiblity.push(new Timer({ time: '000500', id, isVisible: true }));

      return resetVisiblity;
    });
  };

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

  const handleRemoveById = (id: string) => {
    if (timers.length <= 1) return;

    const index = timers.findIndex((timer) => timer.id === id);
    const length = timers.length;

    const nextId = index === length - 1 ? timers[index - 1].id : timers[index + 1].id;

    setVisible(nextId);
    scrollTo(nextId, () => {
      setTimers((prevTimers) => {
        return prevTimers.filter((timer) => timer.id !== id);
      });
    });
  };

  const handleSelect = (id: string) => {
    setVisible(id);
    scrollTo(id);
  };

  const handleMount = (id: string) => {
    const index = timers.findIndex((timer) => timer.id === id);
    const isVisible = timers[index].isVisible;
    if (isVisible) {
      scrollTo(id);
    }
  };

  const handleAnimationComplete = (id: string) => {
    setTimers((prevTimers) => {
      const newTimers = [...prevTimers];
      const index = newTimers.findIndex((timer) => timer.id === id);
      if (index === -1) return prevTimers;

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

  const hasMultipleTimes = timers.length > 1;

  return (
    <>
      {timers.map((_timer) => {
        return (
          <TimerContainer
            onAnimationComplete={handleAnimationComplete}
            onMount={handleMount}
            hasMultipleTimes={hasMultipleTimes}
            key={_timer.id}
            timer={_timer}
            onNew={handleNew}
            onTimerComplete={handleCompleteTimer}
            handleRemoveById={handleRemoveById}
            onAddTime={handleAddTime}
            onKeyDown={handleTimeInput}
            onStart={handleStartTimer}
            onPause={handlePauseTimer}
            onReset={handleResetTimer}
            onAnimationReset={handleAnimationReset}
          />
        );
      })}

      <SideNav timers={timers} onSelect={handleSelect} />
      {query !== 'sm' && <Background />}
    </>
  );
}

export default App;
