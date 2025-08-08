import rootConfig from '../../eslint.config.js';

const localSettings = {
  'import/resolver': {
    typescript: {
      alwaysTryTypes: true,
      project: ['./tsconfig.eslint.json'],
    },
    node: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
  },
};

export default [
  {
    // Ignore files excluded from tsconfig
    ignores: ['src/build.ts', 'src/**/*.test.ts', 'src/**/*.spec.ts'],
    settings: localSettings,
  },
  ...rootConfig,
];
