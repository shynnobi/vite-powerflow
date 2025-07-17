import { readFileSync } from 'fs';
import * as path from 'path';
import { defineConfig } from 'vitest/config';

const tsconfig = JSON.parse(readFileSync(path.resolve(__dirname, 'tsconfig.json'), 'utf-8'));

const aliases = Object.entries(tsconfig.compilerOptions.paths || {}).reduce((acc, [key, value]) => {
  const aliasKey = key.replace(/\/\*$/, '');
  const aliasPath = value[0].replace(/\/\*$/, '');
  acc[aliasKey] = path.resolve(__dirname, aliasPath);
  return acc;
}, {});

export default defineConfig({
  test: {
    setupFiles: ['./tests/config/reactTestSetup.tsx'],
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.{ts,tsx,js,jsx}'],
  },
  resolve: {
    alias: aliases,
  },
});
