import rootConfig from '../../eslint.config.js';

export default [
  ...rootConfig,
  {
    files: ['src/lib/types.test.ts'],
    rules: {
      // Autorise les tests de type sans assertion runtime
      'vitest/expect-expect': ['error', { assertFunctionNames: ['expect', 'expectTypeOf'] }],
    },
  },
];
