import { type ReactElement } from 'react';
import { useCounterStore } from '@store/counterStore';
import reactLogo from '@assets/react.svg';
import { Greeting } from '@components/Greeting';
import viteLogo from '/vite.svg';
import './App.css';

function App(): ReactElement {
	const { count, increment, decrement, reset } = useCounterStore();

	return (
		<>
			<div>
				<a href="https://vite.dev" target="_blank" rel="noreferrer">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank" rel="noreferrer">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1>Vite + React</h1>

			<Greeting name="Developer" />

			<div className="card">
				<div>
					<span data-testid="counter-value">Count is: {count}</span>
				</div>
			</div>
			<div className="card">
				<div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
					<button data-testid="decrement-button" onClick={decrement}>
						Decrement
					</button>
					<button data-testid="increment-button" onClick={increment}>
						Increment
					</button>
					<button data-testid="reset-button" onClick={reset}>
						Reset
					</button>
				</div>
				<p>This counter is managed by Zustand</p>
			</div>
			<p className="read-the-docs">Click on the Vite and React logos to learn more</p>
		</>
	);
}

export default App;
