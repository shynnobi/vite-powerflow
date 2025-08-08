import rootConfig from '../../eslint.config.js';

export default [
  ...rootConfig,
  {
    // Ignore the template directory completely
    ignores: ['template/**'],
  },
  {
    files: ['src/**/*.ts', 'build.ts'],
    rules: {
      // Turn off rules that are problematic for CLI tools
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-explicit-any': 'off',

      // Turn off import resolution for CLI, as it uses .js extensions in imports
      'import/no-unresolved': 'off',

      // Turn off stylistic preferences that are not critical for the CLI
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
    },
  },
];
