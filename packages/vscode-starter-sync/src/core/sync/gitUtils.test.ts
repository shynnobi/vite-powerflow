import { describe, expect, it, vi } from 'vitest';

import { getCommitsSince, getCurrentCommit, getTemplateBaselineCommit } from './gitUtils.js';

describe('git utils', () => {
  it('should export functions', () => {
    expect(typeof getCurrentCommit).toBe('function');
    expect(typeof getTemplateBaselineCommit).toBe('function');
    expect(typeof getCommitsSince).toBe('function');
  });
});

describe('getCurrentCommit', () => {
  it('returns the current commit hash (DI)', () => {
    const fakeExec = vi.fn().mockReturnValue('abc123\n');
    expect(getCurrentCommit('/fake', fakeExec)).toBe('abc123');
    expect(fakeExec).toHaveBeenCalledWith('git rev-parse HEAD', expect.any(Object));
  });
});
