import { execSync } from 'child_process';
import fs from 'fs-extra';
import * as path from 'path';
import { fileURLToPath } from 'url';

import { TemplatePkgJson } from './types/package-json';
import { getLatestReleaseCommitWithShort } from './git-utils';
import { logRootError, logRootInfo, logRootSuccess } from './monorepo-logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to read a package's version from the monorepo
async function getPackageVersion(packageName: string): Promise<string> {
  const packagePath = path.join(
    __dirname,
    '..',
    'packages',
    packageName.replace('@vite-powerflow/', ''),
    'package.json'
  );
  if (await fs.pathExists(packagePath)) {
    const pkgRaw = await fs.readFile(packagePath, 'utf8');
    const pkg = JSON.parse(pkgRaw) as { version: string };
    return pkg.version;
  }
  throw new Error(`Could not find package.json for ${packageName}`);
}

void (async () => {
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
      filter: (srcPath: string) => {
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
          'CHANGELOG.md',
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

    // 4. Patch package.json: update scripts, add metadata, and replace workspace deps
    logRootInfo(
      'Patching package.json: scripts, metadata, and replacing workspace dependencies...'
    );
    const pkgPath = path.join(templateDest, 'package.json');
    const pkgRaw = await fs.readFile(pkgPath, 'utf8');
    const pkg = JSON.parse(pkgRaw) as TemplatePkgJson;

    // Replace workspace dependencies with concrete versions from the monorepo
    try {
      const depsToReplace: Record<string, string> = {};
      const allDeps = {
        ...(pkg.dependencies ?? {}),
        ...(pkg.devDependencies ?? {}),
      };

      for (const [name, version] of Object.entries(allDeps)) {
        if (typeof version === 'string' && version.startsWith('workspace:')) {
          const localVersion = await getPackageVersion(name);
          depsToReplace[name] = `^${localVersion}`;
        }
      }

      const replaceWorkspaceDeps = (deps: Record<string, string> | undefined) => {
        if (!deps) return;
        for (const key in deps) {
          if (deps[key].startsWith('workspace:')) {
            if (depsToReplace[key]) {
              deps[key] = depsToReplace[key];
              logRootInfo(`  - Replaced ${key} with version ${depsToReplace[key]}`);
            } else {
              logRootInfo(`  - Warning: workspace dependency ${key} not found in replacement map.`);
            }
          }
        }
      };

      replaceWorkspaceDeps(pkg.dependencies as Record<string, string> | undefined);
      replaceWorkspaceDeps(pkg.devDependencies as Record<string, string> | undefined);
    } catch (versionError) {
      logRootError('Failed to replace workspace dependencies.');
      logRootError(versionError instanceof Error ? versionError.message : String(versionError));
      process.exit(1);
    }

    // Add CLI template baseline commit metadata
    try {
      // Get the latest release commit hash using shared utility
      const { full, short } = getLatestReleaseCommitWithShort(root);

      // Always update starterSource with the latest release commit
      pkg.starterSource = {
        commit: full,
        syncedAt: new Date().toISOString(),
      };
      logRootInfo(`starterSource updated with commit: ${short}`);
    } catch {
      logRootInfo('Warning: Could not add CLI template baseline commit metadata');
    }

    // Add/update scripts
    pkg.scripts = {
      ...pkg.scripts,
      format: pkg.scripts?.format ?? 'prettier --check .',
      'validate:static': 'run-p format lint type-check',
      'validate:quick': 'run-s validate:static test',
      'validate:full': 'run-s validate:static test test:e2e',
      'validate:commit': 'npx lint-staged && pnpm test',
    };

    await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');

    // 5. Clean tsconfig.json by removing 'extends' for standalone usage
    logRootInfo("Cleaning tsconfig.json (removing 'extends')...");
    const tsconfigPath = path.join(templateDest, 'tsconfig.json');
    if (await fs.pathExists(tsconfigPath)) {
      const tsconfigRaw = await fs.readFile(tsconfigPath, 'utf-8');
      if (tsconfigRaw.includes('"extends"')) {
        // Remove extends line while preserving exact formatting
        const cleanedTsconfig = tsconfigRaw.replace(/^\s*"extends":\s*"[^"]+",?\s*\n/gm, '');
        await fs.writeFile(tsconfigPath, cleanedTsconfig, 'utf8');
      }
    }

    // 6. Create changeset for CLI if template was modified and we're not in CI
    if (!process.env.CI) {
      try {
        // Check if there are changes in the template directory
        const hasChanges = execSync('git status --porcelain packages/cli/template/', {
          encoding: 'utf8',
          cwd: root,
        }).trim();

        if (hasChanges) {
          logRootInfo('Template changes detected, creating changeset for CLI...');

          const changesetPath = path.join(root, '.changeset');
          const timestamp = Date.now();
          const changesetFile = path.join(changesetPath, `cli-template-sync-${timestamp}.md`);

          const changesetContent = `---
"@vite-powerflow/create": patch
---

Sync CLI template with latest starter changes

- Updated template with latest starter features and dependencies
- Template baseline updated to commit ${getLatestReleaseCommitWithShort(root).short}
`;

          await fs.writeFile(changesetFile, changesetContent, 'utf8');
          logRootInfo(`Created changeset: ${path.basename(changesetFile)}`);
        } else {
          logRootInfo('No template changes detected, skipping changeset creation');
        }
      } catch (changesetError) {
        logRootInfo('Warning: Could not create changeset for CLI template changes');
        logRootInfo(
          changesetError instanceof Error ? changesetError.message : String(changesetError)
        );
      }
    }

    logRootSuccess('Template synchronized successfully!');
  } catch (err) {
    logRootError('Template synchronization failed!');
    logRootError(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
})();
