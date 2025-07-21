import fs from 'fs-extra';
import * as path from 'path';
import { fileURLToPath } from 'url';

import { logRootError, logRootInfo, logRootSuccess } from './monorepo-logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  // 1. Setup source and destination paths
  const root = path.resolve(__dirname, '..');
  const starterSrc = path.join(root, 'apps/starter');
  const templateDest = path.join(root, 'packages/cli/template');

  logRootInfo('—— Sync apps/starter to packages/cli/template ——');
  try {
    // 1. Remove any existing template directory before copying
    logRootInfo('Deleting existing template folder...');
    await fs.remove(templateDest);

    // 2. Copy the starter app to the template destination
    logRootInfo('Copying folders...');
    await fs.copy(starterSrc, templateDest, {
      filter: srcPath => {
        const ignore = [
          '.changeset',
          '.DS_Store',
          '.git',
          '.turbo',
          'coverage',
          'dist',
          'html',
          'node_modules',
          'stats.html',
          'test-results',
          'tsconfig.base.json',
          'tsconfig.tsbuildinfo',
        ];
        // Ignore explicit unwanted files/folders
        return !ignore.some(dir => path.basename(srcPath) === dir);
      },
    });

    // 3. Ensure the template directory exists after copy
    if (!(await fs.pathExists(templateDest))) {
      logRootError(
        'Failed to copy the template directory. Please check the source and destination paths.'
      );
      process.exit(1);
    }

    // 4. Rename .vscode to _vscode in the template (for npm compatibility)
    const vscodeSrc = path.join(templateDest, '.vscode');
    const vscodeDest = path.join(templateDest, '_vscode');
    if (await fs.pathExists(vscodeSrc)) {
      await fs.move(vscodeSrc, vscodeDest, { overwrite: true });
      logRootInfo('Renamed .vscode to _vscode in template');
    }

    // 5. Patch package.json scripts
    logRootInfo('Patching package.json validate scripts');
    const pkgPath = path.join(templateDest, 'package.json');
    const pkg = await fs.readJson(pkgPath);
    pkg.scripts = {
      ...pkg.scripts,
      format: pkg.scripts.format || 'prettier --check .',
      'validate:static': 'run-p format lint type-check',
      'validate:quick': 'run-s validate:static test',
      'validate:full': 'run-s validate:static test test:e2e',
      'validate:commit': 'npx lint-staged && pnpm test',
    };
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });

    // 6. Clean tsconfig.json by removing 'extends' for standalone usage
    logRootInfo('Cleaning tsconfig.json (removing extends)...');
    const tsconfigPath = path.join(templateDest, 'tsconfig.json');
    if (await fs.pathExists(tsconfigPath)) {
      const tsconfigRaw = await fs.readFile(tsconfigPath, 'utf-8');
      const tsconfig = JSON.parse(tsconfigRaw);
      if (tsconfig.extends) {
        delete tsconfig.extends;
        await fs.writeFile(tsconfigPath, JSON.stringify(tsconfig, null, 2));
      }
    }

    logRootSuccess('Template synchronized successfully!');
  } catch (err) {
    logRootError('Template synchronization failed!');
    logRootError(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
})();
