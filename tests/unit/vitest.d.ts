/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';
import type { expect } from 'vitest';
import '@testing-library/jest-dom';

declare module 'vitest' {
	interface Assertion<T = unknown>
		extends TestingLibraryMatchers<typeof expect.stringContaining, T> {
		// Add custom matchers here if needed
		toBeInTheDocument(): void;
	}
}
