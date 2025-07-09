import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { logger } from '@/utils/logger';

const originalEnv = process.env.NODE_ENV;

describe('logger', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;
  let infoSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
    errorSpy.mockRestore();
    infoSpy.mockRestore();
    process.env.NODE_ENV = originalEnv;
  });

  it('should log warn in development', () => {
    // Given: The environment is set to development
    process.env.NODE_ENV = 'development';

    // When: logger.warn is called with a message and argument
    logger.warn('dev warning', 123);

    // Then: console.warn should be called with the expected message and argument
    expect(warnSpy).toHaveBeenCalledWith('⚠️ dev warning', 123);
  });

  it('should not log warn in production', () => {
    // Given: The environment is set to production
    process.env.NODE_ENV = 'production';

    // When: logger.warn is called with a message
    logger.warn('prod warning');

    // Then: console.warn should not be called
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('should log info in development', () => {
    // Given: The environment is set to development
    process.env.NODE_ENV = 'development';

    // When: logger.info is called with a message and argument
    logger.info('dev info', { foo: 'bar' });

    // Then: console.info should be called with the expected message and argument
    expect(infoSpy).toHaveBeenCalledWith('ℹ️ dev info', { foo: 'bar' });
  });

  it('should not log info in production', () => {
    // Given: The environment is set to production
    process.env.NODE_ENV = 'production';

    // When: logger.info is called with a message
    logger.info('prod info');

    // Then: console.info should not be called
    expect(infoSpy).not.toHaveBeenCalled();
  });

  it('should always log error', () => {
    // Given: The environment is set to production
    process.env.NODE_ENV = 'production';

    // When: logger.error is called with a message and argument
    logger.error('prod error', 'details');

    // Then: console.error should be called with the expected message and argument
    expect(errorSpy).toHaveBeenCalledWith('🔴 prod error', 'details');

    // Given: The environment is set to development
    process.env.NODE_ENV = 'development';

    // When: logger.error is called with a message
    logger.error('dev error');

    // Then: console.error should be called with the expected message
    expect(errorSpy).toHaveBeenCalledWith('🔴 dev error');
  });
});
