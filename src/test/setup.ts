import '@testing-library/jest-dom';
import { beforeEach, afterEach } from 'vitest';
import { expect } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Mock global objects if needed
// global.fetch = vi.fn();

// Reset mocks before each test
beforeEach(() => {
	// vi.resetAllMocks();
});

// Clean up after each test
afterEach(() => {
	cleanup();
});

// Extend Vitest's expect with Testing Library matchers
expect.extend(matchers);
