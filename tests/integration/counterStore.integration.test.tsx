/// <reference lib="dom" />
import { useCounterStore } from '@store/counterStore';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('Counter Store Integration', () => {
	// Nettoyer le localStorage avant chaque test
	beforeEach(() => {
		window.localStorage.clear();
		// Réinitialiser le store
		useCounterStore.setState({ count: 0 });
	});

	// Nettoyer le localStorage après chaque test
	afterEach(() => {
		window.localStorage.clear();
	});

	it('should persist counter value between store instances', () => {
		// Première instance du store
		const { result: store1 } = renderHook(() => useCounterStore());

		// Incrémenter le compteur
		act(() => {
			store1.current.increment();
		});

		expect(store1.current.count).toBe(1);

		// Vérifier que la valeur est dans localStorage
		const stored = window.localStorage.getItem('counter-storage');
		expect(stored).not.toBeNull();
		const data = stored ? JSON.parse(stored) : null;
		expect(data?.state.count).toBe(1);

		// Créer une nouvelle instance du store
		const { result: store2 } = renderHook(() => useCounterStore());

		// La nouvelle instance devrait avoir la valeur persistée
		expect(store2.current.count).toBe(1);
	});

	it('should persist multiple updates', () => {
		const { result } = renderHook(() => useCounterStore());

		// Séquence d'opérations
		act(() => {
			result.current.increment(); // 1
			result.current.increment(); // 2
			result.current.decrement(); // 1
			result.current.increment(); // 2
		});

		// Vérifier l'état final dans le store
		expect(result.current.count).toBe(2);

		// Vérifier l'état final dans localStorage
		const stored = window.localStorage.getItem('counter-storage');
		expect(stored).not.toBeNull();
		const data = stored ? JSON.parse(stored) : null;
		expect(data?.state.count).toBe(2);

		// Créer une nouvelle instance pour vérifier la persistance
		const { result: newStore } = renderHook(() => useCounterStore());
		expect(newStore.current.count).toBe(2);
	});

	it('should verify localStorage format', () => {
		// Incrémenter d'abord pour générer des données dans localStorage
		const { result } = renderHook(() => useCounterStore());
		act(() => {
			result.current.increment();
		});

		// Vérifier le format des données dans localStorage
		const stored = window.localStorage.getItem('counter-storage');
		expect(stored).not.toBeNull();

		// Vérifier que c'est un JSON valide avec la structure attendue
		const data = stored ? JSON.parse(stored) : null;
		expect(data).toHaveProperty('state');
		expect(data?.state).toHaveProperty('count');
		expect(typeof data?.state.count).toBe('number');
	});

	it('should handle reset correctly', () => {
		const { result } = renderHook(() => useCounterStore());

		// Modifier l'état
		act(() => {
			result.current.increment();
			result.current.increment();
		});
		expect(result.current.count).toBe(2);

		// Reset
		act(() => {
			result.current.reset();
		});

		// Vérifier que le reset est persisté
		expect(result.current.count).toBe(0);

		// Vérifier dans localStorage
		const stored = window.localStorage.getItem('counter-storage');
		expect(stored).not.toBeNull();
		const data = stored ? JSON.parse(stored) : null;
		expect(data?.state.count).toBe(0);

		// Nouvelle instance devrait avoir la valeur reset
		const { result: newStore } = renderHook(() => useCounterStore());
		expect(newStore.current.count).toBe(0);
	});
});
