import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react-swc';
import { dirname } from 'node:path';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const __dirname = dirname(new globalThis.URL(import.meta.url).pathname);

export default defineConfig({
  plugins: [react(), storybookTest({ configDir: `${__dirname}/.storybook` }), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/config/reactTestSetup.tsx', '.storybook/vitest.setup.ts'],
    exclude: ['./tests/e2e/**/*'],
    reporters: ['default'],
    browser: {
      enabled: true,
      headless: true,
      provider: 'playwright',
      instances: [{ browser: 'chromium' }],
    },
  },
});
