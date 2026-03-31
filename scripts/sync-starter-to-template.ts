import { execSync } from 'child_process';
import fs from 'fs-extra';
import { glob } from 'glob';
import * as path from 'path';
import { fileURLToPath } from 'url';

import {
  logger,
  logRootError as _logRootError,
  logRootInfo as _logRootInfo,
  logRootSuccess as _logRootSuccess,
} from './monorepo-logger';

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

  logger.startGroup('Sync apps/starter to packages/cli/template');
  try {
    // 0. Ensure shared-utils are inlined in the starter before copying
    logger.info('Inlining utilities into app');
    execSync('pnpm inline:shared-utils', {
      cwd: root,
      stdio: ['pipe', 'pipe', 'inherit'], // Hide pnpm stdout/stderr, show only errors
    });

    // 1. Remove any existing template directory before copying
    logger.info('Clearing template cache');
    await fs.remove(templateDest);

    // 2. Copy the starter app to the template destination
    logger.info('Syncing starter → template');
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
        const basename = path.basename(srcPath);
        if (ignore.some(dir => basename === dir)) {
          return false;
        }

        // Exclude ONLY the root project.json, but keep apps/web/project.json
        if (basename === 'project.json') {
          const relativePath = path.relative(starterSrc, srcPath);
          // Only exclude if it's directly in root (no path separators)
          if (!relativePath.includes(path.sep)) {
            return false;
          }
        }

        return true;
      },
    });

    // 3. Ensure the template directory exists after copy
    if (!(await fs.pathExists(templateDest))) {
      logger.error(
        'Failed to copy the template directory. Please check the source and destination paths.'
      );
      process.exit(1);
    }

    // 4. Patch package.json: update scripts, add metadata, and replace workspace deps
    logger.info('Updating dependencies & scripts');
    const pkgPath = path.join(templateDest, 'package.json');
    const pkgRaw = await fs.readFile(pkgPath, 'utf8');
    const pkg = JSON.parse(pkgRaw) as {
      scripts?: Record<string, string>;
      [key: string]: unknown;
    };

    // Replace workspace dependencies with concrete versions from the monorepo
    // BUT exclude @vite-powerflow/shared-utils as it will be inlined
    try {
      const depsToReplace: Record<string, string> = {};
      const allDeps = {
        ...(pkg.dependencies ?? {}),
        ...(pkg.devDependencies ?? {}),
      };

      for (const [name, version] of Object.entries(allDeps)) {
        if (typeof version === 'string' && version.startsWith('workspace:')) {
          // Skip @vite-powerflow/shared-utils as it will be inlined
          if (name === '@vite-powerflow/shared-utils') {
            logger.detail(`Skipping ${name} (will be inlined)`);
            continue;
          }

          const localVersion = await getPackageVersion(name);
          depsToReplace[name] = `^${localVersion}`;
        }
      }

      const replaceWorkspaceDeps = (deps: Record<string, string> | undefined) => {
        if (!deps) return;
        for (const key in deps) {
          if (deps[key].startsWith('workspace:')) {
            // Remove @vite-powerflow/shared-utils completely as it will be inlined
            if (key === '@vite-powerflow/shared-utils') {
              delete deps[key];
              logger.detail(`Removed ${key} (will be inlined)`);
              continue;
            }

            if (depsToReplace[key]) {
              deps[key] = depsToReplace[key];
              logger.detail(`Replaced ${key} with version ${depsToReplace[key]}`);
            } else {
              logger.warn(`Workspace dependency ${key} not found in replacement map`);
            }
          }
        }
      };

      replaceWorkspaceDeps(pkg.dependencies as Record<string, string> | undefined);
      replaceWorkspaceDeps(pkg.devDependencies as Record<string, string> | undefined);
    } catch (versionError) {
      logger.error('Failed to replace workspace dependencies');
      logger.error(versionError instanceof Error ? versionError.message : String(versionError));
      process.exit(1);
    }

    // 5. Clean tsconfig.json by removing 'extends' for standalone usage
    logger.info('Configuring TypeScript');
    const tsconfigPath = path.join(templateDest, 'tsconfig.json');
    if (await fs.pathExists(tsconfigPath)) {
      const tsconfigRaw = await fs.readFile(tsconfigPath, 'utf-8');
      if (tsconfigRaw.includes('"extends"')) {
        // Remove extends line while preserving exact formatting
        const cleanedTsconfig = tsconfigRaw.replace(/^\s*"extends":\s*"[^"]+",?\s*\n/gm, '');
        await fs.writeFile(tsconfigPath, cleanedTsconfig, 'utf8');
      }
    }

    // 6. Transform project.json files to use template-compatible names
    logger.info('Updating NX project names');
    const projectJsonFiles = await glob(path.join(templateDest, '**/project.json'), { dot: true });
    for (const projectJsonFile of projectJsonFiles) {
      try {
        const projRaw = await fs.readFile(projectJsonFile, 'utf-8');
        const proj = JSON.parse(projRaw) as { name?: string };

        // Replace @vite-powerflow/ prefix with a placeholder that will be replaced during instantiation
        const projectName = typeof proj.name === 'string' ? proj.name : undefined;
        if (projectName?.startsWith('@vite-powerflow/')) {
          proj.name = projectName.replace('@vite-powerflow/', '@template-app/');
          await fs.writeFile(projectJsonFile, JSON.stringify(proj, null, 2) + '\n', 'utf-8');
          logger.detail(`Updated project name in ${path.relative(templateDest, projectJsonFile)}`);
        }
      } catch (e) {
        logger.error(`Failed to patch ${projectJsonFile}: ${e}`);
      }
    }

    // 7. Transform package.json scripts for template usage
    // Root template should NOT use Nx for dev server (and generally should proxy to apps/web)
    const isRootPackage = pkgPath === path.join(templateDest, 'package.json');

    if (isRootPackage) {
      logger.info('Syncing package scripts');
      const starterPkgPath = path.join(starterSrc, 'package.json');
      const starterPkgRaw = await fs.readFile(starterPkgPath, 'utf8');
      const starterPkg = JSON.parse(starterPkgRaw) as {
        scripts?: Record<string, string>;
        devDependencies?: Record<string, string>;
      };

      pkg.scripts = {
        ...(starterPkg.scripts ?? {}),
        // Dev server should run directly via Vite for the web app
        'web:dev': 'pnpm --filter @template-app/web dev',
      };

      // Keep starter root tooling dependencies in the template root
      pkg.devDependencies = {
        ...(pkg.devDependencies as Record<string, string> | undefined),
        ...(starterPkg.devDependencies ?? {}),
      };

      logger.detail('Root scripts now mirror starter package.json (SSOT)');
    }
    logger.endGroup();
    logger.success('Template synchronized successfully');
  } catch (err) {
    logger.endGroup();
    logger.error('Template synchronization failed');
    logger.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
})();
