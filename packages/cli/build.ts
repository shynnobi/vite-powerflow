import * as esbuild from 'esbuild';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

import { logError, logInfo, logSuccess, startGroup, endGroup } from './src/utils/shared/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Clean dist directory before building
async function cleanDist(): Promise<void> {
  const distPath = path.join(__dirname, 'dist');
  if (await fs.pathExists(distPath)) {
    await fs.remove(distPath);
    logInfo('Cleaning output directory');
  }
}

// Copy template to dist
async function copyTemplate(): Promise<void> {
  const templatePath = path.join(__dirname, 'template');
  const distTemplatePath = path.join(__dirname, 'dist', 'template');

  try {
    logInfo('Bundling template');

    // Ensure dist directory exists
    await fs.ensureDir(path.dirname(distTemplatePath));

    // Copy template with all files including hidden ones
    await fs.copy(templatePath, distTemplatePath, {
      overwrite: true,
    });

    // Make postinstall.sh executable if it exists
    const postinstallPath = path.join(distTemplatePath, 'scripts', 'postinstall.sh');
    if (await fs.pathExists(postinstallPath)) {
      await fs.chmod(postinstallPath, 0o755);
    }

    // Note: .gitignore is already named as 'gitignore' in the template source
    // to avoid npm ignoring it during package distribution

    logSuccess('Template copied successfully!');
  } catch (err) {
    logError('Template copy failed');
    if (err instanceof Error) {
      logError(err.message);
    } else {
      logError(String(err));
    }
    throw err;
  }
}

void (async () => {
  const templatePath = path.join(__dirname, 'template');

  try {
    startGroup('Building the Vite PowerFlow CLI');

    // 1. Clean dist directory
    await cleanDist();

    // 2. Check template folder
    if (!(await fs.pathExists(templatePath))) {
      logError('The template folder is missing in packages/cli! The build will fail if this folder is required.');
      process.exit(1);
    }

    // 3. Copy template to dist
    await copyTemplate();

    // 4. Build the CLI
    await esbuild.build({
      entryPoints: ['src/index.ts'],
      bundle: true,
      platform: 'node',
      target: 'node18',
      outfile: 'dist/index.js',
      format: 'esm',
      external: [
        'chalk',
        'commander',
        'enquirer',
        'find-up',
        'ora',
        'simple-git',
        'validator',
        '@sindresorhus/slugify',
        'fs-extra',
        // Note: @vite-powerflow/shared-utils is bundled, not externalized
      ],
      sourcemap: true,
      minify: false,
      logLevel: 'info',
    });

    endGroup();
    logSuccess('Vite PowerFlow CLI built successfully');
  } catch (err) {
    endGroup();
    logError('Build failed');
    if (err instanceof Error) {
      logError(err.message);
    } else {
      logError(String(err));
    }
    process.exit(1);
  }
})();
