import fs from 'fs-extra';
import { Ora } from 'ora';
import * as path from 'path';

import { getMonorepoRoot } from '../lib/getMonorepoRoot';
import { createSpinner, logError } from '../lib/logger';

(async () => {
  const monorepoRoot = await getMonorepoRoot();
  const starterSrc = path.join(monorepoRoot, 'apps/starter');
  const templateDest = path.join(monorepoRoot, 'packages/cli/template');

  const spinner = createSpinner(
    'Synchronizing template from apps/starter/ to packages/cli/template/...'
  );

  // Utility to set spinner text
  function setSpinnerText(spinner: Ora, text: string) {
    spinner.text = text;
  }

  try {
    // Remove any existing template directory before copying
    setSpinnerText(spinner, 'Removing existing template...');
    await fs.remove(templateDest);

    // Copy the starter app to the template destination
    setSpinnerText(spinner, 'Copying starter to template...');
    await fs.copy(starterSrc, templateDest, {
      filter: srcPath => {
        const ignore = [
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
        ];
        return !ignore.some(dir => path.basename(srcPath) === dir);
      },
    });

    // Ensure the template directory exists after copy
    setSpinnerText(spinner, 'Verifying template directory...');
    if (!(await fs.pathExists(templateDest))) {
      spinner.fail('Template sync failed: template directory does not exist!');
      process.exit(1);
    }

    // Patch package.json scripts and remove workspace:* dependencies
    setSpinnerText(spinner, 'Patching package.json scripts and cleaning workspace dependencies...');
    const pkgPath = path.join(templateDest, 'package.json');
    const pkg = await fs.readJson(pkgPath);
    pkg.scripts = {
      ...pkg.scripts,
      format: pkg.scripts.format || 'prettier --check .',
      'validate:static': 'run-p format lint type-check',
      'validate:quick': 'run-s validate:static test',
      'validate:full': 'run-s validate:static test test:e2e',
      'validate:precommit': 'npx lint-staged && pnpm test',
    };
    if (pkg.dependencies) {
      Object.keys(pkg.dependencies).forEach(dep => {
        if (pkg.dependencies[dep] === 'workspace:*') {
          delete pkg.dependencies[dep];
        }
      });
    }
    if (pkg.devDependencies) {
      Object.keys(pkg.devDependencies).forEach(dep => {
        if (pkg.devDependencies[dep] === 'workspace:*') {
          delete pkg.devDependencies[dep];
        }
      });
    }
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });

    // Clean tsconfig.json by removing 'extends' for standalone usage
    setSpinnerText(spinner, 'Cleaning tsconfig.json (removing extends)...');
    const tsconfigPath = path.join(templateDest, 'tsconfig.json');
    if (await fs.pathExists(tsconfigPath)) {
      const tsconfigRaw = await fs.readFile(tsconfigPath, 'utf-8');
      const tsconfig = JSON.parse(tsconfigRaw);
      if (tsconfig.extends) {
        delete tsconfig.extends;
        await fs.writeFile(tsconfigPath, JSON.stringify(tsconfig, null, 2));
      }
    }

    spinner.succeed('Template synchronized successfully!');
  } catch (err) {
    spinner.fail('Template synchronization failed!');
    logError(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
})();
