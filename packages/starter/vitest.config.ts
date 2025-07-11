import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/config/reactTestSetup.tsx'],
    include: [
      './src/**/*.spec.{ts,tsx,js,jsx}',
      './src/**/*.test.{ts,tsx,js,jsx}',
      './tests/**/*.spec.{ts,tsx,js,jsx}',
      './tests/**/*.test.{ts,tsx,js,jsx}',
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
