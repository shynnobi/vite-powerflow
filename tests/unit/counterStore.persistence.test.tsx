import { act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface CounterState {
	count: number;
	increment: () => void;
	decrement: () => void;
	reset: () => void;
}

describe('Counter Store Persistence', () => {
	const mockStorage: { [key: string]: string } = {};

	// Mock localStorage
	const mockLocalStorage = {
		getItem: vi.fn((key: string) => mockStorage[key] || null),
		setItem: vi.fn((key: string, value: string) => {
			mockStorage[key] = value;
		}),
		removeItem: vi.fn((key: string) => {
			delete mockStorage[key];
		}),
	};

	// Storage that does nothing (to simulate unavailable localStorage)
	const noopStorage = {
		getItem: () => null,
		setItem: () => undefined,
		removeItem: () => undefined,
	};

	beforeEach(() => {
		// Clear mock storage
		Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
		// Reset mock function calls
		vi.clearAllMocks();
		// Enable fake timers
		vi.useFakeTimers();
		// Reset window.localStorage mock
		vi.stubGlobal('window', { localStorage: mockLocalStorage });
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should persist counter value to storage when updated', async () => {
		// Create a new store instance with mocked storage
		const store = create<CounterState>()(
			persist(
				set => ({
					count: 0,
					increment: () => set(state => ({ count: state.count + 1 })),
					decrement: () => set(state => ({ count: state.count - 1 })),
					reset: () => set({ count: 0 }),
				}),
				{
					name: 'counter-storage',
					storage: createJSONStorage(() => mockLocalStorage),
				}
			)
		);

		// Increment counter
		act(() => {
			store.getState().increment();
		});

		// Wait for next tick to allow persistence middleware to work
		await vi.runAllTimersAsync();

		// Check if value was persisted
		expect(mockLocalStorage.setItem).toHaveBeenCalled();
		const setItemCall = vi.mocked(mockLocalStorage.setItem).mock.calls[0];
		const storedData = JSON.parse(setItemCall?.[1] || '{}');
		expect(storedData.state.count).toBe(1);
	});

	it('should load persisted value from storage on initialization', () => {
		// Setup mock storage with initial value
		const initialData = {
			state: { count: 42 },
			version: 0,
		};
		mockStorage['counter-storage'] = JSON.stringify(initialData);

		// Reset the store to trigger loading from storage
		const store = create<CounterState>()(
			persist(
				set => ({
					count: 0,
					increment: () => set(state => ({ count: state.count + 1 })),
					decrement: () => set(state => ({ count: state.count - 1 })),
					reset: () => set({ count: 0 }),
				}),
				{
					name: 'counter-storage',
					storage: createJSONStorage(() => mockLocalStorage),
				}
			)
		);

		// Check if the persisted value was loaded
		expect(store.getState().count).toBe(42);
		expect(mockLocalStorage.getItem).toHaveBeenCalledWith('counter-storage');
	});

	it('should handle localStorage being unavailable', () => {
		// Mock window.localStorage as undefined
		vi.stubGlobal('window', { localStorage: undefined });

		// Create a new store instance with noop storage
		const store = create<CounterState>()(
			persist(
				set => ({
					count: 0,
					increment: () => set(state => ({ count: state.count + 1 })),
					decrement: () => set(state => ({ count: state.count - 1 })),
					reset: () => set({ count: 0 }),
				}),
				{
					name: 'counter-storage',
					storage: createJSONStorage(() => noopStorage),
				}
			)
		);

		// Should not throw when using the store
		expect(() => {
			store.getState().increment();
		}).not.toThrow();

		// Count should still work in memory
		expect(store.getState().count).toBe(1);
	});

	it('should handle corrupted JSON data in localStorage', () => {
		// Setup corrupt data in localStorage
		mockStorage['counter-storage'] = 'not-valid-json';

		// Create a storage that returns invalid JSON
		const errorStorage = {
			getItem: () => {
				return 'not-valid-json';
			},
			setItem: mockLocalStorage.setItem,
			removeItem: mockLocalStorage.removeItem,
		};

		// Initialize store - should fallback to default values
		const store = create<CounterState>()(
			persist(
				set => ({
					count: 0,
					increment: () => set(state => ({ count: state.count + 1 })),
					decrement: () => set(state => ({ count: state.count - 1 })),
					reset: () => set({ count: 0 }),
				}),
				{
					name: 'counter-storage',
					storage: createJSONStorage(() => errorStorage),
				}
			)
		);

		// Store should use default values when data is corrupted
		expect(store.getState().count).toBe(0);

		// Operations should still work
		act(() => {
			store.getState().increment();
		});
		expect(store.getState().count).toBe(1);
	});

	it('should handle missing state property in localStorage', () => {
		// Setup invalid data structure (missing state property)
		const invalidData = {
			version: 0,
			// state property is missing
		};
		mockStorage['counter-storage'] = JSON.stringify(invalidData);

		// Initialize store - should use default values for missing state
		const store = create<CounterState>()(
			persist(
				set => ({
					count: 0,
					increment: () => set(state => ({ count: state.count + 1 })),
					decrement: () => set(state => ({ count: state.count - 1 })),
					reset: () => set({ count: 0 }),
				}),
				{
					name: 'counter-storage',
					storage: createJSONStorage(() => mockLocalStorage),
				}
			)
		);

		// Should use default count value (0) when state is missing
		expect(store.getState().count).toBe(0);
	});

	it('should handle invalid value types in localStorage', () => {
		// Setup data with invalid type for count (string instead of number)
		const invalidTypeData = {
			state: { count: 'not-a-number' },
			version: 0,
		};
		mockStorage['counter-storage'] = JSON.stringify(invalidTypeData);

		// Initialize store
		const store = create<CounterState>()(
			persist(
				set => ({
					count: 0,
					increment: () => set(state => ({ count: state.count + 1 })),
					decrement: () => set(state => ({ count: state.count - 1 })),
					reset: () => set({ count: 0 }),
				}),
				{
					name: 'counter-storage',
					storage: createJSONStorage(() => mockLocalStorage),
				}
			)
		);

		// Verify that the count is a string (as loaded from localStorage)
		expect(typeof store.getState().count).toBe('string');

		// Operations should still work correctly after we set a numeric value
		act(() => {
			// Reset to set a proper numeric value
			store.getState().reset();
			// Then increment
			store.getState().increment();
		});

		// Now it should be a number
		expect(typeof store.getState().count).toBe('number');
		expect(store.getState().count).toBe(1);
	});
});
