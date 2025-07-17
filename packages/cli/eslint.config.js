import rootConfig from '../../eslint.config.js';

export default [
  {
    ignores: [
      'template/**', // Ignore the template folder from linting
    ],
  },
  ...rootConfig,
  // Add any CLI-specific overrides below if needed
];
