import * as React from 'react';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { ThemeToggle } from '@/components/ThemeToggle';
import { ThemeProviderContext } from '@/context/theme/ThemeContext';

const ThemeProvider = ({
	children,
	initialTheme = 'light',
}: {
	children: React.ReactNode;
	initialTheme?: 'light' | 'dark';
}) => {
	const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme);

	return (
		<ThemeProviderContext.Provider value={{ theme, setTheme }}>
			<div className={theme}>
				<div className="bg-background text-foreground">{children}</div>
			</div>
		</ThemeProviderContext.Provider>
	);
};

const meta = {
	title: 'Components/ThemeToggle',
	component: ThemeToggle,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'A theme toggle button that switches between light and dark modes. The background changes to demonstrate the theme switch effect.',
			},
		},
	},
	decorators: [
		Story => (
			<ThemeProvider>
				<Story />
			</ThemeProvider>
		),
	],
	tags: ['autodocs'],
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LightModeDefault: Story = {
	render: () => (
		<div className="rounded-md bg-slate-100 p-4 dark:bg-slate-800">
			<ThemeToggle />
		</div>
	),
};

export const DarkMode: Story = {
	decorators: [
		Story => (
			<ThemeProvider initialTheme="dark">
				<Story />
			</ThemeProvider>
		),
	],
	render: () => (
		<div className="rounded-md bg-slate-100 p-4 dark:bg-slate-800">
			<ThemeToggle />
		</div>
	),
};
