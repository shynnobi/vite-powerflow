import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default [
	js.configs.recommended,
	{
		files: ['**/*.{ts,tsx}'],
		ignores: ['dist/**', 'coverage/**'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parser: tsParser,
			parserOptions: {
				ecmaFeatures: { jsx: true },
				project: ['./tsconfig.eslint.json'],
				tsconfigRootDir: '.',
			},
			globals: {
				...globals.browser,
				...globals.node,
				React: true,
			},
		},
		plugins: {
			'@typescript-eslint': tsPlugin,
			react: reactPlugin,
			'react-hooks': reactHooksPlugin,
			'react-refresh': reactRefreshPlugin,
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
		rules: {
			...tsPlugin.configs['eslint-recommended'].rules,
			...tsPlugin.configs['recommended'].rules,
			...reactPlugin.configs.recommended.rules,
			...reactHooksPlugin.configs.recommended.rules,
			'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
			'react/react-in-jsx-scope': 'off',
		},
	},
	{
		files: ['**/*.d.ts'],
		rules: {
			'@typescript-eslint/triple-slash-reference': 'off',
		},
	},
	{
		files: ['**/*.{js,cjs,mjs}'],
		ignores: ['dist/**', 'coverage/**'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.node,
			},
		},
	},
];
