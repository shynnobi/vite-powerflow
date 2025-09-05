import { build } from 'esbuild';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// Use relative path from scripts folder (ES module compatible)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
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
