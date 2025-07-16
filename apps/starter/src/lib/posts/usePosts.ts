import { useQuery } from '@tanstack/react-query';

import type { Post } from './post.types.js';

const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch('/api/posts');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });
}
