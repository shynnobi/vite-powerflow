import { tsPathsPlugin } from '@awalgawe/esbuild-typescript-paths-plugin';
import * as esbuild from 'esbuild';
import { logError, logInfo, logSuccess } from '@/shared/logger';

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
      external: [],
      sourcemap: true,
      minify: true,
      plugins: [tsPathsPlugin()],
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
