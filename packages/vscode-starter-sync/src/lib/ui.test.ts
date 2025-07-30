import { handleSyncResults, updateStatusBar } from './ui';

describe('ui', () => {
  it('should export functions', () => {
    expect(typeof updateStatusBar).toBe('function');
    expect(typeof handleSyncResults).toBe('function');
  });
});
