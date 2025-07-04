import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';

import { PostsList } from './PostsList.js';

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
        http.get('/api/posts', async () => {
          await new Promise(resolve => window.setTimeout(resolve, 4000));
          return HttpResponse.json([], { status: 200 });
        }),
      ],
    },
  },
};

export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/posts', () => {
          return HttpResponse.json({ message: 'Failed to fetch posts' }, { status: 500 });
        }),
      ],
    },
  },
};

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/posts', () => {
          return HttpResponse.json([], { status: 200 });
        }),
      ],
    },
  },
};

export const WithPosts: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/posts', () => {
          return HttpResponse.json(
            [
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
            ],
            { status: 200 }
          );
        }),
      ],
    },
  },
};
