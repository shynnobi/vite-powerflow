import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createMockOutputChannel } from '../utils/testUtils';
import { handleInSync, handleUnreleasedCommits } from './syncHandler';
import { SyncCheckConfig } from './types';

describe('syncHandler', () => {
  const mockOutputChannel = createMockOutputChannel();

  const mockConfig: SyncCheckConfig = {
    label: 'Starter',
    baseline: () => Promise.resolve('test-baseline'),
    commitPath: 'test/',
    messages: {
      notFound: 'Not found',
      inSync: 'In sync',
      unreleased: 'unreleased changes',
      errorPrefix: 'Error',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleUnreleasedCommits', () => {
    it('should return warning status with commit count', () => {
      const commits = ['commit1', 'commit2'];
      const result = handleUnreleasedCommits(mockConfig, commits, mockOutputChannel);

      expect(result).toEqual({
        status: 'warning',
        message: '2 unreleased changes',
        commitCount: 2,
      });
    });
  });

  describe('handleInSync', () => {
    it('should return sync status with zero commits', () => {
      const result = handleInSync(mockConfig, mockOutputChannel);

      expect(result).toEqual({
        status: 'sync',
        message: 'In sync',
        commitCount: 0,
      });
    });
  });
});
