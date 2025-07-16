import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { PostsList } from './PostsList.js';

const meta = {
  title: 'Examples/PostsList',
  component: PostsList,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof PostsList>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock component for testing different states
const MockPostsList: React.FC<{
  isLoading?: boolean;
  error?: string | null;
  posts?: Array<{ id: number; title: string; body: string }>;
}> = ({ isLoading = false, error = null, posts = [] }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center text-gray-500">
        <p>No posts found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <article key={post.id} className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold">{post.title}</h3>
          <p className="text-gray-600">{post.body}</p>
        </article>
      ))}
    </div>
  );
};

export const Loading: Story = {
  render: () => <MockPostsList isLoading={true} />,
};

export const Error: Story = {
  render: () => <MockPostsList error="Failed to load posts" />,
};

export const Empty: Story = {
  render: () => <MockPostsList posts={[]} />,
};

export const WithPosts: Story = {
  render: () => (
    <MockPostsList
      posts={[
        { id: 1, title: 'First Post', body: 'This is the first post content.' },
        { id: 2, title: 'Second Post', body: 'This is the second post content.' },
      ]}
    />
  ),
};
