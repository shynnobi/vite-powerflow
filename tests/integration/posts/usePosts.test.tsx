import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createWrapper } from '../../config/reactTestSetup';

import { usePosts } from '@/lib/posts/usePosts';

beforeEach(() => {
	vi.resetAllMocks();
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe('usePosts', () => {
	// Given a successful API response
	it('should fetch posts successfully', async () => {
		// When rendering the hook
		const { result } = renderHook(() => usePosts(), {
			wrapper: createWrapper(),
		});

		// Then initially it should be loading
		expect(result.current.isLoading).toBe(true);

		// And eventually it should contain posts
		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
			expect(result.current.data).toBeDefined();
			expect(Array.isArray(result.current.data)).toBe(true);
		});
	});

	// Given a failed API response
	it('should handle errors', async () => {
		// When the API call fails
		vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('API Error'));

		// And we render the hook
		const { result } = renderHook(() => usePosts(), {
			wrapper: createWrapper(),
		});

		// Then it should show an error state
		await waitFor(() => {
			expect(result.current.isError).toBe(true);
			expect(result.current.error).toBeDefined();
		});
	});
});
