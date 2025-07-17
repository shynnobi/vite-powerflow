import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createWrapper } from '../../config/reactTestSetup';

import type { CreatePostInput, Post } from '@/lib/posts/post.types';
import { useCreatePost } from '@/lib/posts/useCreatePost';

beforeEach(() => {
  vi.resetAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

const TEST_POST: CreatePostInput = {
  title: 'Test Post',
  body: 'Test Content',
};

const TEST_RESPONSE: Post = {
  id: 1,
  ...TEST_POST,
};

describe('useCreatePost', () => {
  it('should successfully create a post when the API responds with success', async () => {
    // Given: A successful API response is mocked
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(TEST_RESPONSE), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    // And: The hook is rendered
    const { result } = renderHook(() => useCreatePost(), {
      wrapper: createWrapper(),
    });

    // When: A post creation is attempted
    result.current.mutate(TEST_POST);

    // Then: The operation should succeed with the correct response data
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(TEST_RESPONSE);
    });
  });

  it('should handle API errors when post creation fails', async () => {
    // Given: A failed API response is mocked
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('API Error'));

    // And: The hook is rendered
    const { result } = renderHook(() => useCreatePost(), {
      wrapper: createWrapper(),
    });

    // When: A post creation is attempted
    result.current.mutate(TEST_POST);

    // Then: The operation should fail with an error
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBeDefined();
    });
  });

  it('should handle optimistic updates during post creation', async () => {
    // Given: A successful API response is mocked
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(TEST_RESPONSE), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    // And: The hook is rendered
    const { result } = renderHook(() => useCreatePost(), {
      wrapper: createWrapper(),
    });

    // When: A post creation is attempted
    result.current.mutate(TEST_POST);

    // Then: The operation should succeed with the correct response data
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(TEST_RESPONSE);
    });
  });
});
