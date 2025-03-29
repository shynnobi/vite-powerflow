import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './button';

const meta: Meta<typeof Button> = {
	title: 'Components/Button',
	component: Button,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: { type: 'select' },
			options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
		},
		size: {
			control: { type: 'select' },
			options: ['default', 'sm', 'lg', 'icon'],
		},
	},
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
	args: {
		children: 'Button',
		variant: 'default',
	},
};

export const Secondary: Story = {
	args: {
		children: 'Button',
		variant: 'secondary',
	},
};

export const Destructive: Story = {
	args: {
		children: 'Button',
		variant: 'destructive',
	},
};

export const Outline: Story = {
	args: {
		children: 'Button',
		variant: 'outline',
	},
};

export const Ghost: Story = {
	args: {
		children: 'Button',
		variant: 'ghost',
	},
};

export const Link: Story = {
	args: {
		children: 'Button',
		variant: 'link',
	},
};

export const Small: Story = {
	args: {
		children: 'Small Button',
		size: 'sm',
	},
};

export const Large: Story = {
	args: {
		children: 'Large Button',
		size: 'lg',
	},
};
