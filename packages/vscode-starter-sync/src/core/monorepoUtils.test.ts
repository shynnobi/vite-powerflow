import { getWorkspaceRoot } from './monorepoUtils.js';

describe('monorepoUtils', () => {
  it('should export getWorkspaceRoot', () => {
    expect(typeof getWorkspaceRoot).toBe('function');
  });
});
