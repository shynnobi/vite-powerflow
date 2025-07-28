import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { Counter } from './Counter';

import { useCounterStore } from '@/store/counterStore';

vi.mock('@/store/counterStore');

const mockUseCounterStore = useCounterStore as unknown as Mock;

type StoreProps = {
  count?: number;
  increment?: () => void;
  decrement?: () => void;
  reset?: () => void;
};

function setupStore({ count = 0, increment, decrement, reset }: StoreProps = {}) {
  mockUseCounterStore.mockReturnValue({
    count,
    increment: increment || vi.fn(),
    decrement: decrement || vi.fn(),
    reset: reset || vi.fn(),
  });
}

describe('Counter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display the current count', () => {
    // Given: The store is set up with a count of 42
    setupStore({ count: 42 });
    // When: The Counter component is rendered
    render(<Counter />);
    // Then: The displayed value should show 'count is 42'
    expect(screen.getByTestId('counter-value')).toHaveTextContent('count is 42');
  });

  it('should call increment when increment button is clicked', async () => {
    // Given: The store is set up with a mock increment function
    const increment = vi.fn();
    setupStore({ increment });
    render(<Counter />);
    const user = userEvent.setup();

    // When: The user clicks the increment button
    await user.click(screen.getByTestId('increment-button'));

    // Then: The increment function should be called
    expect(increment).toHaveBeenCalled();
  });

  it('should call decrement when decrement button is clicked', async () => {
    // Given: The store is set up with a mock decrement function
    const decrement = vi.fn();
    setupStore({ decrement });
    render(<Counter />);
    const user = userEvent.setup();

    // When: The user clicks the decrement button
    await user.click(screen.getByTestId('decrement-button'));

    // Then: The decrement function should be called
    expect(decrement).toHaveBeenCalled();
  });

  it('should call reset when reset button is clicked', async () => {
    // Given: The store is set up with a mock reset function
    const reset = vi.fn();
    setupStore({ reset });
    render(<Counter />);
    const user = userEvent.setup();

    // When: The user clicks the reset button
    await user.click(screen.getByTestId('reset-button'));

    // Then: The reset function should be called
    expect(reset).toHaveBeenCalled();
  });
});
