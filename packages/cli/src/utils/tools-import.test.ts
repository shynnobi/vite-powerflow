/* eslint-env vitest */
import { logInfo } from '@vite-powerflow/tools';

describe('Import @vite-powerflow/tools', () => {
  it('should import and call logInfo without error', () => {
    expect(() => logInfo('Test inter-package import')).not.toThrow();
  });
});
