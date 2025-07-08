export default {
  '*.{js,jsx,ts,tsx}': ['prettier --check', 'eslint --fix --max-warnings=0 --cache'],
  '*.{json,yml,yaml,md}': ['prettier --check'],
  '*.{css,scss}': ['prettier --check'],
};
