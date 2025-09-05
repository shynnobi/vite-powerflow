import { build } from 'esbuild';
import { resolve } from 'path';

// Use relative path from project root
const projectRoot = resolve(process.cwd());

build({
  entryPoints: [resolve(projectRoot, 'src/extension.ts')],
  bundle: true,
  platform: 'node',
  target: ['node18'],
  format: 'cjs',
  outfile: resolve(projectRoot, 'dist/extension.js'),
  external: ['vscode'],
  sourcemap: true,
  minify: false,
  logLevel: 'info',
}).catch(() => process.exit(1));
