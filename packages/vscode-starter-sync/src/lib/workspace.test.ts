import { getWorkspaceRoot } from './workspace.js';

describe('workspace', () => {
  it('should export getWorkspaceRoot', () => {
    expect(typeof getWorkspaceRoot).toBe('function');
  });
});
