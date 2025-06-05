import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { PostsList } from './PostsList';

const meta = {
	title: 'Examples/PostsList',
	component: PostsList,
	parameters: {
		layout: 'centered',
	},
	decorators: [
		Story => {
			const queryClient = new QueryClient({
				defaultOptions: {
					queries: {
						retry: false,
					},
				},
			});
			return (
				<QueryClientProvider client={queryClient}>
					<Story />
				</QueryClientProvider>
			);
		},
	],
} satisfies Meta<typeof PostsList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
	parameters: {
		msw: {
			handlers: [
				// Simulate loading delay
				async () => {
					await new Promise(resolve => window.setTimeout(resolve, 2000));
					return new Response(JSON.stringify([]), {
						status: 200,
						headers: { 'Content-Type': 'application/json' },
					});
				},
			],
		},
	},
};

export const Error: Story = {
	parameters: {
		msw: {
			handlers: [
				() => {
					return new Response(JSON.stringify({ message: 'Failed to fetch posts' }), {
						status: 500,
						headers: { 'Content-Type': 'application/json' },
					});
				},
			],
		},
	},
};

export const Empty: Story = {
	parameters: {
		msw: {
			handlers: [
				() => {
					return new Response(JSON.stringify([]), {
						status: 200,
						headers: { 'Content-Type': 'application/json' },
					});
				},
			],
		},
	},
};

export const WithPosts: Story = {
	parameters: {
		msw: {
			handlers: [
				() => {
					return new Response(
						JSON.stringify([
							{
								id: 1,
								title: 'First Post',
								body: 'This is the content of the first post.',
							},
							{
								id: 2,
								title: 'Second Post',
								body: 'This is the content of the second post.',
							},
						]),
						{
							status: 200,
							headers: { 'Content-Type': 'application/json' },
						}
					);
				},
			],
		},
	},
};
