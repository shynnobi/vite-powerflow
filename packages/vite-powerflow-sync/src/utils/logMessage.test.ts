import { describe, expect, it } from 'vitest';

import { logMessage } from './logMessage';
import { createMockOutputChannel } from './testUtils';

describe('logMessage', () => {
  it('should log to output channel only', () => {
    const mockOutputChannel = createMockOutputChannel();

    logMessage(mockOutputChannel, 'test message');

    expect(mockOutputChannel.appendLine).toHaveBeenCalledWith('test message');
  });
});
