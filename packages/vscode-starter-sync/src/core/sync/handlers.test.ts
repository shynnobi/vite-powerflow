import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createMockOutputChannel } from '../../test-utils.js';
import { PackageLabel, SyncCheckConfig } from '../../types.js';
import { logMessage } from '../utils.js';
import {
  formatBaselineLog,
  handleError,
  handleInSync,
  handleUnreleasedCommits,
} from './handlers.js';

// Mock the packages module
vi.mock('../packages.js', () => ({
  getPackageInfo: (path: string) => {
    if (path.includes('template/package.json')) {
      return Promise.resolve({ version: '1.0.0' });
    }
    return Promise.resolve(null);
  },
}));

describe('sync/handlers', () => {
  const mockOutputChannel = createMockOutputChannel();

  const mockConfig: SyncCheckConfig = {
    label: PackageLabel.Starter,
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

  describe('logMessage', () => {
    it('should log to output channel only', () => {
      logMessage(mockOutputChannel, 'test message');

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockOutputChannel.appendLine).toHaveBeenCalledWith('test message');
    });
  });

  describe('formatBaselineLog', () => {
    it('should format basic baseline log for non-Starter config', async () => {
      const config: SyncCheckConfig = {
        label: PackageLabel.Cli,
        baseline: () => Promise.resolve('abc123456789'),
        commitPath: 'packages/cli/',
        messages: {
          notFound: '',
          inSync: '',
          unreleased: '',
          errorPrefix: '',
        },
      };

      const result = await formatBaselineLog(config, 'abc123456789', '/test/workspace');
      expect(result).toBe('📦 [CLI] Checking against baseline (commit/tag abc1234)');
    });

    it('should format enhanced log for Starter config with version', async () => {
      const config: SyncCheckConfig = {
        label: PackageLabel.Starter,
        baseline: () => Promise.resolve('abc123456789'),
        commitPath: 'apps/starter/',
        messages: {
          notFound: '',
          inSync: '',
          unreleased: '',
          errorPrefix: '',
        },
      };

      const result = await formatBaselineLog(config, 'abc123456789', '/test/workspace');
      expect(result).toBe(
        '📦 [Starter] Checking against CLI template baseline (commit abc1234, version 1.0.0)'
      );
    });
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

  describe('handleError', () => {
    it('should return error status with error message', () => {
      const error = new Error('Test error');
      const result = handleError(mockConfig, error, mockOutputChannel);

      expect(result).toEqual({
        status: 'error',
        message: 'Error',
        commitCount: 0,
      });
    });
  });
});
