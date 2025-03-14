/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import { mergeConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

const viteConfig = {
	plugins: [react()],
};

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			globals: true,
			environment: 'jsdom',
			setupFiles: ['./src/test/setup.ts'],
			exclude: ['node_modules/**', 'e2e/**', '.git/**'],
			coverage: {
				provider: 'v8',
				reporter: ['text', 'json', 'html'],
				exclude: ['node_modules/', 'src/test/'],
			},
		},
	})
);
