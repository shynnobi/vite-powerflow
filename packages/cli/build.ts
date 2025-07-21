import { logError, logInfo, logSuccess } from '@vite-powerflow/utils';
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

    // Copy .vscode as vscode to avoid npm ignoring it
    const vscodeSource = path.join(templatePath, '.vscode');
    const vscodeDest = path.join(distTemplatePath, 'vscode');
    if (await fs.pathExists(vscodeSource)) {
      await fs.copy(vscodeSource, vscodeDest);
      // Remove the original .vscode from dist to avoid duplication
      const originalVscodeInDist = path.join(distTemplatePath, '.vscode');
      if (await fs.pathExists(originalVscodeInDist)) {
        await fs.remove(originalVscodeInDist);
      }
    }

    logSuccess('Template copied successfully!');
  } catch (err) {
    logError('Template copy failed');
    logError(err instanceof Error ? err.message : String(err));
    throw err;
  }
}

(async () => {
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

    // 2. Build CLI with esbuild
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
    });

    // 3. Copy template to dist
    await copyTemplate();

    logSuccess('CLI built successfully!');
  } catch (err) {
    logError('CLI build failed');
    logError(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
})();
