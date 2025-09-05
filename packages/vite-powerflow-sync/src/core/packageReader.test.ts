import { readLatestNpmVersion, readPackageInfo } from './packageReader';

describe('packageReader', () => {
  it('should export functions', () => {
    expect(typeof readPackageInfo).toBe('function');
    expect(typeof readLatestNpmVersion).toBe('function');
  });
});
