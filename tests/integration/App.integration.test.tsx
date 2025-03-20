import { BrowserRouter } from 'react-router-dom';
import { useCounterStore } from '@store/counterStore';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import App from '@/App';

describe('App integration with Zustand', () => {
	beforeEach(() => {
		// Reset the store before each test
		act(() => {
			useCounterStore.setState({ count: 0 });
		});
		// Render the app before each test
		render(
			<BrowserRouter>
				<App />
			</BrowserRouter>
		);
	});

	it('should display the initial count from the counter store', () => {
		expect(screen.getByTestId('counter-value')).toHaveTextContent('count is 0');
	});

	it('should increment the counter store when the increment button is clicked', () => {
		// Find the increment button using data-testid
		const incrementButton = screen.getByTestId('increment-button');

		// Click the button
		fireEvent.click(incrementButton);

		// Check if the count was updated in the Zustand store
		expect(screen.getByTestId('counter-value')).toHaveTextContent('count is 1');
	});

	it('should decrement the counter store when the decrement button is clicked', () => {
		// Find the decrement button
		const decrementButton = screen.getByTestId('decrement-button');

		// Click the decrement button
		fireEvent.click(decrementButton);

		// Check if the count was decremented to -1
		expect(screen.getByTestId('counter-value')).toHaveTextContent('count is -1');
	});

	it('should reset the counter store when the reset button is clicked', () => {
		act(() => {
			useCounterStore.setState({ count: 5 });
		});

		// Find the reset button
		const resetButton = screen.getByTestId('reset-button');

		// Click the reset button
		fireEvent.click(resetButton);

		// Check if the count was reset to 0 in the Zustand store
		expect(screen.getByTestId('counter-value')).toHaveTextContent('count is 0');
	});
});
