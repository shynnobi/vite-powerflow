import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['tsconfig-paths/register'],
    include: ['**/*.test.ts'],
  },
});
