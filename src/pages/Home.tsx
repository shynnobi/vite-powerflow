import { type ReactElement } from 'react';
import { FiGithub, FiInstagram, FiMinus, FiPlus, FiRefreshCw } from 'react-icons/fi';
import { SiBluesky } from 'react-icons/si';
import reactLogo from '@assets/react.svg';
import { useCounterStore } from '@store/counterStore';

import viteLogo from '/vite.svg';

export default function Home(): ReactElement {
	const { count, increment, decrement, reset } = useCounterStore();

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
			<div className="flex gap-4">
				<a href="https://vitejs.dev" target="_blank" rel="noreferrer">
					<img src={viteLogo} className="h-24 p-6" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank" rel="noreferrer">
					<img src={reactLogo} className="h-24 animate-spin-slow p-6" alt="React logo" />
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
				<div className="rounded-lg border bg-card p-4 text-card-foreground">
					<h2 className="text-lg font-semibold">Key Features</h2>
					<ul className="mt-2 space-y-1 text-sm text-muted-foreground">
						<li>⚡️ Vite 6.2 - Lightning fast build tool</li>
						<li>⚛️ React 19.1 - Latest version with Hooks</li>
						<li>📝 TypeScript 5.3 - Static typing</li>
						<li>🎨 Tailwind 4.0 & shadcn/ui 0.8 - Modern UI</li>
						<li>🔄 TanStack Query 5.71 - Data synchronization</li>
						<li>📦 Zustand 5.0 - State management</li>
						<li>🧪 Vitest 3.0 & Playwright 1.51 - Testing</li>
					</ul>
				</div>
			</div>

			<div className="mt-8 flex items-center gap-4">
				<button
					type="button"
					className="rounded-lg bg-slate-900 p-2 text-white hover:bg-slate-700"
					onClick={() => decrement()}
					data-testid="decrement-button"
				>
					<FiMinus className="h-5 w-5" />
				</button>
				<code
					className="rounded-lg bg-slate-800 px-4 py-2 font-mono text-xl text-white"
					data-testid="counter-value"
				>
					count is {count}
				</code>
				<button
					type="button"
					className="rounded-lg bg-slate-900 p-2 text-white hover:bg-slate-700"
					onClick={() => increment()}
					data-testid="increment-button"
				>
					<FiPlus className="h-5 w-5" />
				</button>
				<button
					type="button"
					className="rounded-lg bg-slate-900 p-2 text-white hover:bg-slate-700"
					onClick={() => reset()}
					data-testid="reset-button"
				>
					<FiRefreshCw className="h-5 w-5" />
				</button>
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
							className="text-foreground hover:text-foreground/80"
						>
							<FiGithub className="h-6 w-6" />
						</a>
						<a
							href="https://bsky.app/profile/shynnobi.bsky.social"
							target="_blank"
							rel="noreferrer"
							className="text-foreground hover:text-foreground/80"
						>
							<SiBluesky className="h-6 w-6" />
						</a>
						<a
							href="https://www.instagram.com/shynnobi_"
							target="_blank"
							rel="noreferrer"
							className="text-foreground hover:text-foreground/80"
						>
							<FiInstagram className="h-6 w-6" />
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
