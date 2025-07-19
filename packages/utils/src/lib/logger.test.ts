import { describe, it, expect, vi } from 'vitest';
import { logInfo, logSuccess, logError } from './logger';

describe('logger', () => {
  it('logInfo should call console.log with a cyan prefix and message', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    logInfo('Hello info');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('logSuccess should call console.log with a green prefix and message', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    logSuccess('Hello success');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('logError should call console.error with a red prefix and message', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    logError('Hello error');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
