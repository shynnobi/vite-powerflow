/// <reference lib="dom" />
import { useCounterStore } from '@store/counterStore';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('Counter Store Integration', () => {
	// Clear localStorage before each test
	beforeEach(() => {
		window.localStorage.clear();
		// Reset store to initial state
		useCounterStore.setState({ count: 0 });
	});

	// Clear localStorage after each test
	afterEach(() => {
		window.localStorage.clear();
	});

	it('should persist counter value between store instances', () => {
		// First store instance
		const { result: store1 } = renderHook(() => useCounterStore());

		// Increment counter
		act(() => {
			store1.current.increment();
		});

		expect(store1.current.count).toBe(1);

		// Check if value is in localStorage
		const stored = window.localStorage.getItem('counter-storage');
		expect(stored).not.toBeNull();
		const data = stored ? JSON.parse(stored) : null;
		expect(data?.state.count).toBe(1);

		// Create new store instance
		const { result: store2 } = renderHook(() => useCounterStore());

		// New instance should have the persisted value
		expect(store2.current.count).toBe(1);
	});

	it('should persist multiple updates', () => {
		const { result } = renderHook(() => useCounterStore());

		// Sequence of operations
		act(() => {
			result.current.increment(); // 1
			result.current.increment(); // 2
			result.current.decrement(); // 1
			result.current.increment(); // 2
		});

		// Check final state in store
		expect(result.current.count).toBe(2);

		// Check final state in localStorage
		const stored = window.localStorage.getItem('counter-storage');
		expect(stored).not.toBeNull();
		const data = stored ? JSON.parse(stored) : null;
		expect(data?.state.count).toBe(2);

		// Create new instance to verify persistence
		const { result: newStore } = renderHook(() => useCounterStore());
		expect(newStore.current.count).toBe(2);
	});

	it('should verify localStorage format', () => {
		// First increment to generate data in localStorage
		const { result } = renderHook(() => useCounterStore());
		act(() => {
			result.current.increment();
		});

		// Check data format in localStorage
		const stored = window.localStorage.getItem('counter-storage');
		expect(stored).not.toBeNull();

		// Verify JSON structure is valid and matches expected format
		const data = stored ? JSON.parse(stored) : null;
		expect(data).toHaveProperty('state');
		expect(data?.state).toHaveProperty('count');
		expect(typeof data?.state.count).toBe('number');
	});

	it('should handle reset correctly', () => {
		const { result } = renderHook(() => useCounterStore());

		// Modify state
		act(() => {
			result.current.increment();
			result.current.increment();
		});
		expect(result.current.count).toBe(2);

		// Reset
		act(() => {
			result.current.reset();
		});

		// Verify reset is persisted
		expect(result.current.count).toBe(0);

		// Check in localStorage
		const stored = window.localStorage.getItem('counter-storage');
		expect(stored).not.toBeNull();
		const data = stored ? JSON.parse(stored) : null;
		expect(data?.state.count).toBe(0);

		// New instance should have reset value
		const { result: newStore } = renderHook(() => useCounterStore());
		expect(newStore.current.count).toBe(0);
	});
});
