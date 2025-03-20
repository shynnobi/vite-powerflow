import { useCounterStore } from '@store/counterStore';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import App from '@/App';

describe('App integration with Zustand', () => {
	beforeEach(() => {
		// Reset the store before each test
		useCounterStore.getState().reset();
	});

	it('should display the initial count from the counter store', () => {
		render(<App />);
		expect(screen.getByTestId('counter-value')).toHaveTextContent('Count is 0');
	});

	it('should increment the counter store when the increment button is clicked', () => {
		render(<App />);

		// Find the increment button using data-testid
		const incrementButton = screen.getByTestId('increment-button');

		// Click the button
		fireEvent.click(incrementButton);

		// Check if the count was updated in the Zustand store
		expect(screen.getByTestId('counter-value')).toHaveTextContent('Count is 1');
	});

	it('should decrement the counter store when the decrement button is clicked', () => {
		render(<App />);

		// First increment to 1
		const incrementButton = screen.getByTestId('increment-button');
		fireEvent.click(incrementButton);

		// Find the decrement button
		const decrementButton = screen.getByTestId('decrement-button');

		// Click the decrement button
		fireEvent.click(decrementButton);

		// Check if the count was updated back to 0 in the Zustand store
		expect(screen.getByTestId('counter-value')).toHaveTextContent('Count is 0');
	});

	it('should reset the counter store when the reset button is clicked', () => {
		render(<App />);

		// First increment multiple times
		const incrementButton = screen.getByTestId('increment-button');
		fireEvent.click(incrementButton);
		fireEvent.click(incrementButton);

		// Verify count is 2
		expect(screen.getByTestId('counter-value')).toHaveTextContent('Count is 2');

		// Find the reset button
		const resetButton = screen.getByTestId('reset-button');

		// Click the reset button
		fireEvent.click(resetButton);

		// Check if the count was reset to 0 in the Zustand store
		expect(screen.getByTestId('counter-value')).toHaveTextContent('Count is 0');
	});
});
