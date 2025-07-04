import fs from 'fs-extra';
import path from 'path';
import { beforeAll, describe, expect, it } from 'vitest';

import { copyConfigFile } from './copyConfigFile.js';
import { getMonorepoRoot } from './getMonorepoRoot.js';

let ROOT: string;

beforeAll(async () => {
  ROOT = await getMonorepoRoot();
});

const configFiles = [
  '.editorconfig',
  '.prettierrc',
  '.prettierignore',
  'Dockerfile',
  'docker-compose.yml',
];

describe('copyConfigFile', () => {
  for (const filename of configFiles) {
    it(`copies config file "${filename}" to packages/starter and preserves content`, async () => {
      const source = path.join(ROOT, filename);
      const dest = path.join(ROOT, 'packages', 'starter', filename);

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
  }
});
