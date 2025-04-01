import React from 'react';
import type { Decorator, Preview } from '@storybook/react';

import '../src/index.css'; // Import global styles including Tailwind

const withThemeDecorator: Decorator = Story => (
	<div className="p-4 font-sans antialiased">
		<Story />
	</div>
);

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
		layout: 'centered',
	},
	decorators: [withThemeDecorator],
};

export default preview;
