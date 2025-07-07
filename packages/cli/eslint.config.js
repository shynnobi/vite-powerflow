import baseConfig from '../../eslint.config.js';

export default [
  {
    ignores: ['./dist/**', './node_modules/**', './template/**'],
  },
  // This block disables parserOptions.project for all root config files (*.config.ts, *.config.*.ts)
  // to avoid ESLint errors when these files are not included in tsconfig.json
  {
    files: ['./*.config.ts', './*.config.*.ts'],
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
  },
  ...baseConfig,
  {
    files: ['vitest.config.ts'],
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
  },
];
