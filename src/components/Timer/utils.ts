export const parseHHMMSStringToMs = (value: string) => {
  const padded = value.padStart(6, '0');
  const hours = +padded.slice(0, -4);
  const minutes = +padded.slice(2, -2);
  const seconds = +padded.slice(-2);

  const cappedMinutes = Math.min(59, minutes);
  const cappedSeconds = Math.min(59, seconds);

  return (hours * 3600 + cappedMinutes * 60 + cappedSeconds) * 1000;
};

export const formatMsToHHMMSS = (millisecond: number) => {
  const safeMs = Math.max(0, millisecond);

  const totalSeconds = Math.floor(safeMs / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  return `${hours}${minutes}${seconds}`;
};

export const formatRawInput = (value: string) => {
  const padded = value.padStart(6, '0');

  const hours = padded.substring(0, 2);
  const minutes = padded.substring(2, 4);
  const seconds = padded.substring(4, 6);

  return `${hours}:${minutes}:${seconds}`;
};

export const formatTimerRunning = (value: string, elapsedMs: number) => {
  const timerMS = parseHHMMSStringToMs(value);
  const newTimerMs = timerMS - elapsedMs;
  const timerHHMMSS = formatMsToHHMMSS(newTimerMs);

  const padded = timerHHMMSS.padStart(6, '0');

  const hours = padded.substring(0, 2);
  const minutes = padded.substring(2, 4);
  const seconds = padded.substring(4, 6);

  if (hours === '00' && minutes === '00') {
    return `${seconds}`;
  }

  if (hours === '00') {
    return `${minutes}:${seconds}`;
  }

  return `${hours}:${minutes}:${seconds}`;
};
