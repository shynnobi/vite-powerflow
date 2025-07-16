import fs from 'fs';
import path from 'path';

import { logError, logInfo, logSuccess } from '../shared/logger.js';
import { getMonorepoRoot } from '../shared/getMonorepoRoot.js';
import { execSync } from 'child_process';

(async () => {
  const root = await getMonorepoRoot();
  const pkgsDir = path.join(root, 'packages');
  const appsDir = path.join(root, 'apps');

  function getInternalPackages(dir: string) {
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter(name => fs.statSync(path.join(dir, name)).isDirectory())
      .map(name => {
        const pkgJsonPath = path.join(dir, name, 'package.json');
        if (!fs.existsSync(pkgJsonPath)) return null;
        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
        // Use 'src' as the entry point for apps and 'dist' for packages
        const isApp = dir === appsDir;
        return {
          name: pkgJson.name as string,
          path: path.join(dir, name, isApp ? 'src' : 'dist'),
          isApp,
          projectPath: path.join(dir, name),
        };
      })
      .filter(Boolean) as Array<{
      name: string;
      path: string;
      isApp: boolean;
      projectPath: string;
    }>;
  }

  const pkgs = getInternalPackages(pkgsDir); // Only packages, not apps

  logInfo('Monorepo: Sync aliases and paths...');

  // Generate Vite aliases for internal packages only (not apps)
  const aliases: Record<string, string> = {};
  pkgs.forEach(pkg => {
    aliases[pkg.name] = pkg.path;
  });
  const outPath = path.join(root, 'vite.aliases.json');
  fs.writeFileSync(outPath, JSON.stringify(aliases, null, 2));
  logSuccess(`Vite aliases generated in vite.aliases.json`);

  const tsconfigPath = path.join(root, 'tsconfig.base.json');
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
  if (!tsconfig.compilerOptions) tsconfig.compilerOptions = {};
  if (!tsconfig.compilerOptions.paths) tsconfig.compilerOptions.paths = {};

  // Remove old @vite-powerflow/* path aliases
  Object.keys(tsconfig.compilerOptions.paths).forEach(key => {
    if (key.startsWith('@vite-powerflow/')) {
      delete tsconfig.compilerOptions.paths[key];
    }
  });

  // Add TypeScript path aliases for internal packages only (not apps)
  pkgs.forEach(pkg => {
    const relDist = path.relative(root, pkg.path).replace(/\\/g, '/');
    tsconfig.compilerOptions.paths[pkg.name] = [relDist + '/index.js'];
    tsconfig.compilerOptions.paths[`${pkg.name}/*`] = [relDist + '/*'];
  });
  fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
  logSuccess(`TypeScript paths updated in tsconfig.base.json`);

  const tsconfigRefPath = path.join(root, 'tsconfig.json');
  const tsconfigRef = JSON.parse(fs.readFileSync(tsconfigRefPath, 'utf-8'));

  // Update TypeScript project references for all internal packages only (exclude apps)
  tsconfigRef.references = pkgs.map(pkg => ({
    path: path.relative(root, pkg.projectPath).replace(/\\/g, '/'),
  }));
  fs.writeFileSync(tsconfigRefPath, JSON.stringify(tsconfigRef, null, 2));
  logSuccess(`TypeScript references updated in ts.config.json`);

  // Update or create vitest.config.ts so its test.projects array lists all internal packages and apps on a single line
  const vitestConfigPath = path.join(root, 'vitest.config.ts');
  const allProjects = [
    ...getInternalPackages(pkgsDir).map(
      pkg => './' + path.relative(root, pkg.projectPath).replace(/\\/g, '/')
    ),
    ...getInternalPackages(appsDir).map(
      app => './' + path.relative(root, app.projectPath).replace(/\\/g, '/')
    ),
  ];
  // Always overwrite vitest.config.ts with the latest projects list
  const projectsList = allProjects.map(p => `      '${p}'`).join(',\n');
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
  logSuccess('Vitest config generated in vitest.config.ts');

  // Format generated/modified files with Prettier
  const filesToFormat = [
    'tsconfig.base.json',
    'vite.aliases.json',
    'tsconfig.json',
    'vitest.config.ts',
  ];

  try {
    execSync(`npx prettier --write ${filesToFormat.join(' ')}`, { stdio: 'inherit', cwd: root });
    logSuccess('Prettier formatting applied to generated files.');
  } catch (err) {
    logError('Prettier formatting failed.');
  }
})();
