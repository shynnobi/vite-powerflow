import { build } from 'esbuild';
import { resolve } from 'path';

// Use relative path from scripts folder
const projectRoot = resolve(__dirname, '..');

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
