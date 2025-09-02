#!/usr/bin/env tsx

import { execa } from 'execa';
import fs from 'fs-extra';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

async function checkPackageExists(packageName: string, version: string): Promise<boolean> {
  try {
    // Remove the ^ from version for npm view
    const cleanVersion = version.replace(/^\^/, '');
    await execa('pnpm', ['view', `${packageName}@${cleanVersion}`, 'version'], { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

async function validatePublishedVersions(): Promise<void> {
  const templatePath = path.join(__dirname, '..', 'packages/cli/template/package.json');

  if (!(await fs.pathExists(templatePath))) {
    console.log('Template package.json not found, skipping validation');
    return;
  }

  const pkgRaw = await fs.readFile(templatePath, 'utf8');
  const pkg = JSON.parse(pkgRaw) as PackageJson;

  const allDeps = {
    ...(pkg.dependencies ?? {}),
    ...(pkg.devDependencies ?? {}),
  };

  const errors: string[] = [];

  for (const [name, version] of Object.entries(allDeps)) {
    if (name.startsWith('@vite-powerflow/')) {
      const exists = await checkPackageExists(name, version);
      if (!exists) {
        errors.push(`${name}@${version} is not published on npm`);
      }
    }
  }

  if (errors.length > 0) {
    console.error('❌ Validation failed:');
    errors.forEach(error => console.error(`  - ${error}`));
    console.error('\n💡 Solutions:');
    console.error('  1. Publish the missing packages first');
    console.error('  2. Update the template to use published versions');
    console.error('  3. Run this validation after publishing');
    process.exit(1);
  }

  console.log('✅ All @vite-powerflow packages are published and available');
}

validatePublishedVersions().catch(error => {
  console.error('Validation failed:', error);
  process.exit(1);
});
