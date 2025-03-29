import type { StorybookConfig } from '@storybook/react-vite';
import viteConfig from './vite.config';

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: [
		'@storybook/addon-essentials',
		'@chromatic-com/storybook',
		'@storybook/experimental-addon-test',
	],
	framework: {
		name: '@storybook/react-vite',
		options: {
			builder: {
				viteConfigPath: '.storybook/vite.config.ts',
			},
		},
	},
	core: {
		disableTelemetry: true,
	},
	typescript: {
		reactDocgen: 'react-docgen',
	},
	viteFinal: config => {
		return {
			...config,
			...viteConfig,
			optimizeDeps: {
				...config.optimizeDeps,
				...viteConfig.optimizeDeps,
			},
		};
	},
};
export default config;
