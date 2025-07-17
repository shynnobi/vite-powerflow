#!/usr/bin/env tsx

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { logRootError, logRootInfo, logRootSuccess } from './monorepo-logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface InternalPackage {
  name: string;
  path: string;
  isApp: boolean;
  projectPath: string;
}

function getInternalPackages(dir: string, appsDir: string): InternalPackage[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter(name => fs.statSync(path.join(dir, name)).isDirectory())
    .map(name => {
      const pkgJsonPath = path.join(dir, name, 'package.json');
      if (!fs.existsSync(pkgJsonPath)) return null;
      const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
      const isApp = dir === appsDir;
      return {
        name: pkgJson.name,
        path: path.join(dir, name, isApp ? 'src/dist' : 'dist'),
        isApp,
        projectPath: path.join(dir, name),
      };
    })
    .filter(Boolean) as InternalPackage[];
}

// 1. Main async function
(async () => {
  // 1.1. Setup root and workspace paths
  const root = path.resolve(__dirname, '..');
  const pkgsDir = path.join(root, 'packages');
  const appsDir = path.join(root, 'apps');

  // 1.2. Get all internal packages
  const pkgs = getInternalPackages(pkgsDir, appsDir);

  logRootInfo('Monorepo: Sync aliases and paths...');

  // 2. Generate Vite aliases for internal packages only (not apps)
  const aliases: Record<string, string> = {};
  pkgs.forEach(pkg => {
    aliases[pkg.name] = pkg.path;
  });
  const outPath = path.join(root, 'vite.aliases.json');
  fs.writeFileSync(outPath, JSON.stringify(aliases, null, 2));
  logRootSuccess(`Vite aliases generated in vite.aliases.json`);

  // 3. Update tsconfig.base.json with TypeScript path aliases
  const tsconfigPath = path.join(root, 'tsconfig.base.json');
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
  if (!tsconfig.compilerOptions) tsconfig.compilerOptions = {};
  if (!tsconfig.compilerOptions.paths) tsconfig.compilerOptions.paths = {};

  // 3.1. Remove old path aliases for all internal packages and apps
  Object.keys(tsconfig.compilerOptions.paths).forEach((key: string) => {
    const paths = tsconfig.compilerOptions.paths[key];
    if (Array.isArray(paths) && paths.length > 0) {
      const firstPath = paths[0];
      if (firstPath.startsWith('packages/') || firstPath.startsWith('apps/')) {
        delete tsconfig.compilerOptions.paths[key];
      }
    }
  });

  // 3.2. Add TypeScript path aliases for internal packages only (not apps)
  pkgs.forEach(pkg => {
    const relDist = path.relative(root, pkg.path).replace(/\\/g, '/');
    tsconfig.compilerOptions.paths[pkg.name] = [relDist + '/index.js'];
    tsconfig.compilerOptions.paths[`${pkg.name}/*`] = [relDist + '/*']; // Always an array
  });
  fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
  logRootSuccess(`TypeScript paths updated in tsconfig.base.json`);

  // 4. Update tsconfig.json with project references
  const tsconfigRefPath = path.join(root, 'tsconfig.json');
  const tsconfigRef = JSON.parse(fs.readFileSync(tsconfigRefPath, 'utf-8'));

  // 4.1. Update TypeScript project references for all internal packages only (exclude apps)
  tsconfigRef.references = pkgs.map(pkg => ({
    path: path.relative(root, pkg.projectPath).replace(/\\/g, '/'),
  }));
  fs.writeFileSync(tsconfigRefPath, JSON.stringify(tsconfigRef, null, 2));
  logRootSuccess(`TypeScript references updated in tsconfig.json`);

  // 5. Update or create vitest.config.ts with all internal packages and apps
  const vitestConfigPath = path.join(root, 'vitest.config.ts');
  const allProjects = [
    ...getInternalPackages(pkgsDir, appsDir).map(
      pkg => './' + path.relative(root, pkg.projectPath).replace(/\\/g, '/')
    ),
    ...getInternalPackages(appsDir, appsDir).map(
      app => './' + path.relative(root, app.projectPath).replace(/\\/g, '/')
    ),
  ];
  const projectsList = allProjects.map(p => `      ${JSON.stringify(p)}`).join(',\n');
  const vitestConfig = `// AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
${projectsList}
    ],
  },
});
`;
  fs.writeFileSync(vitestConfigPath, vitestConfig);
  logRootSuccess('Vitest config generated in vitest.config.ts');

  // 6. Format generated/modified files with Prettier
  const filesToFormat = [
    'tsconfig.base.json',
    'vite.aliases.json',
    'tsconfig.json',
    'vitest.config.ts',
  ];

  try {
    execSync(`npx prettier --write ${filesToFormat.join(' ')}`, { stdio: 'pipe', cwd: root });
    // logRootSuccess('Prettier formatting applied to generated files.');
  } catch (err) {
    logRootError('Prettier formatting failed.');
    if (err && err.stderr) {
      console.error(err.stderr.toString());
    }
  }
  // 7. End of main async function
})();
