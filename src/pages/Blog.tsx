import { type ReactElement } from 'react';

import { PostsList } from '@/components/examples/PostsList';

export default function Blog(): ReactElement {
	return (
		<div className="container mx-auto p-4">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-foreground">Blog</h1>
				<div className="mt-4 rounded-md border bg-card p-4 text-card-foreground shadow">
					<h2 className="text-xl font-semibold">Exemple TanStack Query</h2>
					<p className="mt-2 text-muted-foreground">
						This page demonstrates the use of TanStack Query for server data management. Posts are
						fetched from an external API (JSONPlaceholder) and automatically cached. You can observe
						the cache and query behavior using TanStack Query DevTools (icon in the bottom right
						corner of the screen).
					</p>
					<div className="mt-4 flex gap-2">
						<a
							href="https://tanstack.com/query/latest"
							target="_blank"
							rel="noreferrer"
							className="text-sm text-primary hover:underline"
						>
							TanStack Query Documentation →
						</a>
					</div>
				</div>
			</div>
			<PostsList />
		</div>
	);
}
