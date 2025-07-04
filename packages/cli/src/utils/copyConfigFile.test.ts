import fs from 'fs-extra';
import path from 'path';
import tmp from 'tmp-promise';
import { beforeAll, describe, expect, it } from 'vitest';

import { copyConfigFile } from './copyConfigFile.js';
import { getMonorepoRoot } from './getMonorepoRoot.js';

let ROOT: string;

beforeAll(async () => {
  ROOT = await getMonorepoRoot();
});

// Test copying .editorconfig from monorepo root to a temp dir

describe('copyConfigFile', () => {
  it('copies .editorconfig to the target directory and preserves content', async () => {
    const { path: tempDir, cleanup } = await tmp.dir({ unsafeCleanup: true });
    const source = path.join(ROOT, '.editorconfig');
    const dest = path.join(tempDir, '.editorconfig');

    await copyConfigFile(source, dest);

    expect(await fs.pathExists(dest)).toBe(true);
    const srcContent = await fs.readFile(source, 'utf8');
    const destContent = await fs.readFile(dest, 'utf8');
    expect(destContent).toBe(srcContent);

    await cleanup();
  });

  it('copies .editorconfig to packages/starter and preserves content', async () => {
    const source = path.join(ROOT, '.editorconfig');
    const dest = path.join(ROOT, 'packages', 'starter', '.editorconfig');

    // Remove destination file if it already exists
    if (await fs.pathExists(dest)) {
      await fs.remove(dest);
    }

    await copyConfigFile(source, dest);

    expect(await fs.pathExists(dest)).toBe(true);
    const srcContent = await fs.readFile(source, 'utf8');
    const destContent = await fs.readFile(dest, 'utf8');
    expect(destContent).toBe(srcContent);

    // Cleanup
    await fs.remove(dest);
  });
});
