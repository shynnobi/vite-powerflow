/// <reference lib="dom" />
import { useQuery } from '@tanstack/react-query';

interface Post {
	id: number;
	title: string;
	body: string;
}

// Function that simulates an API call
const fetchPosts = async (): Promise<Post[]> => {
	const response = await fetch('https://jsonplaceholder.typicode.com/posts');
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
