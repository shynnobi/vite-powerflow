import { useState } from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';

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

describe('Example: Component with local state (useState)', () => {
	it('should increment the counter when clicking the button', async () => {
		const user = userEvent.setup();
		render(<SimpleCounter />);

		const incrementButton = screen.getByTestId('increment-btn');
		const countDisplay = screen.getByTestId('count-display');

		// Initial state
		expect(countDisplay).toHaveTextContent('Count: 0');

		// Click increment button
		await act(async () => {
			await user.click(incrementButton);
		});

		// Check if count was updated
		expect(countDisplay).toHaveTextContent('Count: 1');
	});

	it('should show a message when count reaches 5', async () => {
		const user = userEvent.setup();
		render(<SimpleCounter />);

		const incrementButton = screen.getByTestId('increment-btn');

		// Click increment button 5 times
		for (let i = 0; i < 5; i++) {
			await act(async () => {
				await user.click(incrementButton);
			});
		}

		// Check if message appears
		await waitFor(() => {
			expect(screen.getByTestId('message')).toHaveTextContent('High count reached!');
		});
	});

	it('should reset the counter and message', async () => {
		const user = userEvent.setup();
		render(<SimpleCounter />);

		const incrementButton = screen.getByTestId('increment-btn');
		const resetButton = screen.getByTestId('reset-btn');

		// Increment to show message
		for (let i = 0; i < 5; i++) {
			await act(async () => {
				await user.click(incrementButton);
			});
		}

		// Verify message is shown
		expect(screen.getByTestId('message')).toBeInTheDocument();

		// Reset
		await act(async () => {
			await user.click(resetButton);
		});

		// Verify count is reset and message is gone
		expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 0');
		expect(screen.queryByTestId('message')).not.toBeInTheDocument();
	});
});
