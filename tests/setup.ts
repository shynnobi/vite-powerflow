import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

import '@testing-library/jest-dom';

declare global {
	var localStorage: Storage;
}

// Automatic cleanup after each test
afterEach(() => {
	cleanup();
});
