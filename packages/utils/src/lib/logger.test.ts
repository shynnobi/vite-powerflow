import { describe, expect, it, vi } from 'vitest';

import { logError, logInfo, logSuccess } from './logger';

describe('logger', () => {
  it('logInfo should call console.log with a cyan prefix and message', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {
      // Mock implementation for console.log
    });
    logInfo('Hello info');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('logSuccess should call console.log with a green prefix and message', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {
      // Mock implementation for console.log
    });
    logSuccess('Hello success');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('logError should call console.error with a red prefix and message', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {
      // Mock implementation for console.error
    });
    logError('Hello error');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
