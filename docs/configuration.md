# Project Configuration

This guide covers the configuration options available in Vite PowerFlow and how to customize them for your project.

## Vite Configuration

The Vite configuration is in `vite.config.ts`. Here are the key options:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	server: {
		port: 5173,
		host: true,
	},
	build: {
		outDir: 'dist',
		sourcemap: true,
	},
});
```

### Common Configuration Options

- **Base URL**: Set the base URL for your application
- **Build Options**: Configure output directory, source maps, etc.
- **Server Options**: Configure development server settings
- **Plugin Options**: Configure React and other plugins

## TypeScript Configuration

The TypeScript configuration is in `tsconfig.json`. Key settings include:

```json
{
	"compilerOptions": {
		"target": "ES2020",
		"useDefineForClassFields": true,
		"lib": ["ES2020", "DOM", "DOM.Iterable"],
		"module": "ESNext",
		"skipLibCheck": true,
		"moduleResolution": "bundler",
		"allowImportingTsExtensions": true,
		"resolveJsonModule": true,
		"isolatedModules": true,
		"noEmit": true,
		"jsx": "react-jsx",
		"strict": true,
		"noUnusedLocals": true,
		"noUnusedParameters": true,
		"noFallthroughCasesInSwitch": true,
		"baseUrl": ".",
		"paths": {
			"@/*": ["src/*"]
		}
	},
	"include": ["src"],
	"references": [{ "path": "./tsconfig.node.json" }]
}
```

## ESLint Configuration

ESLint configuration is in `.eslintrc.cjs`. Key settings include:

```javascript
module.exports = {
	root: true,
	env: {
		browser: true,
		es2020: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react-hooks/recommended',
	],
	ignorePatterns: ['dist', '.eslintrc.cjs'],
	parser: '@typescript-eslint/parser',
	plugins: ['react-refresh'],
	rules: {
		'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
	},
};
```

## Prettier Configuration

Prettier configuration is in `.prettierrc`. Key settings include:

```json
{
	"semi": true,
	"tabWidth": 2,
	"printWidth": 100,
	"singleQuote": true,
	"trailingComma": "all",
	"jsxSingleQuote": true,
	"bracketSpacing": true
}
```

## Testing Configuration

### Vitest Configuration

Vitest configuration is in `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./tests/setup.ts'],
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});
```

### Playwright Configuration

Playwright configuration is in `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './tests/e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',
	use: {
		baseURL: 'http://localhost:5173',
		trace: 'on-first-retry',
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
	webServer: {
		command: 'pnpm dev',
		url: 'http://localhost:5173',
		reuseExistingServer: !process.env.CI,
	},
});
```

## Environment Variables

Environment variables are managed through `.env` files:

- `.env`: Default environment variables
- `.env.local`: Local overrides (not committed)
- `.env.development`: Development environment variables
- `.env.production`: Production environment variables

Example `.env` file:

```env
VITE_APP_TITLE=Vite PowerFlow
VITE_API_URL=http://localhost:3000
```

## Git Configuration

Git configuration includes:

- `.gitignore`: Specifies files to ignore
- `.gitattributes`: Specifies how Git should handle certain files

## VS Code Configuration

VS Code settings are in `.vscode/settings.json`:

```json
{
	"editor.formatOnSave": true,
	"editor.defaultFormatter": "esbenp.prettier-vscode",
	"editor.codeActionsOnSave": {
		"source.fixAll.eslint": true
	}
}
```

## Dev Container Configuration

Dev Container configuration is in `.devcontainer/devcontainer.json`:

```json
{
	"name": "Vite PowerFlow",
	"image": "mcr.microsoft.com/devcontainers/javascript-node:18",
	"features": {
		"ghcr.io/devcontainers/features/node:1": {
			"version": "18"
		}
	},
	"customizations": {
		"vscode": {
			"extensions": [
				"dbaeumer.vscode-eslint",
				"esbenp.prettier-vscode",
				"bradlc.vscode-tailwindcss"
			]
		}
	},
	"forwardPorts": [5173],
	"postCreateCommand": "pnpm install"
}
```
