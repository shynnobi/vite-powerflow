module.exports = {
  '*': "pnpm turbo run sort-package-json --filter='{./**/*}'",
  '*': "pnpm turbo run format --filter='{./**/*}'",
  '*': "pnpm turbo run lint:fix --filter='{./**/*}'",
};
