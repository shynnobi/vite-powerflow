import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
	const __dirname = dirname(fileURLToPath(import.meta.url));
	return join(__dirname, '..', 'node_modules', value);
}

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
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
};

export default config;
