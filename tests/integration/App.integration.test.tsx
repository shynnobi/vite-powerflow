import { BrowserRouter } from 'react-router-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import App from '@/App';
import { useCounterStore } from '@/store/counterStore';

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

	it('should show the initial counter value of 0 when the app is first rendered', () => {
		// Given: The app is rendered with a fresh counter store
		// When: The app is displayed
		// Then: The counter should show 0
		expect(screen.getByTestId('counter-value')).toHaveTextContent('count is 0');
	});

	it('should increase the counter value when the increment button is clicked', () => {
		// Given: The app is rendered with counter at 0
		expect(screen.getByTestId('counter-value')).toHaveTextContent('count is 0');

		// When: The user clicks the increment button
		const incrementButton = screen.getByTestId('increment-button');
		fireEvent.click(incrementButton);

		// Then: The counter should show 1
		expect(screen.getByTestId('counter-value')).toHaveTextContent('count is 1');
	});

	it('should decrease the counter value when the decrement button is clicked', () => {
		// Given: The app is rendered with counter at 0
		expect(screen.getByTestId('counter-value')).toHaveTextContent('count is 0');

		// When: The user clicks the decrement button
		const decrementButton = screen.getByTestId('decrement-button');
		fireEvent.click(decrementButton);

		// Then: The counter should show -1
		expect(screen.getByTestId('counter-value')).toHaveTextContent('count is -1');
	});

	it('should reset the counter to 0 when the reset button is clicked', () => {
		// Given: The app is rendered with counter set to 5
		act(() => {
			useCounterStore.setState({ count: 5 });
		});
		expect(screen.getByTestId('counter-value')).toHaveTextContent('count is 5');

		// When: The user clicks the reset button
		const resetButton = screen.getByTestId('reset-button');
		fireEvent.click(resetButton);

		// Then: The counter should be reset to 0
		expect(screen.getByTestId('counter-value')).toHaveTextContent('count is 0');
	});
});
