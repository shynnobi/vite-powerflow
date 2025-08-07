import { getLatestNpmVersion, getPackageInfo } from './packageUtils.js';

describe('packageUtils', () => {
  it('should export functions', () => {
    expect(typeof getPackageInfo).toBe('function');
    expect(typeof getLatestNpmVersion).toBe('function');
  });
});
