import { detectWorkspaceRoot } from './workspaceDetector';

describe('workspaceDetector', () => {
  it('should export detectWorkspaceRoot', () => {
    expect(typeof detectWorkspaceRoot).toBe('function');
  });
});
