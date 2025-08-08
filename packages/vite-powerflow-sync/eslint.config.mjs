import rootConfig from '../../eslint.config.js';

export default [
  ...rootConfig,
  {
    files: ['src/**/*.ts'],
    settings: {
      'import/resolver': {
        typescript: {
          project: 'tsconfig.json',
        },
      },
    },
    rules: {
      'import/no-unresolved': [
        'error',
        {
          ignore: ['vscode'],
        },
      ],
    },
  },
];
