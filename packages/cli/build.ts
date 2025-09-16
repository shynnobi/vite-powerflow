import { logError, logInfo, logSuccess } from '@vite-powerflow/shared-utils/logger';
import * as esbuild from 'esbuild';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Copy template to dist
async function copyTemplate(): Promise<void> {
  const templatePath = path.join(__dirname, 'template');
  const distTemplatePath = path.join(__dirname, 'dist', 'template');

  try {
    logInfo('Copying template to packages/cli/dist...');

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

    // Copy .gitignore as gitignore to avoid npm ignoring it
    const gitignoreSource = path.join(templatePath, '.gitignore');
    const gitignoreDest = path.join(distTemplatePath, 'gitignore');
    if (await fs.pathExists(gitignoreSource)) {
      await fs.copy(gitignoreSource, gitignoreDest);
      // Remove the original .gitignore from dist to avoid duplication
      const originalGitignoreInDist = path.join(distTemplatePath, '.gitignore');
      if (await fs.pathExists(originalGitignoreInDist)) {
        await fs.remove(originalGitignoreInDist);
      }
    }

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
    logInfo('Building the CLI tool...');
    // 1. Check template folder
    if (!(await fs.pathExists(templatePath))) {
      logError(
        'The template folder is missing in packages/cli! The build will fail if this folder is required.'
      );
      process.exit(1);
    }

    // 2. Copy template to dist
    await copyTemplate();

    // 3. Build the CLI
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
      ],
      sourcemap: true,
      minify: false,
      logLevel: 'info',
    });

    logSuccess('CLI tool built successfully!');
  } catch (err) {
    logError('Build failed');
    if (err instanceof Error) {
      logError(err.message);
    } else {
      logError(String(err));
    }
    process.exit(1);
  }
})();
