/* eslint-env vitest */
import { logInfo } from '@vite-powerflow/utils';

describe('Import @vite-powerflow/utils', () => {
  it('should import and call logInfo without error', () => {
    expect(() => logInfo('Test inter-package import')).not.toThrow();
  });
});
