import * as esbuild from 'esbuild';
import { logInfo, logSuccess, logError } from './lib/logger';

(async () => {
  logInfo('Building @vite-powerflow/tools...');
  await esbuild
    .build({
      entryPoints: ['src/index.ts'],
      bundle: true,
      platform: 'node',
      target: 'node18',
      outdir: 'dist',
      format: 'esm',
      mainFields: ['module', 'main'],
      conditions: ['import', 'node'],
      external: [],
      sourcemap: true,
      minify: true,
      metafile: true,
      treeShaking: true,
      keepNames: true,
      legalComments: 'none',
    })
    .then(() => {
      logSuccess('Build completed for @vite-powerflow/tools!');
    })
    .catch(error => {
      logError('Build failed for @vite-powerflow/tools');
      logError(error instanceof Error ? error.message : String(error));
      process.exit(1);
    });
})();
