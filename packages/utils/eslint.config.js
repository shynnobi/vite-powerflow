import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

const nodeGlobals = {
  process: 'readonly',
  console: 'readonly',
  __dirname: 'readonly',
  __filename: 'readonly',
  Buffer: 'readonly',
  global: 'readonly',
  module: 'readonly',
  require: 'readonly',
  exports: 'readonly',
};

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      '.turbo/**',
      'vitest.config.ts',
      '*.config.ts',
      '*.config.js',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      globals: nodeGlobals,
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mtx'],
    languageOptions: {
      parser: tsParser,
      globals: nodeGlobals,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
    },
  },
];
