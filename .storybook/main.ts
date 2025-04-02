import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
	stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: [
		'@storybook/addon-essentials',
		'@chromatic-com/storybook',
		'@storybook/experimental-addon-test',
		'@storybook/addon-a11y',
		'@storybook/addon-measure',
		'@storybook/addon-viewport',
	],
	framework: {
		name: '@storybook/react-vite',
		options: {},
	},
	docs: {
		autodocs: true,
	},
	core: {
		disableTelemetry: true,
	},
	typescript: {
		reactDocgen: 'react-docgen-typescript',
		check: true,
	},
};

export default config;
