import { useState } from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

const SimpleCounter = () => {
	const [count, setCount] = useState(0);
	const [message, setMessage] = useState('');

	const increment = () => {
		setCount(prev => prev + 1);
		if (count + 1 >= 5) {
			setMessage('High count reached!');
		}
	};

	const reset = () => {
		setCount(0);
		setMessage('');
	};

	return (
		<div>
			<h2>Example of Counter with local state (useState)</h2>
			<p data-testid="count-display">Count: {count}</p>
			{message && <p data-testid="message">{message}</p>}
			<button data-testid="increment-btn" onClick={increment}>
				Increment
			</button>
			<button data-testid="reset-btn" onClick={reset}>
				Reset
			</button>
		</div>
	);
};

describe('SimpleCounter: Component with local state (useState)', () => {
	it('should update the counter display when the increment button is clicked', async () => {
		// Given: A rendered SimpleCounter component with initial count of 0
		const user = userEvent.setup();
		render(<SimpleCounter />);
		const incrementButton = screen.getByTestId('increment-btn');
		const countDisplay = screen.getByTestId('count-display');
		expect(countDisplay).toHaveTextContent('Count: 0');

		// When: The user clicks the increment button
		await act(async () => {
			await user.click(incrementButton);
		});

		// Then: The count display should show 1
		expect(countDisplay).toHaveTextContent('Count: 1');
	});

	it('should display a high count message when the counter reaches 5', async () => {
		// Given: A rendered SimpleCounter component
		const user = userEvent.setup();
		render(<SimpleCounter />);
		const incrementButton = screen.getByTestId('increment-btn');

		// When: The user clicks the increment button 5 times
		for (let i = 0; i < 5; i++) {
			await act(async () => {
				await user.click(incrementButton);
			});
		}

		// Then: A message indicating high count should be displayed
		await waitFor(() => {
			expect(screen.getByTestId('message')).toHaveTextContent('High count reached!');
		});
	});

	it('should clear the counter and message when the reset button is clicked', async () => {
		// Given: A SimpleCounter with count at 5 and message displayed
		const user = userEvent.setup();
		render(<SimpleCounter />);
		const incrementButton = screen.getByTestId('increment-btn');
		const resetButton = screen.getByTestId('reset-btn');

		// Set up initial state
		for (let i = 0; i < 5; i++) {
			await act(async () => {
				await user.click(incrementButton);
			});
		}
		expect(screen.getByTestId('message')).toBeInTheDocument();

		// When: The user clicks the reset button
		await act(async () => {
			await user.click(resetButton);
		});

		// Then: The counter should be reset to 0 and the message should be removed
		expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 0');
		expect(screen.queryByTestId('message')).not.toBeInTheDocument();
	});
});
