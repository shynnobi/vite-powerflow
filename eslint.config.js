import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import vitest from 'eslint-plugin-vitest';

// Common settings and plugins
const commonSettings = {
  'import/resolver': {
    node: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.svg', '.png', '.jpg'],
    },
  },
};

const commonPlugins = {
  'simple-import-sort': simpleImportSort,
  import: importPlugin,
  vitest,
};

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

const commonGlobals = {
  process: 'readonly',
  require: 'readonly',
  module: 'readonly',
  __dirname: 'readonly',
  __filename: 'readonly',
  console: 'readonly',
};

export default [
  {
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
  // Configuration for JavaScript files (without TypeScript parser, with Node.js globals)
  {
    files: ['**/*.{js,jsx,cjs,mjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: commonGlobals,
    },
    plugins: commonPlugins,
    rules: {
      ...commonRules,
      'no-unused-vars': 'error',
      'no-undef': 'error',
    },
    settings: commonSettings,
  },
  // Configuration for TypeScript files (avec TypeScript parser)
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
    rules: commonRules,
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['./tsconfig.json', './packages/*/tsconfig.json', './apps/*/tsconfig.json'],
        },
      },
    },
  },
  // Configuration for Vitest test files (compatible flat config)
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    plugins: { vitest },
    rules: {
      'vitest/no-focused-tests': 'error',
      'vitest/no-disabled-tests': 'warn',
      'vitest/expect-expect': 'warn',
      'no-unused-vars': ['warn', { args: 'after-used', argsIgnorePattern: '^_' }],
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
