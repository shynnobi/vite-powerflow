import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface CounterState {
	count: number;
	increment: () => void;
	decrement: () => void;
	reset: () => void;
}

// Créer un storage personnalisé qui gère les erreurs silencieusement
const storage = {
	getItem: (name: string): string | null => {
		try {
			return typeof window !== 'undefined' ? window.localStorage.getItem(name) : null;
		} catch {
			return null;
		}
	},
	setItem: (name: string, value: string): void => {
		try {
			if (typeof window !== 'undefined') {
				window.localStorage.setItem(name, value);
			}
		} catch {
			// Ignorer les erreurs silencieusement
		}
	},
	removeItem: (name: string): void => {
		try {
			if (typeof window !== 'undefined') {
				window.localStorage.removeItem(name);
			}
		} catch {
			// Ignorer les erreurs silencieusement
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
