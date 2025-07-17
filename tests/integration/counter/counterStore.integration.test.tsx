/// <reference lib="dom" />
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { useCounterStore } from '@/store/counterStore';

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

  it('should maintain counter value across different store instances when persisted', () => {
    // Given: A counter store instance with an incremented value
    const { result: store1 } = renderHook(() => useCounterStore());
    act(() => {
      store1.current.increment();
    });
    expect(store1.current.count).toBe(1);

    // When: The value is stored in localStorage
    const stored = window.localStorage.getItem('counter-storage');
    expect(stored).not.toBeNull();
    const data = stored ? JSON.parse(stored) : null;
    expect(data?.state.count).toBe(1);

    // Then: A new store instance should have the same persisted value
    const { result: store2 } = renderHook(() => useCounterStore());
    expect(store2.current.count).toBe(1);
  });

  it('should persist multiple counter operations in sequence', () => {
    // Given: A counter store instance
    const { result } = renderHook(() => useCounterStore());

    // When: Multiple operations are performed in sequence
    act(() => {
      result.current.increment(); // 1
      result.current.increment(); // 2
      result.current.decrement(); // 1
      result.current.increment(); // 2
    });

    // Then: The final state should be correct in both store and localStorage
    expect(result.current.count).toBe(2);

    const stored = window.localStorage.getItem('counter-storage');
    expect(stored).not.toBeNull();
    const data = stored ? JSON.parse(stored) : null;
    expect(data?.state.count).toBe(2);

    // And: A new store instance should reflect the final state
    const { result: newStore } = renderHook(() => useCounterStore());
    expect(newStore.current.count).toBe(2);
  });

  it('should store counter data in the correct localStorage format', () => {
    // Given: A counter store with an incremented value
    const { result } = renderHook(() => useCounterStore());
    act(() => {
      result.current.increment();
    });

    // When: The data is stored in localStorage
    const stored = window.localStorage.getItem('counter-storage');
    expect(stored).not.toBeNull();

    // Then: The stored data should have the correct structure
    const data = stored ? JSON.parse(stored) : null;
    expect(data).toHaveProperty('state');
    expect(data?.state).toHaveProperty('count');
    expect(typeof data?.state.count).toBe('number');
  });

  it('should persist counter reset across store instances', () => {
    // Given: A counter store with a modified value
    const { result } = renderHook(() => useCounterStore());
    act(() => {
      result.current.increment();
      result.current.increment();
    });
    expect(result.current.count).toBe(2);

    // When: The counter is reset
    act(() => {
      result.current.reset();
    });

    // Then: The reset value should be persisted
    expect(result.current.count).toBe(0);

    const stored = window.localStorage.getItem('counter-storage');
    expect(stored).not.toBeNull();
    const data = stored ? JSON.parse(stored) : null;
    expect(data?.state.count).toBe(0);

    // And: A new store instance should have the reset value
    const { result: newStore } = renderHook(() => useCounterStore());
    expect(newStore.current.count).toBe(0);
  });
});
