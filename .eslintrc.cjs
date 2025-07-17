module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['simple-import-sort'],
  rules: {
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^react', '^@?\\w'],
          ['^@\\w'],
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
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
  ignorePatterns: [
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
  ],
};
