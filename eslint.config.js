// Root ESLint configuration for the vite-powerflow monorepo
// This file centralizes all common rules, plugins, and settings for JS/TS/Tests

import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import vitest from 'eslint-plugin-vitest';
import js from '@eslint/js';

// Common import resolver settings
const commonSettings = {
  'import/resolver': {
    node: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.svg', '.png', '.jpg'],
    },
  },
};

// Common plugin references
const commonPlugins = {
  'simple-import-sort': simpleImportSort,
  '@typescript-eslint': tsPlugin,
  import: importPlugin,
  vitest,
};

// Common lint rules for all files
const commonRules = {
  'simple-import-sort/imports': [
    'error',
    {
      groups: [
        // React and external packages
        ['^react', '^@?\\w'],
        // Internal imports with alias (@)
        ['^@\\w'],
        // Relative imports
        ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
        // Style imports
        ['^.+\\.css$'],
      ],
    },
  ],
  'simple-import-sort/exports': 'error',
  'padding-line-between-statements': [
    'error',
    { blankLine: 'always', prev: 'import', next: '*' },
    { blankLine: 'any', prev: 'import', next: 'import' },
  ],
  'import/no-unresolved': 'error',
};

// Common global variables
const commonGlobals = {
  process: 'readonly',
  require: 'readonly',
  module: 'readonly',
  __dirname: 'readonly',
  __filename: 'readonly',
  console: 'readonly',
};

// DRY: Shared config for unused vars in TS (including tests)
const tsNoUnusedVarsRule = [
  'warn',
  {
    args: 'after-used',
    argsIgnorePattern: '^_',
    varsIgnorePattern: '^_',
    ignoreRestSiblings: true,
  },
];

export default [
  {
    // Ignore files and folders that should never be linted
    ignores: [
      'node_modules/**',
      '**/dist/**',
      'dist/**',
      '.next/**',
      '.turbo/**',
      'coverage/**',
      '.pnpm-store/**',
      '.git/**',
      '.devcontainer/**',
      '.vscode/**',
      '.github/**',
      'docs/**',
      '**/eslint.config.js',
      'packages/cli/template/**',
      'vitest.config.ts',
      'vite.config.ts',
    ],
  },
  // JavaScript files (no TypeScript parser, Node.js globals)
  {
    files: ['**/*.{js,jsx,cjs,mjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: commonGlobals,
    },
    plugins: commonPlugins,
    rules: {
      ...js.configs.recommended.rules,
      ...commonRules,
      'no-unused-vars': 'error',
      'no-undef': 'error',
    },
    settings: commonSettings,
  },
  // TypeScript files (with TypeScript parser)
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        projectService: true,
      },
      globals: commonGlobals,
    },
    plugins: commonPlugins,
    rules: {
      ...commonRules,
      ...tsPlugin.configs.recommended.rules,
      'no-unused-vars': 'off', // Disable base rule for TS files
      '@typescript-eslint/no-unused-vars': tsNoUnusedVarsRule,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['./tsconfig.json', './packages/*/tsconfig.json', './apps/*/tsconfig.json'],
        },
      },
    },
  },
  // Vitest test files (test-specific rules)
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    plugins: { vitest, '@typescript-eslint': tsPlugin },
    rules: {
      'vitest/no-focused-tests': 'error',
      'vitest/no-disabled-tests': 'warn',
      'vitest/expect-expect': 'warn',
      '@typescript-eslint/no-unused-vars': tsNoUnusedVarsRule,
      '@typescript-eslint/no-explicit-any': 'off', // Allow any in tests/mocks
      'no-unused-vars': 'off', // Turn off base rule for TypeScript files
      // Add more Vitest rules here if needed
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        projectService: true,
      },
      globals: {
        ...commonGlobals,
        // Vitest globals are added by the plugin
      },
    },
  },
];
