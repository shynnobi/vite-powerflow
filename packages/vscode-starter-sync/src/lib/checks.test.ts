import { checkCliStatus, checkStarterStatus } from './checks.js';

describe('checks', () => {
  it('should export functions', () => {
    expect(typeof checkStarterStatus).toBe('function');
    expect(typeof checkCliStatus).toBe('function');
  });
});
