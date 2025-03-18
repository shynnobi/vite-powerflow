import { type ReactElement } from 'react';
import { useCounterStore } from '@store/counterStore';
import reactLogo from '@assets/react.svg';
import { Greeting } from '@components/Greeting';
import viteLogo from '/vite.svg';
import './App.css';

function App(): ReactElement {
	const { count, increment, decrement, reset } = useCounterStore();

	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-4">
			<div className="flex gap-8 mb-4">
				<a href="https://vite.dev" target="_blank" rel="noreferrer">
					<img
						src={viteLogo}
						className="h-24 w-24 hover:scale-110 transition-transform"
						alt="Vite logo"
					/>
				</a>
				<a href="https://react.dev" target="_blank" rel="noreferrer">
					<img
						src={reactLogo}
						className="h-24 w-24 animate-[spin_5s_linear_infinite] hover:animate-none"
						alt="React logo"
					/>
				</a>
			</div>
			<h1 className="text-4xl font-bold mb-6">Vite + React</h1>

			<Greeting name="Developer" />

			<div className="p-6 border rounded-lg shadow-sm bg-white/5 mb-4 w-full max-w-md">
				<div>
					<span data-testid="counter-value" className="text-xl font-medium">
						Count is: {count}
					</span>
				</div>
			</div>
			<div className="p-6 border rounded-lg shadow-sm bg-white/5 mb-8 w-full max-w-md">
				<div className="flex gap-3 justify-center mb-4">
					<button
						data-testid="decrement-button"
						onClick={decrement}
						className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
					>
						Decrement
					</button>
					<button
						data-testid="increment-button"
						onClick={increment}
						className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
					>
						Increment
					</button>
					<button
						data-testid="reset-button"
						onClick={reset}
						className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
					>
						Reset
					</button>
				</div>
				<p className="text-center text-gray-400">This counter is managed by Zustand</p>
			</div>
			<p className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
				Click on the Vite and React logos to learn more
			</p>
		</div>
	);
}

export default App;
