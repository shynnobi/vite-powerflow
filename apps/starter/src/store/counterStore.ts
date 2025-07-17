import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import { logger } from '@/utils/logger';

/**
 * Counter state interface
 * @interface CounterState
 */
interface CounterState {
  /** Current count value */
  count: number;
  /** Increment count by 1 */
  increment: () => void;
  /** Decrement count by 1 */
  decrement: () => void;
  /** Reset count to 0 */
  reset: () => void;
}

/**
 * Helper to handle storage errors
 * @param action - The storage action being performed
 * @param key - The storage key being accessed
 * @param error - The error that occurred
 */
const handleStorageError = (action: string, key: string, error: unknown) => {
  logger.warn(`Storage operation failed: ${action} ${key}`, error);
};

/**
 * Custom storage implementation with proper error handling
 */
const storage = {
  getItem: (name: string): string | null => {
    try {
      return typeof window !== 'undefined' ? window.localStorage.getItem(name) : null;
    } catch (error) {
      handleStorageError('get', name, error);
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(name, value);
      }
    } catch (error) {
      handleStorageError('set', name, error);
    }
  },
  removeItem: (name: string): void => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(name);
      }
    } catch (error) {
      handleStorageError('remove', name, error);
    }
  },
};

/**
 * Counter store with persistence and devtools
 */
export const useCounterStore = create<CounterState>()(
  devtools(
    persist(
      set => ({
        count: 0,
        increment: () => set(state => ({ count: state.count + 1 })),
        decrement: () => set(state => ({ count: state.count - 1 })),
        reset: () => set({ count: 0 }),
      }),
      {
        name: 'counter-storage',
        storage: createJSONStorage(() => storage),
      }
    ),
    {
      name: 'Counter Store',
    }
  )
);
