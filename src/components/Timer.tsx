import { useState } from 'react';

export default function Timer() {
  const [time, setTime] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const formatRawInput = (value: string) => {
    const padded = value.padStart(6, '0');

    const hours = padded.substring(0, 2);
    const minutes = padded.substring(2, 4);
    const seconds = padded.substring(4, 6);

    return `${hours}:${minutes}:${seconds}`;
  };

  const formatTimerInput = (value: string) => {
    const hours = +value.slice(0, -4);
    const minutes = +value.slice(2, -2);
    const seconds = +value.slice(-2);

    const cappedMinutes = minutes > 59 ? 59 : minutes;
    const cappedSeconds = seconds > 59 ? 59 : seconds;

    const paddedHours = hours.toString().padStart(2, '0');
    const paddedMinutes = cappedMinutes.toString().padStart(2, '0');
    const paddedSeconds = cappedSeconds.toString().padStart(2, '0');

    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  };

  const handleTimeInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      setTime((prev) => prev.slice(0, -1));
      e.preventDefault();
      return;
    }

    if (/^\d$/.test(e.key)) {
      setTime((prev) => {
        if (prev.length >= 6) {
          return prev.slice(1, 6) + e.key;
        }
        return prev + e.key;
      });
    }
  };

  const handleAddTime = (time: number) => () => {
    setTime((prev) => {
      const hours = +prev.slice(0, -4);
      const minutes = +prev.slice(2, -2);
      const seconds = +prev.slice(-2);

      const _newMinutes = minutes + time;

      if (_newMinutes >= 60) {
        const newHours = hours + 1 > 99 ? 1 : hours + 1;
        const newMinutes = _newMinutes % 60;

        const paddedHours = newHours.toString().padStart(2, '0');
        const paddedMinutes = newMinutes.toString().padStart(2, '0');
        const paddedSeconds = seconds.toString().padStart(2, '0');

        return `${paddedHours}${paddedMinutes}${paddedSeconds}`;
      }

      const paddedHours = hours.toString().padStart(2, '0');
      const paddedMinutes = _newMinutes.toString().padStart(2, '0');
      const paddedSeconds = seconds.toString().padStart(2, '0');

      return `${paddedHours}${paddedMinutes}${paddedSeconds}`;
    });
  };

  const formattedRaw = formatRawInput(time);
  const formattedTimer = formatTimerInput(time);

  return (
    <div>
      <div>{time}</div>
      <input
        type="text"
        value={isFocused ? formattedRaw : formattedTimer}
        onKeyDown={handleTimeInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <button onClick={handleAddTime(1)}>+1:00</button>
      <button onClick={handleAddTime(10)}>+10:00</button>
      <button onClick={handleAddTime(15)}>+15:00</button>
    </div>
  );
}
