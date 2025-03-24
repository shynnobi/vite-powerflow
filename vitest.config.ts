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
			{ find: '@assets', replacement: resolve(__dirname, 'src/assets') },
			{ find: '@components', replacement: resolve(__dirname, 'src/components') },
			{ find: '@context', replacement: resolve(__dirname, 'src/context') },
			{ find: '@lib', replacement: resolve(__dirname, 'src/lib') },
			{ find: '@pages', replacement: resolve(__dirname, 'src/pages') },
			{ find: '@shared', replacement: resolve(__dirname, 'src/shared') },
			{ find: '@store', replacement: resolve(__dirname, 'src/store') },
			{ find: '@tests', replacement: resolve(__dirname, 'tests') },
		],
	},
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./tests/setup.ts'],
		include: ['./tests/{unit,integration}/**/*.{test,spec}.{ts,tsx}'],
		exclude: ['./tests/e2e/**/*'],
		reporters: ['default'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			include: ['src/**/*.{ts,tsx}'],
			exclude: ['**/*.d.ts', '**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
		},
	},
});
