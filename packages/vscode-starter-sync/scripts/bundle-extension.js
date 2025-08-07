// esbuild bundler for VS Code extension (Node.js target)
const esbuild = require('esbuild');
const path = require('path');

esbuild
  .build({
    entryPoints: [path.resolve(__dirname, '../src/extension.ts')],
    bundle: true,
    platform: 'node',
    target: ['node18'],
    outfile: path.resolve(__dirname, '../dist/extension.js'),
    external: [
      'vscode', // VS Code API is provided at runtime
    ],
    sourcemap: true,
    minify: false,
    logLevel: 'info',
  })
  .catch(() => process.exit(1));
