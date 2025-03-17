import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), visualizer()],
	server: {
		host: '0.0.0.0',
		port: 5173,
	},
	resolve: {
		alias: [
			{ find: '@', replacement: '/workspaces/vite-blank-starter/src' },
			{ find: '@store', replacement: '/workspaces/vite-blank-starter/src/store' },
			{ find: '@assets', replacement: '/workspaces/vite-blank-starter/src/assets' },
			{ find: '@tests', replacement: '/workspaces/vite-blank-starter/tests' },
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
