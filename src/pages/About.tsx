import { type ReactElement } from 'react';

export default function About(): ReactElement {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background">
			<h1 className="text-4xl font-bold text-foreground">About Page</h1>
		</div>
	);
}
