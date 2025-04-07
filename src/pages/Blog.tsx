import { type ReactElement } from 'react';

import { PostsList } from '@/components/examples/PostsList';

export default function Blog(): ReactElement {
	return (
		<div className="container mx-auto p-4">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">Blog</h1>
				<div className="mt-4 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
					<h2 className="text-xl font-semibold">Exemple TanStack Query</h2>
					<p className="mt-2 text-muted-foreground">
						Cette page démontre l'utilisation de TanStack Query pour la gestion des données serveur.
						Les posts sont récupérés depuis une API externe (JSONPlaceholder) et mis en cache
						automatiquement. Vous pouvez observer le comportement du cache et des requêtes en
						utilisant les DevTools de TanStack Query (icône en bas à droite de l'écran).
					</p>
					<div className="mt-4 flex gap-2">
						<a
							href="https://tanstack.com/query/latest"
							target="_blank"
							rel="noreferrer"
							className="text-sm text-primary hover:underline"
						>
							Documentation TanStack Query →
						</a>
					</div>
				</div>
			</div>
			<PostsList />
		</div>
	);
}
