import baseConfig from '../../eslint.config.js';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', '.turbo/**'],
  },
  ...baseConfig,
];
