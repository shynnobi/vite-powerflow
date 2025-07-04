import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreatePostInput, Post } from './post.types';

const createPost = async (post: CreatePostInput): Promise<Post> => {
  const response = await fetch('/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

interface MutationContext {
  previousPosts: Post[];
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onMutate: async (newPost: CreatePostInput) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData<Post[]>(['posts']) ?? [];

      queryClient.setQueryData<Post[]>(['posts'], (old = []) => [
        ...old,
        { id: Math.random(), ...newPost },
      ]);

      return { previousPosts };
    },
    onError: (_err: Error, _newPost: CreatePostInput, context: MutationContext | undefined) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
