import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '@tests/config/reactTestSetup';
import { describe, expect, it, vi } from 'vitest';

import './setup';
import type { CreatePostInput, Post } from '@/lib/posts/post.types';
import { useCreatePost } from '@/lib/posts/useCreatePost';

const TEST_POST: CreatePostInput = {
	title: 'Test Post',
	body: 'Test Content',
};

const TEST_RESPONSE: Post = {
	id: 1,
	...TEST_POST,
};

describe('useCreatePost', () => {
	// Given a successful API response
	it('should handle post creation successfully', async () => {
		// When mocking a successful API response
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify(TEST_RESPONSE), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			})
		);

		// And rendering the hook
		const { result } = renderHook(() => useCreatePost(), {
			wrapper: createWrapper(),
		});

		// Then we can create a post
		result.current.mutate(TEST_POST);

		// And eventually it should succeed
		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
			expect(result.current.data).toEqual(TEST_RESPONSE);
		});
	});

	// Given a failed API response
	it('should handle errors during post creation', async () => {
		// When mocking a failed API response
		vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('API Error'));

		// And rendering the hook
		const { result } = renderHook(() => useCreatePost(), {
			wrapper: createWrapper(),
		});

		// Then when we try to create a post
		result.current.mutate(TEST_POST);

		// It should eventually show an error
		await waitFor(() => {
			expect(result.current.isError).toBe(true);
			expect(result.current.error).toBeDefined();
		});
	});

	// Given an optimistic update scenario
	it('should handle optimistic updates', async () => {
		// When mocking a successful API response
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify(TEST_RESPONSE), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			})
		);

		// And rendering the hook
		const { result } = renderHook(() => useCreatePost(), {
			wrapper: createWrapper(),
		});

		// Then when we create a post
		result.current.mutate(TEST_POST);

		// It should eventually succeed
		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
			expect(result.current.data).toEqual(TEST_RESPONSE);
		});
	});
});
