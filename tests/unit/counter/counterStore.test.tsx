import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { beforeEach, describe, expect, it } from 'vitest';

import Home from '@/pages/Home';
import { useCounterStore } from '@/store/counterStore';

expect.extend(toHaveNoViolations);

describe('counterStore', () => {
	beforeEach(() => {
		useCounterStore.setState({ count: 0 });
	});

	it('should increment the count when the increment action is called', () => {
		// Given: The counter is at 0
		expect(useCounterStore.getState().count).toBe(0);

		// When: The increment action is called
		useCounterStore.getState().increment();

		// Then: The count should be 1
		expect(useCounterStore.getState().count).toBe(1);
	});

	it('should decrement the count when the decrement action is called', () => {
		// Given: The counter is at 0
		expect(useCounterStore.getState().count).toBe(0);

		// When: The decrement action is called
		useCounterStore.getState().decrement();

		// Then: The count should be -1
		expect(useCounterStore.getState().count).toBe(-1);
	});

	it('should reset the count to 0 when the reset action is called', () => {
		// Given: The counter is at 2
		useCounterStore.getState().increment();
		useCounterStore.getState().increment();
		expect(useCounterStore.getState().count).toBe(2);

		// When: The reset action is called
		useCounterStore.getState().reset();

		// Then: The count should be 0
		expect(useCounterStore.getState().count).toBe(0);
	});

	it('should set the count to a specific value when setState is called', () => {
		// Given: The counter is at 0
		expect(useCounterStore.getState().count).toBe(0);

		// When: The count is set to 5
		useCounterStore.setState({ count: 5 });

		// Then: The count should be 5
		expect(useCounterStore.getState().count).toBe(5);
	});

	it('should handle negative values when setState is called', () => {
		// Given: The counter is at 0
		expect(useCounterStore.getState().count).toBe(0);

		// When: The count is set to -3
		useCounterStore.setState({ count: -3 });

		// Then: The count should be -3
		expect(useCounterStore.getState().count).toBe(-3);
	});

	it('Home counter section should have no accessibility violations', async () => {
		const { container } = render(<Home />);
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});
});
