import { type ReactElement } from 'react';
import { FiGithub, FiInstagram } from 'react-icons/fi';
import { SiBluesky } from 'react-icons/si';

import reactLogo from '@/assets/react.svg';
import { Counter } from '@/components/examples/Counter';

export default function Home(): ReactElement {
	return (
		<div className="flex pt-16 flex-col items-center justify-center bg-background p-4">
			<div className="flex gap-4">
				<a href="https://vitejs.dev" target="_blank" rel="noreferrer">
					<img src={reactLogo} className="h-24 p-6" alt="React logo" />
				</a>
			</div>
			<h1 className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-5xl font-black text-transparent">
				Vite PowerFlow ⚡
			</h1>
			<p className="mt-4 max-w-2xl text-center text-muted-foreground">
				A modern React starter template with a robust development workflow, featuring comprehensive
				tooling and industry best practices for professional applications.
			</p>

			<div className="mt-8 grid max-w-2xl gap-4 text-center">
				<div className="rounded-md border bg-card p-4 text-card-foreground">
					<h2 className="text-lg font-semibold">Key Features</h2>
					<ul className="mt-2 space-y-1 text-sm text-muted-foreground">
						<li>⚡️ Vite 6 - Lightning fast build tool</li>
						<li>⚛️ React 19 - Latest version with Hooks</li>
						<li>📝 TypeScript 5 - Static typing</li>
						<li>🎨 Tailwind 4 & shadcn/ui - Modern UI</li>
						<li>🔄 TanStack Query 5 - Data synchronization</li>
						<li>📦 Zustand 5 - State management</li>
						<li>🧪 Vitest 3 & Playwright 1 - Testing</li>
					</ul>
				</div>
			</div>

			<div className="mt-8 flex items-center gap-4">
				<Counter />
			</div>

			<div className="mt-12">
				<div className="text-center">
					<h2 className="text-lg font-semibold">Author</h2>
					<p className="text-muted-foreground">Shynn · Front-end Developer & 3D Artist</p>
					<div className="mt-4 flex justify-center gap-4">
						<a
							href="https://github.com/shynnobi"
							target="_blank"
							rel="noreferrer"
							className="text-foreground hover:underline"
							aria-label="GitHub profile"
						>
							<FiGithub className="h-6 w-6" aria-hidden="true" />
							<span className="sr-only">GitHub</span>
						</a>
						<a
							href="https://bsky.app/profile/shynnobi.bsky.social"
							target="_blank"
							rel="noreferrer"
							className="text-foreground hover:underline"
							aria-label="Bluesky profile"
						>
							<SiBluesky className="h-6 w-6" aria-hidden="true" />
							<span className="sr-only">Bluesky</span>
						</a>
						<a
							href="https://www.instagram.com/shynnobi_"
							target="_blank"
							rel="noreferrer"
							className="text-foreground hover:underline"
							aria-label="Instagram profile"
						>
							<FiInstagram className="h-6 w-6" aria-hidden="true" />
							<span className="sr-only">Instagram</span>
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
