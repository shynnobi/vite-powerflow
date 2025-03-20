import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

import '@testing-library/jest-dom';

declare global {
	var localStorage: Storage;
}

// Nettoyage automatique après chaque test
afterEach(() => {
	cleanup();
});
