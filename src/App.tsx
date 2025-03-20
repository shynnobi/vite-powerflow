import { type ReactElement } from 'react';
import { FiMinus, FiPlus, FiRefreshCw } from 'react-icons/fi';
import { Link, Route, Routes } from 'react-router-dom';
import reactLogo from '@assets/react.svg';
import { ThemeToggle } from '@components/ThemeToggle';
import About from '@pages/About';
import Blog from '@pages/Blog';
import { useCounterStore } from '@store/counterStore';

import viteLogo from '/vite.svg';

function Home(): ReactElement {
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
				Vite + React
			</h1>
			<div className="mt-4 flex items-center gap-4">
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
		</div>
	);
}

export default function App(): ReactElement {
	return (
		<>
			<nav className="fixed top-0 w-full bg-background p-4 shadow-md">
				<div className="container mx-auto flex items-center justify-between">
					<div className="flex gap-4">
						<Link to="/" className="text-foreground hover:text-foreground/80">
							Home
						</Link>
						<Link to="/about" className="text-foreground hover:text-foreground/80">
							About
						</Link>
						<Link to="/blog" className="text-foreground hover:text-foreground/80">
							Blog
						</Link>
					</div>
					<ThemeToggle />
				</div>
			</nav>
			<div className="pt-16">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/about" element={<About />} />
					<Route path="/blog" element={<Blog />} />
				</Routes>
			</div>
		</>
	);
}
