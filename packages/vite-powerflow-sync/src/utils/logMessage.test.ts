import { describe, expect, it } from 'vitest';

import { logMessage } from './logMessage.js';
import { createMockOutputChannel } from './testUtils.js';

describe('logMessage', () => {
  it('should log to output channel only', () => {
    const mockOutputChannel = createMockOutputChannel();

    logMessage(mockOutputChannel, 'test message');

    expect(mockOutputChannel.appendLine).toHaveBeenCalledWith('test message');
  });
});
