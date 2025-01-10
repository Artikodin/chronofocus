import { expect, test, describe } from 'vitest';
import { formatTimerRunning } from '../utils';

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
