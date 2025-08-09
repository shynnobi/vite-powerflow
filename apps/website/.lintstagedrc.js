export default {
  '*.{js,jsx,ts,tsx}': ['prettier --check', 'eslint --fix --cache'],
  '*.{json,yml,yaml,md}': ['prettier --check'],
  '*.{css,scss}': ['prettier --check'],
};
