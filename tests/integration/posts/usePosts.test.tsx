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
  it('should fetch and display posts when the API responds successfully', async () => {
    // Given: The hook is rendered
    const { result } = renderHook(() => usePosts(), {
      wrapper: createWrapper(),
    });

    // When: The initial data fetch is triggered
    // Then: The hook should show a loading state
    expect(result.current.isLoading).toBe(true);

    // And: Eventually it should contain an array of posts
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toBeDefined();
      expect(Array.isArray(result.current.data)).toBe(true);
    });
  });

  it('should handle API errors when fetching posts fails', async () => {
    // Given: The API call is mocked to fail
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('API Error'));

    // When: The hook is rendered
    const { result } = renderHook(() => usePosts(), {
      wrapper: createWrapper(),
    });

    // Then: The hook should show an error state
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBeDefined();
    });
  });
});
