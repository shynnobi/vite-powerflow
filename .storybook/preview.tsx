import React from 'react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import type { Decorator, Preview } from '@storybook/react';

import '../src/index.css'; // Import global styles including Tailwind

const withThemeDecorator: Decorator = Story => (
	<div className="p-4 font-sans antialiased">
		<Story />
	</div>
);

// Custom viewports in addition to the default ones
const customViewports = {
	desktop: {
		name: 'Desktop',
		styles: { width: '1200px', height: '900px' },
		type: 'desktop',
	},
	tablet: {
		name: 'Tablet',
		styles: { width: '768px', height: '1024px' },
		type: 'tablet',
	},
	mobile: {
		name: 'Mobile',
		styles: { width: '375px', height: '667px' },
		type: 'mobile',
	},
};

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		backgrounds: {
			default: 'light',
			values: [
				{
					name: 'light',
					value: '#ffffff',
				},
				{
					name: 'dark',
					value: '#0f172a', // Tailwind slate-900
				},
			],
		},
		viewport: {
			viewports: {
				...INITIAL_VIEWPORTS,
				...customViewports,
			},
			defaultViewport: 'responsive',
		},
		a11y: {
			// Default accessibility options
			config: {
				rules: [
					// You can enable specific rules or disable some if needed
				],
			},
			options: {
				checks: { 'color-contrast': { options: { noScroll: true } } },
			},
		},
		layout: 'centered',
	},
	decorators: [withThemeDecorator],
};

export default preview;
