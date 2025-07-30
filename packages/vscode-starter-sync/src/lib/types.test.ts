import type { CheckResult } from './types.js';

describe('types', () => {
  it('should have a CheckResult type', () => {
    expectTypeOf<CheckResult>().toBeObject();
    expectTypeOf<CheckResult>().toHaveProperty('status');
    expectTypeOf<CheckResult>().toHaveProperty('message');
    expectTypeOf<CheckResult>().toHaveProperty('commitCount');
  });
});
