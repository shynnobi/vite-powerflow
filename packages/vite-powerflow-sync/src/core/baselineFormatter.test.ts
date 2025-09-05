import { describe, expect, it } from 'vitest';

import { formatBaseline } from './baselineFormatter';

describe('baselineFormatter', () => {
  describe('formatBaseline', () => {
    it('should format baseline commit hash correctly', () => {
      const baseline = 'abc123456789';
      const result = formatBaseline(baseline);
      expect(result).toBe('abc1234');
    });

    it('should handle short hashes', () => {
      const baseline = 'abc123';
      const result = formatBaseline(baseline);
      expect(result).toBe('abc123');
    });

    it('should handle empty baseline', () => {
      const baseline = '';
      const result = formatBaseline(baseline);
      expect(result).toBe('');
    });
  });
});
