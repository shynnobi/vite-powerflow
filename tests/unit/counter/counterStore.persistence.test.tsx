import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useCounterStore } from '@/store/counterStore';

describe('counterStore persistence', () => {
	const mockLocalStorage = {
		getItem: vi.fn(),
		setItem: vi.fn(),
		clear: vi.fn(),
		removeItem: vi.fn(),
	};

	beforeEach(() => {
		// Given: A mocked localStorage and reset store state
		Object.defineProperty(window, 'localStorage', {
			value: mockLocalStorage,
			writable: true,
		});
		useCounterStore.setState({ count: 0 });
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('persistence middleware', () => {
		it('should save the counter state to localStorage when the count is updated', () => {
			// Given: The counter store is initialized with count 0
			// When: The count is updated to 42
			useCounterStore.setState({ count: 42 });

			// Then: The new state should be saved to localStorage
			expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
				'counter-storage',
				expect.stringContaining('"count":42')
			);
		});

		it('should save each counter state change to localStorage when multiple updates occur', () => {
			// Given: The counter store is initialized with count 0
			// When: The count is updated multiple times
			useCounterStore.setState({ count: 1 });
			useCounterStore.setState({ count: 2 });
			useCounterStore.setState({ count: 3 });

			// Then: Each state change should be saved to localStorage
			expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(3);
			// And: The final state should be saved last
			expect(mockLocalStorage.setItem).toHaveBeenLastCalledWith(
				'counter-storage',
				expect.stringContaining('"count":3')
			);
		});

		it('should maintain in-memory state when localStorage operations fail', () => {
			// Given: localStorage operations will throw an error
			mockLocalStorage.setItem.mockImplementation(() => {
				throw new Error('Storage error');
			});

			// When: The count is updated to 42
			useCounterStore.setState({ count: 42 });

			// Then: The state should still be updated in memory
			expect(useCounterStore.getState().count).toBe(42);
		});
	});
});
