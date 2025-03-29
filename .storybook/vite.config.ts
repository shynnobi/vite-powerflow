import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
	optimizeDeps: {
		exclude: [
			'@storybook/react/dist/esm/client',
			'@storybook/react/dist/esm/preview',
			'@storybook/addon-essentials',
			'@storybook/addon-actions',
			'@storybook/blocks',
		],
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, '../src'),
			'@assets': resolve(__dirname, '../src/assets'),
			'@components': resolve(__dirname, '../src/components'),
			'@context': resolve(__dirname, '../src/context'),
			'@lib': resolve(__dirname, '../src/lib'),
			'@pages': resolve(__dirname, '../src/pages'),
			'@shared': resolve(__dirname, '../src/shared'),
			'@store': resolve(__dirname, '../src/store'),
			'@tests': resolve(__dirname, '../tests'),
			'@utils': resolve(__dirname, '../src/utils'),
		},
	},
});
