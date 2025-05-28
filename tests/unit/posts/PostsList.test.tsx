import type { UseQueryResult } from '@tanstack/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { PostsList } from '@/components/examples/PostsList';
import type { Post } from '@/lib/posts/post.types';
import { usePosts } from '@/lib/posts/usePosts';

expect.extend(toHaveNoViolations);

// Mock the usePosts hook
vi.mock('@/lib/posts/usePosts');

const queryClient = new QueryClient();

describe('PostsList', () => {
	it('should have no accessibility violations', async () => {
		// Given: The posts are loaded successfully
		vi.mocked(usePosts).mockReturnValue({
			data: [],
			isLoading: false,
			isError: false,
			error: null,
			isSuccess: true,
			status: 'success',
		} as Partial<UseQueryResult<Post[]>> as UseQueryResult<Post[]>);

		const { container } = render(
			<QueryClientProvider client={queryClient}>
				<PostsList />
			</QueryClientProvider>
		);
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});

	it('should show loading state when posts are being fetched', () => {
		// Given: The posts are being loaded
		vi.mocked(usePosts).mockReturnValue({
			data: undefined,
			isLoading: true,
			isError: false,
			error: null,
			isSuccess: false,
			status: 'pending',
		} as Partial<UseQueryResult<Post[]>> as UseQueryResult<Post[]>);

		// When: The component is rendered
		render(
			<QueryClientProvider client={queryClient}>
				<PostsList />
			</QueryClientProvider>
		);

		// Then: The loading spinner should be visible
		expect(screen.getByText('Loading...')).toBeInTheDocument();
	});

	it('should show error message when posts fetch fails', () => {
		// Given: There is an error fetching posts
		const errorMessage = 'Failed to fetch posts';
		vi.mocked(usePosts).mockReturnValue({
			data: undefined,
			isLoading: false,
			isError: true,
			error: new Error(errorMessage),
			isSuccess: false,
			status: 'error',
		} as Partial<UseQueryResult<Post[]>> as UseQueryResult<Post[]>);

		// When: The component is rendered
		render(
			<QueryClientProvider client={queryClient}>
				<PostsList />
			</QueryClientProvider>
		);

		// Then: The error message should be displayed
		expect(screen.getByText(`An error occurred: ${errorMessage}`)).toBeInTheDocument();
	});

	it('should show "No posts found" when posts array is empty', () => {
		// Given: The posts array is empty
		vi.mocked(usePosts).mockReturnValue({
			data: [],
			isLoading: false,
			isError: false,
			error: null,
			isSuccess: true,
			status: 'success',
		} as Partial<UseQueryResult<Post[]>> as UseQueryResult<Post[]>);

		// When: The component is rendered
		render(
			<QueryClientProvider client={queryClient}>
				<PostsList />
			</QueryClientProvider>
		);

		// Then: The "No posts found" message should be displayed
		expect(screen.getByText('No posts found')).toBeInTheDocument();
	});

	it('should display posts when they are successfully fetched', () => {
		// Given: We have some posts
		const mockPosts = [
			{ id: 1, title: 'First Post', body: 'Content of first post' },
			{ id: 2, title: 'Second Post', body: 'Content of second post' },
		];
		vi.mocked(usePosts).mockReturnValue({
			data: mockPosts,
			isLoading: false,
			isError: false,
			error: null,
			isSuccess: true,
			status: 'success',
		} as Partial<UseQueryResult<Post[]>> as UseQueryResult<Post[]>);

		// When: The component is rendered
		render(
			<QueryClientProvider client={queryClient}>
				<PostsList />
			</QueryClientProvider>
		);

		// Then: All posts should be displayed with their titles and content
		mockPosts.forEach(post => {
			expect(screen.getByText(post.title)).toBeInTheDocument();
			expect(screen.getByText(post.body)).toBeInTheDocument();
		});
	});
});
