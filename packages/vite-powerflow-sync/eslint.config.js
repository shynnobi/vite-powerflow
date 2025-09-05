import rootConfig from '../../eslint.config.js';

export default [
  ...rootConfig,
  {
    files: ['src/**/*.ts'],
    ignores: ['dist', 'scripts/bundle-extension.ts'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Add any extension-specific rules here
    },
  },
];
