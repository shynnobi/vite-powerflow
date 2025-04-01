import * as React from 'react';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';

interface CardStoryProps extends React.ComponentProps<typeof Card> {
	onCancel?: () => void;
	onDeploy?: () => void;
}

const meta: Meta<CardStoryProps> = {
	title: 'UI/Card',
	component: Card,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		onCancel: {
			description: '',
			action: 'canceled',
			table: {
				type: { summary: '() => void' },
				defaultValue: { summary: 'undefined' },
			},
		},
		onDeploy: {
			description: '',
			action: 'deployed',
			table: {
				type: { summary: '() => void' },
				defaultValue: { summary: 'undefined' },
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

const handleCancel = action('cancel clicked');
const handleDeploy = action('deploy clicked');

export const Simple: Story = {
	render: args => (
		<Card className="w-[350px]" {...args}>
			<CardHeader>
				<CardTitle>Create project</CardTitle>
				<CardDescription>Deploy your new project in one-click.</CardDescription>
			</CardHeader>
			<CardContent>
				<p>Card Content</p>
			</CardContent>
			<CardFooter className="flex justify-between">
				<Button variant="outline" onClick={handleCancel}>
					Cancel
				</Button>
				<Button onClick={handleDeploy}>Deploy</Button>
			</CardFooter>
		</Card>
	),
};

export const WithoutFooter: Story = {
	render: () => (
		<Card className="w-[350px]">
			<CardHeader>
				<CardTitle>Create project</CardTitle>
				<CardDescription>Deploy your new project in one-click.</CardDescription>
			</CardHeader>
			<CardContent>
				<p>Card Content</p>
			</CardContent>
		</Card>
	),
};

export const OnlyContent: Story = {
	render: () => (
		<Card className="w-[350px]">
			<CardContent>
				<p>Card Content</p>
			</CardContent>
		</Card>
	),
};

export const WithActions: Story = {
	args: {
		onCancel: () => action('cancel clicked')(),
		onDeploy: () => action('deploy clicked')(),
	},
	render: args => (
		<Card className="w-[350px]">
			<CardHeader>
				<CardTitle>Create project</CardTitle>
				<CardDescription>Deploy your new project in one-click.</CardDescription>
			</CardHeader>
			<CardContent>
				<p>Card Content</p>
			</CardContent>
			<CardFooter className="flex justify-between">
				<Button variant="outline" onClick={args.onCancel}>
					Cancel
				</Button>
				<Button onClick={args.onDeploy}>Deploy</Button>
			</CardFooter>
		</Card>
	),
};
