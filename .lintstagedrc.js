export default {
	'*.{js,jsx,ts,tsx}': ['prettier --write', 'eslint --fix --max-warnings=0 --cache'],
	'*.{json,yml,yaml,md}': ['prettier --write'],
	'*.{css,scss}': ['prettier --write'],
};
