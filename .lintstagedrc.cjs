module.exports = {
  // Task 1: Run linting and formatting on a wide range of files.
  '*.{js,jsx,ts,tsx,mjs,mts,cjs,cts,json,md,yml,yaml}': ['tsx scripts/lintstaged-turbo.ts'],

  // Task 2: Run unit and integration tests ONLY if source code files were changed.
  // We use a function to prevent lint-staged from appending filenames to the command.
  '**/*.{ts,tsx,js,jsx}': () => 'pnpm test',

  // Exclude the template directory from all checks.
  '!packages/cli/template/**': [],
};
