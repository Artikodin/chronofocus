import { useState } from 'react';

export default function Timer() {
  const [time, setTime] = useState('');

  const formatTimeInput = (value: string) => {
    // Pad with zeros if needed (up to 6 digits)
    const padded = value.padStart(6, '0');
    // Split into hours, minutes, seconds
    const hours = padded.substring(0, 2);
    const minutes = padded.substring(2, 4);
    const seconds = padded.substring(4, 6);

    // Return formatted string
    return `${hours}:${minutes}:${seconds}`;
  };

  // In your component
  const handleTimeInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      setTime((prev) => prev.slice(0, -1));
      e.preventDefault();
      return;
    }

    if (/^\d$/.test(e.key)) {
      setTime((prev) => {
        if (prev.length >= 6) {
          console.log('prev', prev.slice(1, 6));
          return prev.slice(1, 6) + e.key;
        }
        return prev + e.key;
      });
    }
  };

  const formatted = formatTimeInput(time);

  return (
    <div>
      <input type="text" value={formatted} onKeyDown={handleTimeInput} />
    </div>
  );
}
