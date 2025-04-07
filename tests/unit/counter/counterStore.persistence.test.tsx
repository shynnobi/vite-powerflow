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
		// Mock localStorage
		Object.defineProperty(window, 'localStorage', {
			value: mockLocalStorage,
			writable: true,
		});
		// Reset store state
		useCounterStore.setState({ count: 0 });
		// Clear all mocks
		vi.clearAllMocks();
	});

	afterEach(() => {
		// Restore all mocks
		vi.restoreAllMocks();
	});

	describe('persistence middleware', () => {
		it('should automatically save state changes', () => {
			// When state is changed
			useCounterStore.setState({ count: 42 });

			// Then localStorage should be updated with the new state
			expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
				'counter-storage',
				expect.stringContaining('"count":42')
			);
		});

		it('should handle multiple state changes', () => {
			// When multiple state changes occur
			useCounterStore.setState({ count: 1 });
			useCounterStore.setState({ count: 2 });
			useCounterStore.setState({ count: 3 });

			// Then localStorage should be updated for each change
			expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(3);
			expect(mockLocalStorage.setItem).toHaveBeenLastCalledWith(
				'counter-storage',
				expect.stringContaining('"count":3')
			);
		});

		it('should handle localStorage errors gracefully', () => {
			// Given localStorage throws an error
			mockLocalStorage.setItem.mockImplementation(() => {
				throw new Error('Storage error');
			});

			// When state is changed
			useCounterStore.setState({ count: 42 });

			// Then it should not throw and state should be updated in memory
			expect(useCounterStore.getState().count).toBe(42);
		});
	});
});
