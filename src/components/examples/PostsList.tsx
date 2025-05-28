import { Spinner } from '@/components/ui/spinner';
import type { Post } from '@/lib/posts/post.types';
import { usePosts } from '@/lib/posts/usePosts';

export function PostsList() {
	const { data: posts, isLoading, error } = usePosts();

	if (isLoading) {
		return (
			<div className="flex justify-center">
				<Spinner size="lg" />
			</div>
		);
	}

	if (error) {
		return <div className="text-red-500">An error occurred: {error.message}</div>;
	}

	if (!posts || posts.length === 0) {
		return <div>No posts found</div>;
	}

	return (
		<div className="space-y-4">
			{posts.map((post: Post) => (
				<div key={post.id} className="rounded-lg border p-4 shadow-sm">
					<h2 className="text-xl font-bold">{post.title}</h2>
					<p className="mt-2 text-gray-600">{post.body}</p>
				</div>
			))}
		</div>
	);
}
