export default {
  '*.{js,jsx,ts,tsx}': ['pnpm format:fix:standalone', 'pnpm lint:fix:standalone'],
  '*.{json,yml,yaml,md}': ['pnpm format:fix:standalone'],
};
