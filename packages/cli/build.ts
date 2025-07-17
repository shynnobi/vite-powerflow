import { getMonorepoRoot, logError, logInfo, logSuccess } from '@vite-powerflow/tools';
import * as esbuild from 'esbuild';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate package aliases for esbuild
async function generateAliases(): Promise<Record<string, string>> {
  const aliases: Record<string, string> = {};
  const workspaceRoot = await getMonorepoRoot();
  const packagesDir = path.join(workspaceRoot, 'packages');

  try {
    await fs.access(packagesDir);
  } catch {
    logError('Packages directory not found: ' + packagesDir);
    return aliases;
  }

  const packages = await fs.readdir(packagesDir, { withFileTypes: true });

  for (const pkg of packages) {
    if (!pkg.isDirectory()) continue;

    const packagePath = path.join(packagesDir, pkg.name);
    const packageJsonPath = path.join(packagePath, 'package.json');

    try {
      const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(packageJsonContent);

      // Only alias @vite-powerflow packages
      if (packageJson.name && packageJson.name.startsWith('@vite-powerflow/')) {
        const possibleSourcePaths = [
          path.join(packagePath, 'src/index.ts'),
          path.join(packagePath, 'src/main.ts'),
          path.join(packagePath, 'index.ts'),
          path.join(packagePath, 'main.ts'),
        ];

        for (const sourcePath of possibleSourcePaths) {
          try {
            await fs.access(sourcePath);
            aliases[packageJson.name] = sourcePath;
            break;
          } catch {
            // Try next candidate
          }
        }
      }
    } catch (error) {
      logError(`Could not process package ${pkg.name}: ${error}`);
    }
  }

  return aliases;
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

    // 2. Generate aliases dynamically
    const aliases = await generateAliases();

    // 3. Build CLI with esbuild
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
      alias: aliases,
      sourcemap: true,
      minify: false,
    });

    logSuccess('CLI built successfully!');
  } catch (err) {
    logError('CLI build failed');
    logError(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
})();
