import { expect, test, describe } from 'vitest';
import { parseHHMMSStringToMs, formatMsToHHMMSS, formatRawInput } from '../utils';

describe('parseHHMMSStringToMs', () => {
  test('should parse basic time strings', () => {
    expect(parseHHMMSStringToMs('000100')).toBe(60000); // 1 minute
    expect(parseHHMMSStringToMs('010000')).toBe(3600000); // 1 hour
    expect(parseHHMMSStringToMs('000001')).toBe(1000); // 1 second
  });

  test('should handle shorter inputs by padding with zeros', () => {
    expect(parseHHMMSStringToMs('100')).toBe(60000); // 01:00
    expect(parseHHMMSStringToMs('1')).toBe(1000); // 00:01
  });

  test('should cap minutes and seconds at 59', () => {
    expect(parseHHMMSStringToMs('006500')).toBe(3540000); // 00:59:00
    expect(parseHHMMSStringToMs('000070')).toBe(59000); // 00:00:59
  });

  test('should handle complex times', () => {
    expect(parseHHMMSStringToMs('013930')).toBe(5970000); // 1:59:30
    expect(parseHHMMSStringToMs('240000')).toBe(86400000); // 24:00:00
  });
});

describe('formatMsToHHMMSS', () => {
  test('should format basic millisecond values', () => {
    expect(formatMsToHHMMSS(60000)).toBe('000100'); // 1 minute
    expect(formatMsToHHMMSS(3600000)).toBe('010000'); // 1 hour
    expect(formatMsToHHMMSS(1000)).toBe('000001'); // 1 second
  });

  test('should handle zero and negative values', () => {
    expect(formatMsToHHMMSS(0)).toBe('000000');
    expect(formatMsToHHMMSS(-1000)).toBe('000000');
  });

  test('should pad numbers with zeros', () => {
    expect(formatMsToHHMMSS(5000)).toBe('000005');
    expect(formatMsToHHMMSS(900000)).toBe('001500');
  });

  test('should handle complex times', () => {
    expect(formatMsToHHMMSS(5970000)).toBe('013930'); // 1:59:30
    expect(formatMsToHHMMSS(86400000)).toBe('240000'); // 24:00:00
  });
});

describe('formatRawInput', () => {
  test('should format basic inputs with colons', () => {
    expect(formatRawInput('000100')).toBe('00:01:00');
    expect(formatRawInput('010000')).toBe('01:00:00');
    expect(formatRawInput('000001')).toBe('00:00:01');
  });

  test('should handle shorter inputs by padding with zeros', () => {
    expect(formatRawInput('100')).toBe('00:01:00');
    expect(formatRawInput('1')).toBe('00:00:01');
  });

  test('should always return in HH:MM:SS format', () => {
    expect(formatRawInput('')).toBe('00:00:00');
    expect(formatRawInput('5')).toBe('00:00:05');
    expect(formatRawInput('45')).toBe('00:00:45');
    expect(formatRawInput('245')).toBe('00:02:45');
  });

  test('should handle full length inputs', () => {
    expect(formatRawInput('235959')).toBe('23:59:59');
    expect(formatRawInput('015930')).toBe('01:59:30');
  });
});
