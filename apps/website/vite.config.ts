import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import type { PluginOption } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), visualizer() as PluginOption, tailwindcss(), tsconfigPaths()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },

  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/unit/setup.ts'],
    include: [
      './tests/*.{test,spec}.{js,jsx,ts,tsx}',
      './tests/**/*.{test,spec}.{js,jsx,ts,tsx}',
      './**/__tests__/**/*.{test,spec}.{js,jsx,ts,tsx}',
      './**/__tests__/*.{test,spec}.{js,jsx,ts,tsx}',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      all: true,
    },
  },
});
