import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../src/App';
import { useCounterStore } from '../../src/store/counterStore';

describe('App Integration with Counter Store', () => {
	beforeEach(() => {
		// Reset the store before each test
		useCounterStore.getState().reset();
	});

	it('should display the initial count from the store', () => {
		render(<App />);
		expect(screen.getByText(/count is 0/i)).toBeInTheDocument();
	});

	it('should increment the count when the increment button is clicked', () => {
		render(<App />);

		// Find the increment button (there are two, so we'll use the first one)
		const incrementButton = screen.getByText(/count is 0/i);

		// Click the button
		fireEvent.click(incrementButton);

		// Check if the count was updated
		expect(screen.getByText(/count is 1/i)).toBeInTheDocument();
	});

	it('should decrement the count when the decrement button is clicked', () => {
		render(<App />);

		// First increment to 1
		const incrementButton = screen.getByText(/count is 0/i);
		fireEvent.click(incrementButton);

		// Find the decrement button
		const decrementButton = screen.getByText('Decrement');

		// Click the decrement button
		fireEvent.click(decrementButton);

		// Check if the count was updated back to 0
		expect(screen.getByText(/count is 0/i)).toBeInTheDocument();
	});

	it('should reset the count when the reset button is clicked', () => {
		render(<App />);

		// First increment multiple times
		const incrementButton = screen.getByText(/count is 0/i);
		fireEvent.click(incrementButton);
		fireEvent.click(incrementButton);

		// Verify count is 2
		expect(screen.getByText(/count is 2/i)).toBeInTheDocument();

		// Find the reset button
		const resetButton = screen.getByText('Reset');

		// Click the reset button
		fireEvent.click(resetButton);

		// Check if the count was reset to 0
		expect(screen.getByText(/count is 0/i)).toBeInTheDocument();
	});
});
