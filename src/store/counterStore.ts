import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { logger } from '../utils/logger';

interface CounterState {
	count: number;
	increment: () => void;
	decrement: () => void;
	reset: () => void;
}

// Helper to handle storage errors
const handleStorageError = (action: string, key: string, error: unknown) => {
	logger.warn(`Storage operation failed: ${action} ${key}`, error);
};

// Custom storage implementation with proper error handling
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

export const useCounterStore = create<CounterState>()(
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
	)
);
