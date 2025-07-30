import { checkCliStatus, checkStarterStatus } from './checks';

describe('checks', () => {
  it('should export functions', () => {
    expect(typeof checkStarterStatus).toBe('function');
    expect(typeof checkCliStatus).toBe('function');
  });
});
