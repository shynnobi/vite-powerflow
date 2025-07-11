import fs from 'fs-extra';
import * as path from 'path';
import { getMonorepoRoot } from '../utils/getMonorepoRoot.js';

(async () => {
  const monorepoRoot = await getMonorepoRoot();
  const starterSrc = path.join(monorepoRoot, 'packages/starter');
  const templateDest = path.join(monorepoRoot, 'packages/cli/template');

  console.log('📦 Synchronizing template from packages/starter/ to packages/cli/template/...');

  // Remove existing template
  await fs.remove(templateDest);

  // Copy starter to template
  await fs.copy(starterSrc, templateDest, {
    filter: srcPath => {
      const ignore = [
        'node_modules',
        '.git',
        '.DS_Store',
        '.turbo',
        'coverage',
        'dist',
        'test-results',
        'html',
      ];
      return !ignore.some(dir => path.basename(srcPath) === dir);
    },
  });

  console.log('✅ Template synchronized successfully!');
})();
