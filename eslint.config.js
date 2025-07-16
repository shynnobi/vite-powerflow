import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tsParser from '@typescript-eslint/parser';

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
      globals: {
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        console: 'readonly',
      },
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'no-unused-vars': 'error',
      'no-undef': 'error',
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
    },
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
      globals: {
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        console: 'readonly',
      },
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
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
    },
  },
];
