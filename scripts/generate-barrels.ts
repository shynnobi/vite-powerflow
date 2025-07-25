#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { logRootError, logRootInfo, logRootSuccess } from './monorepo-logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Generate the content of a barrel file from a list of files
function generateBarrelContent(files: string[]): string {
  return `/**
 * @file Automatically generated by generate-barrels.ts
 *
 * Warning: Never export test or dev files here!
 */

${files.map(file => `export * from './${file}';`).join('\n')}
// DO NOT export .test.ts or dev files here!
`;
}

// 2. Generate a barrel file in a given directory
function generateBarrel(directory: string): { success: boolean; fileCount: number } {
  const files = fs
    .readdirSync(directory, { withFileTypes: true })
    .filter(dirent => dirent.isFile())
    .map(dirent => dirent.name)
    .filter(
      name =>
        name.endsWith('.ts') &&
        !name.endsWith('.test.ts') &&
        !name.endsWith('.spec.ts') &&
        name !== 'index.ts'
    )
    .map(name => name.replace('.ts', ''));

  if (files.length === 0) {
    return { success: false, fileCount: 0 };
  }

  const barrelContent = generateBarrelContent(files);
  fs.writeFileSync(path.join(directory, 'index.ts'), barrelContent);

  return { success: true, fileCount: files.length };
}

// 3. Check if a barrel is manual (not auto-generated)
function isManualBarrel(barrelPath: string): boolean {
  if (!fs.existsSync(barrelPath)) {
    return false;
  }
  const content = fs.readFileSync(barrelPath, 'utf-8');
  return !content.includes('Automatically generated');
}

// 4. Generate barrels for a given package
function generateBarrelsForPackage(packagePath: string) {
  const srcPath = path.join(packagePath, 'src');
  const packageName = path.basename(packagePath);

  if (!fs.existsSync(srcPath)) {
    logRootInfo(`No src directory found in ${packageName}, skipping`);
    return;
  }

  logRootInfo(`Generating barrels for ${packageName}...`);

  let totalBarrelsGenerated = 0;
  let totalFilesExported = 0;
  try {
    // 4.1. Find all subdirectories in src/
    const subdirs = fs
      .readdirSync(srcPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const subdir of subdirs) {
      const subdirPath = path.join(srcPath, subdir);
      const barrelPath = path.join(subdirPath, 'index.ts');

      // 4.2. Skip manual barrels
      if (isManualBarrel(barrelPath)) {
        logRootInfo(`Skipping ${subdir}: manual barrel`);
        continue;
      }

      // 4.3. Generate the barrel if needed
      const { success, fileCount } = generateBarrel(subdirPath);

      if (success) {
        logRootSuccess(`Generated barrel for ${subdir} (${fileCount} files)`);
        totalBarrelsGenerated++;
        totalFilesExported += fileCount;
      } else {
        logRootInfo(`No files to export in ${subdir}`);
      }
    }
  } catch (error: any) {
    logRootError(`Error generating barrels for ${packageName}: ${error.message}`);
    process.exit(1);
  }

  logRootSuccess(
    `Barrel generation complete! Generated ${totalBarrelsGenerated} barrels with ${totalFilesExported} total exports`
  );
}

// 5. Main entry point: parse args and orchestrate
function main() {
  const args = process.argv.slice(2);
  const isAll = args.includes('--all');
  const root = path.resolve(__dirname, '..');

  // 5.1. If --all, process all packages
  if (isAll) {
    logRootInfo('Generating barrels for all packages...');
    const packagesDir = path.join(root, 'packages');
    if (!fs.existsSync(packagesDir)) {
      logRootError('packages directory not found');
      return;
    }

    const packages = fs
      .readdirSync(packagesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => path.join(packagesDir, dirent.name));

    for (const pkg of packages) {
      generateBarrelsForPackage(pkg);
    }

    logRootSuccess('All packages processed!');
  } else {
    // 5.2. Else, process current package only
    const currentPackagePath = process.cwd();
    generateBarrelsForPackage(currentPackagePath);
  }
}

main();
