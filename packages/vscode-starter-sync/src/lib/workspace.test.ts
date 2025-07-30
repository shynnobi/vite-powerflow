import { getWorkspaceRoot } from './workspace';

describe('workspace', () => {
  it('should export getWorkspaceRoot', () => {
    expect(typeof getWorkspaceRoot).toBe('function');
  });
});
