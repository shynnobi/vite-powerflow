import { detectWorkspaceRoot } from './workspaceDetector.js';

describe('workspaceDetector', () => {
  it('should export detectWorkspaceRoot', () => {
    expect(typeof detectWorkspaceRoot).toBe('function');
  });
});
