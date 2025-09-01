module.exports = {
  '*.{js,jsx,ts,tsx,mjs,mts,cjs,cts,json,md,yml,yaml}': ['tsx scripts/lintstaged-turbo.ts'],
  '!packages/cli/template/**': [],
};
