import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import storybookPlugin from 'eslint-plugin-storybook';
import globals from 'globals';

export default [
	{
		ignores: ['node_modules/**', 'dist/**', 'coverage/**', 'test-results/**'],
	},
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	// Storybook config
	{
		files: ['**/*.stories.@(ts|tsx|js|jsx|mdx)', '.storybook/**/*'],
		plugins: {
			storybook: storybookPlugin,
		},
		rules: {
			...storybookPlugin.configs.recommended.rules,
		},
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
		},
		linterOptions: {
			reportUnusedDisableDirectives: true,
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
		rules: {
			'no-console': ['warn', { allow: ['warn', 'error'] }],
			'no-debugger': 'warn',
			'no-var': 'error',
			'prefer-const': 'error',
			'@typescript-eslint/no-non-null-assertion': 'warn',
		},
	},
	{
		files: ['**/*.{ts,tsx}'],
		plugins: {
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
		},
		rules: {
			'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
		},
	},
	// Specific rule for shadcn UI components
	{
		files: ['**/src/components/ui/**/*.{ts,tsx}'],
		rules: {
			'react-refresh/only-export-components': 'off',
		},
	},
	// Override for Storybook files with relaxed rules
	{
		files: ['**/*.stories.@(ts|tsx|js|jsx|mdx)', '.storybook/**/*'],
		rules: {
			// Typical relaxed rules for stories
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': 'warn',
			'import/no-default-export': 'off',
			'react/jsx-props-no-spreading': 'off',
			'react/function-component-definition': 'off',
		},
	},
];
