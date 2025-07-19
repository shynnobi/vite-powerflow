import { describe, it, expect } from 'vitest';
import path from 'path';
import { getMonorepoRoot } from './getMonorepoRoot';

describe('getMonorepoRoot', () => {
  it('should return an absolute path as a string', async () => {
    const root = await getMonorepoRoot();
    expect(typeof root).toBe('string');
    expect(path.isAbsolute(root)).toBe(true);
  });
});
