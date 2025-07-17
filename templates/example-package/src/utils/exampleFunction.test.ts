import { describe, expect, it } from 'vitest';

import { exampleFunction } from '../index.js';

describe('exampleFunction', () => {
  it('returns a greeting', () => {
    expect(exampleFunction('World')).toBe('Hello, World!');
  });
});
