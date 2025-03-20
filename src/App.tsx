import { type ReactElement } from 'react';
import { FiMinus, FiPlus, FiRefreshCw } from 'react-icons/fi';
import reactLogo from '@assets/react.svg';
import { ThemeToggle } from '@components/ThemeToggle';
import { useCounterStore } from '@store/counterStore';

import './App.css';

import viteLogo from '/vite.svg';

function App(): ReactElement {
	const { count, increment, decrement, reset } = useCounterStore();

	return (
		<div>
			<div className="flex flex-col items-center justify-center w-full min-h-screen text-center bg-gray-100 dark:bg-gray-900">
				<header className="fixed top-0 right-0 p-4">
					<ThemeToggle />
				</header>
				<div className="flex flex-col items-center justify-center gap-12">
					<div className="flex gap-5 justify-center">
						<a href="https://vite.dev" target="_blank" rel="noreferrer">
							<img
								src={viteLogo}
								className="h-32 w-32 p-6 transition-transform hover:scale-110 hover:drop-shadow-[0_0_2em_#646cffaa]"
								alt="Vite logo"
							/>
						</a>
						<a href="https://react.dev" target="_blank" rel="noreferrer">
							<img
								src={reactLogo}
								className="h-32 w-32 p-6 transition-all animate-[spin_20s_linear_infinite] hover:animate-none hover:drop-shadow-[0_0_2em_#61dafbaa]"
								alt="React logo"
							/>
						</a>
					</div>

					<div className="max-w-[640px] rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
						<h1 className="text-4xl font-bold mb-2">Vite + React</h1>
						<p className="text-lg">
							Welcome to our starter application! This template combines Vite and React with
							TypeScript, TailwindCSS, and a simple counter example to help you get started building
							modern web applications quickly and efficiently.
						</p>
					</div>

					<div className="p-6 rounded-lg shadow-md bg-white dark:bg-gray-800 w-full max-w-md">
						<div>
							<div data-testid="counter-value" className="text-2xl font-medium mb-4">
								Count is {count}
							</div>

							<div className="flex gap-3 justify-center">
								<button
									data-testid="decrement-button"
									onClick={decrement}
									className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-md transition-all cursor-pointer active:translate-y-0.5"
									title="Decrement"
								>
									<FiMinus className="w-5 h-5" />
								</button>

								<button
									data-testid="increment-button"
									onClick={increment}
									className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-md transition-all cursor-pointer active:translate-y-0.5"
									title="Increment"
								>
									<FiPlus className="w-5 h-5" />
								</button>

								<button
									data-testid="reset-button"
									onClick={reset}
									className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-md transition-all cursor-pointer active:translate-y-0.5"
									title="Reset"
								>
									<FiRefreshCw className="w-5 h-5" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
