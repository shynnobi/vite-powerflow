import { getCommitsSince, getCurrentCommit, getTemplateBaselineCommit } from './git';

describe('git utils', () => {
  it('should export functions', () => {
    expect(typeof getCurrentCommit).toBe('function');
    expect(typeof getTemplateBaselineCommit).toBe('function');
    expect(typeof getCommitsSince).toBe('function');
  });
});
