module.exports = {
  // Task 1: Run linting, formatting, and intelligent testing on a wide range of files.
  '*.{js,jsx,ts,tsx,mjs,mts,cjs,cts,json,md,yml,yaml}': ['tsx scripts/lintstaged-turbo.ts'],

  // Exclude the template directory from all checks.
  '!packages/cli/template/**': [],
};
