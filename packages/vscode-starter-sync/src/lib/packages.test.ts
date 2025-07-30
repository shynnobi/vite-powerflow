import { getLatestNpmVersion, getPackageInfo } from './packages.js';

describe('packages utils', () => {
  it('should export functions', () => {
    expect(typeof getPackageInfo).toBe('function');
    expect(typeof getLatestNpmVersion).toBe('function');
  });
});
