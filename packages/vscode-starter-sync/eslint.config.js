import rootConfig from '../../eslint.config.js';

export default [
  ...rootConfig,
  {
    files: ['src/lib/types.test.ts'],
    rules: {
      'vitest/expect-expect': ['error', { assertFunctionNames: ['expect', 'expectTypeOf'] }],
    },
  },
];
