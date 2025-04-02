import React from 'react';
import { INITIAL_VIEWPORTS, MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';
import type { Decorator, Preview } from '@storybook/react';

import '../src/index.css'; // Import global styles including Tailwind

// Nos viewports personnalisés
const CUSTOM_VIEWPORTS = {
	xs: {
		name: 'XS Mobile',
		styles: {
			width: '320px',
			height: '568px',
		},
		type: 'mobile',
	},
	sm: {
		name: 'SM Mobile',
		styles: {
			width: '375px',
			height: '667px',
		},
		type: 'mobile',
	},
	md: {
		name: 'MD Tablet',
		styles: {
			width: '768px',
			height: '1024px',
		},
		type: 'tablet',
	},
	lg: {
		name: 'LG Desktop',
		styles: {
			width: '1024px',
			height: '768px',
		},
		type: 'desktop',
	},
	xl: {
		name: 'XL Desktop',
		styles: {
			width: '1280px',
			height: '800px',
		},
		type: 'desktop',
	},
	'2xl': {
		name: '2XL Desktop',
		styles: {
			width: '1536px',
			height: '960px',
		},
		type: 'desktop',
	},
};

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
		viewport: {
			// Configuration des viewports
			viewports: {
				...CUSTOM_VIEWPORTS, // Nos breakpoints Tailwind personnalisés
				...MINIMAL_VIEWPORTS, // Viewports minimaux (mobile, tablet, desktop)
				...INITIAL_VIEWPORTS, // Tous les appareils prédéfinis
			},
			// Configuration par défaut
			defaultViewport: 'responsive',
			// Groupes de viewports
			defaultOrientation: 'portrait',
			styles: {
				padding: '1rem',
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
