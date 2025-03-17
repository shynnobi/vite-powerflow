import { describe, it, expect, beforeEach } from 'vitest';
import { useCounterStore } from '@store/counterStore';

describe('Counter store with Zustand', () => {
	beforeEach(() => {
		// Reset the store before each test
		useCounterStore.getState().reset();
	});

	it('should initialize with count = 0', () => {
		const { count } = useCounterStore.getState();
		expect(count).toBe(0);
	});

	it('should increment the counter', () => {
		const { increment } = useCounterStore.getState();
		increment();
		expect(useCounterStore.getState().count).toBe(1);
	});

	it('should decrement the counter', () => {
		const { increment, decrement } = useCounterStore.getState();
		// First increment to 1, then decrement to 0
		increment();
		decrement();
		expect(useCounterStore.getState().count).toBe(0);
	});

	it('should reset the counter to 0', () => {
		const { increment, reset } = useCounterStore.getState();
		// Increment multiple times
		increment();
		increment();
		increment();
		expect(useCounterStore.getState().count).toBe(3);

		// Reset
		reset();
		expect(useCounterStore.getState().count).toBe(0);
	});

	it('should handle multiple operations in sequence', () => {
		const { increment, decrement } = useCounterStore.getState();

		increment(); // 1
		increment(); // 2
		decrement(); // 1
		increment(); // 2

		expect(useCounterStore.getState().count).toBe(2);
	});
});
