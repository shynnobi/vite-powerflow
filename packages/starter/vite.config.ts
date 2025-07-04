import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vitest/config';
import type { PluginOption } from 'vite';

// Determine the current directory so the project
// can be use wether from a Docker container or from the local machine
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), visualizer() as PluginOption, tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
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
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/unit/setup.ts'],
    include: ['./tests/unit/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage/unit',
    },
  },
});
