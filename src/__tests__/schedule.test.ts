import { describe, it, expect } from 'vitest';
import {
  formatTimeJST,
  getDateJST,
  formatScheduleTime,
  formatJstDateForDisplay,
} from '../lib/utils/formatSchedule';

describe('formatSchedule Utilities (Zero DB / Network)', () => {
  describe('formatTimeJST', () => {
    it('should format UTC ISO string to JST time HH:mm', () => {
      // 2026-09-01 03:00:00 UTC == 2026-09-01 12:00:00 JST
      const utcIso = '2026-09-01T03:00:00.000Z';
      expect(formatTimeJST(utcIso)).toBe('12:00');
    });

    it('should format midnight UTC correctly to JST 09:00', () => {
      const utcIso = '2026-09-01T00:00:00.000Z';
      expect(formatTimeJST(utcIso)).toBe('09:00');
    });

    it('should handle null, undefined, and invalid inputs gracefully', () => {
      expect(formatTimeJST(null)).toBe('??:??');
      expect(formatTimeJST(undefined)).toBe('??:??');
      expect(formatTimeJST('invalid-date')).toBe('??:??');
    });
  });

  describe('getDateJST', () => {
    it('should return JST date string in YYYY/MM/DD format', () => {
      // 2026-08-31 20:00:00 UTC == 2026-09-01 05:00:00 JST
      const utcIso = '2026-08-31T20:00:00.000Z';
      expect(getDateJST(utcIso)).toBe('2026/09/01');
    });
  });

  describe('formatScheduleTime', () => {
    it('should format same-day shift without "翌"', () => {
      // 12:00 JST to 18:00 JST
      const start = '2026-09-01T03:00:00.000Z'; // 12:00 JST
      const end = '2026-09-01T09:00:00.000Z'; // 18:00 JST
      expect(formatScheduleTime(start, end)).toBe('12:00〜18:00');
    });

    it('should append "翌" when shift crosses midnight into next day', () => {
      // 20:00 JST to 04:00 JST (next day)
      const start = '2026-09-01T11:00:00.000Z'; // 20:00 JST
      const end = '2026-09-01T19:00:00.000Z'; // 04:00 JST next day (2026-09-02)
      expect(formatScheduleTime(start, end)).toBe('20:00〜翌04:00');
    });

    it('should handle missing start or end date', () => {
      expect(formatScheduleTime(null, null)).toBe('時間未定');
      expect(formatScheduleTime('2026-09-01T03:00:00.000Z', null)).toBe('12:00〜??:??');
      expect(formatScheduleTime(null, '2026-09-01T09:00:00.000Z')).toBe('??:??〜18:00');
    });
  });

  describe('formatJstDateForDisplay', () => {
    it('should format YYYY-MM-DD to Japanese display format with day of week', () => {
      // 2026-09-01 is Tuesday (火)
      const result = formatJstDateForDisplay('2026-09-01');
      expect(result.displayText).toBe('9月1日(火)');
      expect(result.dayOfWeekNum).toBe(2);
    });

    it('should format month-end correctly', () => {
      // 2026-08-31 is Monday (月)
      const result = formatJstDateForDisplay('2026-08-31');
      expect(result.displayText).toBe('8月31日(月)');
      expect(result.dayOfWeekNum).toBe(1);
    });
  });
});
