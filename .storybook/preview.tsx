import React from 'react';
import type { Preview } from '@storybook/react';

import '../src/index.css';

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		layout: 'centered',
		backgrounds: {
			default: 'light',
		},
		viewport: {
			viewports: {
				mobile: {
					name: 'Mobile',
					styles: {
						width: '375px',
						height: '667px',
					},
				},
				tablet: {
					name: 'Tablet',
					styles: {
						width: '768px',
						height: '1024px',
					},
				},
			},
		},
	},
	decorators: [
		Story => (
			<div className="flex items-center justify-center bg-background text-foreground w-full h-full p-4">
				<div className="w-full">
					<Story />
				</div>
			</div>
		),
	],
};

export default preview;
