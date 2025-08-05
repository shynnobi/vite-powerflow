import rootConfig from '../../eslint.config.js';

export default [
  {
    // Ignore files excluded from tsconfig
    ignores: ['src/build.ts', 'src/**/*.test.ts', 'src/**/*.spec.ts'],
  },
  ...rootConfig,
];
