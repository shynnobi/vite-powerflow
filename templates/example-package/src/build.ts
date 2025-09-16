import { logError, logInfo, logSuccess } from '@vite-powerflow/shared-utils/logger';
import * as esbuild from 'esbuild';

(async () => {
  logInfo('Building @vite-powerflow/example-package...');
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
      logSuccess('Build completed for @vite-powerflow/example-package!');
    })
    .catch(error => {
      logError('Build failed for @vite-powerflow/example-package');
      logError(error instanceof Error ? error.message : String(error));
      process.exit(1);
    });
})();
