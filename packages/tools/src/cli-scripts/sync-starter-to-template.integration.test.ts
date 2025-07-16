import dircompare from 'dir-compare';
import fs from 'fs-extra';
import path from 'path';
import { dir as tmpDir } from 'tmp-promise';
import { describe, expect, it } from 'vitest';

import { getMonorepoRoot } from '@/shared/getMonorepoRoot';

// Unique exclusion list (should match sync-starter-to-template)
const IGNORED = ['node_modules', '.git', '.DS_Store', 'template', '.turbo'];
const shouldCopy = (srcPath: string) => !IGNORED.some(dir => path.basename(srcPath) === dir);
const excludeFilter = IGNORED.join(',');

describe('sync-starter-to-template script', () => {
  it('should have identical structure and content between starter and a temp copy (excluding ignored files)', async () => {
    const monorepoRoot = await getMonorepoRoot();
    const starterDir = path.join(monorepoRoot, 'apps/starter');
    // Create a temporary directory
    const { path: tempDir, cleanup } = await tmpDir({ unsafeCleanup: true });
    try {
      // Copy starter to tempDir with the same filter
      await fs.copy(starterDir, tempDir, { filter: shouldCopy });
      // Compare starter and tempDir
      const res = await dircompare.compare(starterDir, tempDir, {
        compareContent: true,
        excludeFilter,
      });
      expect(res.same).toBe(true);
    } finally {
      await cleanup();
    }
  });
});
