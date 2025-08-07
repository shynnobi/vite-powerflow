import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createMockOutputChannel } from '../../utils/testUtils.js';
import { PackageLabel, SyncCheckConfig } from '../syncTypes.js';
import { handleError } from './syncErrorHandler.js';

describe('syncErrorHandler', () => {
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
