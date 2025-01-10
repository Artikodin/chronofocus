import { expect, test, describe } from 'vitest';

const parseHHMMSStringToMs = (value: string) => {
  const padded = value.padStart(6, '0');
  const hours = +padded.slice(0, -4);
  const minutes = +padded.slice(2, -2);
  const seconds = +padded.slice(-2);

  const cappedMinutes = Math.min(59, minutes);
  const cappedSeconds = Math.min(59, seconds);

  return (hours * 3600 + cappedMinutes * 60 + cappedSeconds) * 1000;
};

function formatMsToHHMMSS(millisecond: number) {
  const safeMs = Math.max(0, millisecond);

  const totalSeconds = Math.floor(safeMs / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  return `${hours}${minutes}${seconds}`;
}

const formatRawInput = (value: string) => {
  const padded = value.padStart(6, '0');

  const hours = padded.substring(0, 2);
  const minutes = padded.substring(2, 4);
  const seconds = padded.substring(4, 6);

  return `${hours}:${minutes}:${seconds}`;
};

const formatTimerRunning = (value: string, elapsedMs: number) => {
  const timerMS = parseHHMMSStringToMs(value);
  const newTimerMs = timerMS - elapsedMs;
  const timerHHMMSS = formatMsToHHMMSS(newTimerMs);

  return formatRawInput(timerHHMMSS);
};

describe('formatTimerRunning', () => {
  test('should format basic countdown with no elapsed time', () => {
    expect(formatTimerRunning('115', 0)).toBe('00:01:15');
  });

  test('should subtract elapsed seconds', () => {
    expect(formatTimerRunning('000030', 10000)).toBe('00:00:20');
  });

  test('should subtract elapsed minutes', () => {
    expect(formatTimerRunning('000500', 120000)).toBe('00:03:00');
  });

  test('should subtract elapsed hours', () => {
    expect(formatTimerRunning('020000', 3600000)).toBe('01:00:00');
  });

  test('should handle overflow minutes', () => {
    expect(formatTimerRunning('006500', 0)).toBe('00:59:00');
  });

  test('should handle overflow seconds', () => {
    expect(formatTimerRunning('000070', 0)).toBe('00:00:59');
  });

  test('should handle complex elapsed time across hours/minutes/seconds', () => {
    // 1:30:45 with 45:30 elapsed should show 0:45:15
    expect(formatTimerRunning('013045', 2730000)).toBe('00:45:15');
  });
});
