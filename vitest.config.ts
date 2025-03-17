/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: [
			{ find: '@', replacement: '/workspaces/vite-blank-starter/src' },
			{ find: '@assets', replacement: '/workspaces/vite-blank-starter/src/assets' },
			{ find: '@components', replacement: '/workspaces/vite-blank-starter/src/components' },
			{ find: '@store', replacement: '/workspaces/vite-blank-starter/src/store' },
			{ find: '@tests', replacement: '/workspaces/vite-blank-starter/tests' },
		],
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./tests/unit/setup.ts'],
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
