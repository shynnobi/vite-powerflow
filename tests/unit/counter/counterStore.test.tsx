import { beforeEach, describe, expect, it } from 'vitest';

import { useCounterStore } from '@/store/counterStore';

describe('counterStore', () => {
	beforeEach(() => {
		useCounterStore.setState({ count: 0 });
	});

	it('should increment count', () => {
		useCounterStore.getState().increment();
		expect(useCounterStore.getState().count).toBe(1);
	});

	it('should decrement count', () => {
		useCounterStore.getState().decrement();
		expect(useCounterStore.getState().count).toBe(-1);
	});

	it('should reset count', () => {
		useCounterStore.getState().increment();
		useCounterStore.getState().increment();
		useCounterStore.getState().reset();
		expect(useCounterStore.getState().count).toBe(0);
	});

	it('should set count to specific value', () => {
		useCounterStore.setState({ count: 5 });
		expect(useCounterStore.getState().count).toBe(5);
	});

	it('should handle negative values', () => {
		useCounterStore.setState({ count: -3 });
		expect(useCounterStore.getState().count).toBe(-3);
	});
});
