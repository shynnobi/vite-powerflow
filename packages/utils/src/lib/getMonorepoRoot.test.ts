import path from 'path';
import { describe, expect, it } from 'vitest';

import { getMonorepoRoot } from './getMonorepoRoot';

describe('getMonorepoRoot', () => {
  it('should return an absolute path as a string', async () => {
    const root = await getMonorepoRoot();
    expect(typeof root).toBe('string');
    expect(path.isAbsolute(root)).toBe(true);
  });
});
