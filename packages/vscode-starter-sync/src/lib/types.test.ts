/// <reference types="vitest" />
import type { CheckResult } from './types';

describe('types', () => {
  it('CheckResult should be an object type', () => {
    expectTypeOf<CheckResult>().toBeObject();
  });
});
