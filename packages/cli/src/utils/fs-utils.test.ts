import fs from 'fs/promises';
import { describe, expect, it, vi } from 'vitest';

import { directoryExists } from './fs-utils.js';

vi.mock('fs/promises');

describe('directoryExists', () => {
  it('should return true if directory exists', async () => {
    (fs.access as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
    await expect(directoryExists('/some/path')).resolves.toBe(true);
  });

  it('should return false if directory does not exist', async () => {
    (fs.access as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('not found'));
    await expect(directoryExists('/some/path')).resolves.toBe(false);
  });
});
