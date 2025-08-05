import rootConfig from '../../eslint.config.js';

export default [
  {
    // Ignore the template folder from linting
    ignores: ['template/**'],
  },
  ...rootConfig,
  // Add any CLI-specific overrides below if needed
];
