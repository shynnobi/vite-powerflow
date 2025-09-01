export default {
  '*.{js,jsx,ts,tsx}': ['pnpm format:fix', 'pnpm lint:fix'],
  '*.{json,yml,yaml,md}': ['pnpm format:fix'],
};
