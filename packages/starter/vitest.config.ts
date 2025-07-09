/// <reference types="vitest" />
import react from '@vitejs/plugin-react-swc';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Determine the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') },
      { find: '@/assets', replacement: resolve(__dirname, 'src/assets') },
      { find: '@/components', replacement: resolve(__dirname, 'src/components') },
      { find: '@/context', replacement: resolve(__dirname, 'src/context') },
      { find: '@/lib', replacement: resolve(__dirname, 'src/lib') },
      { find: '@/pages', replacement: resolve(__dirname, 'src/pages') },
      { find: '@/store', replacement: resolve(__dirname, 'src/store') },
      { find: '@/tests', replacement: resolve(__dirname, 'tests') },
      { find: '@/types', replacement: resolve(__dirname, 'src/types') },
      { find: '@/utils', replacement: resolve(__dirname, 'src/utils') },
    ],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/config/reactTestSetup.tsx'],
    include: [
      './tests/**/*.test.{ts,tsx,js,jsx}',
      './tests/**/*.spec.{ts,tsx,js,jsx}',
      './src/**/*.test.{ts,tsx,js,jsx}',
      './src/**/*.spec.{ts,tsx,js,jsx}',
    ],
    exclude: ['./tests/e2e/**/*', '.storybook/**/*'],
    reporters: ['default'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx,js,jsx}'],
      exclude: [
        '**/*.d.ts',
        '**/*.spec.{ts,tsx,js,jsx}',
        '**/*.stories.{ts,tsx,js,jsx}',
        '**/*.test.{ts,tsx,js,jsx}',
        '**/*.types.ts',
        '**/components/typography/**/*',
        '**/components/ui/**/*',
        '**/context/theme/ThemeContext.tsx',
        '**/context/theme/ThemeProvider.tsx',
        '**/coverage/**/*',
        '**/dist/**/*',
        '**/logger.ts',
        '**/main.tsx',
        '**/node_modules/**/*',
        '**/pages/**/*',
        '**/stories/**/*',
      ],
    },
  },
});
