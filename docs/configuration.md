# Project Configuration

This guide provides an overview of the key configuration files in Vite PowerFlow.

## Configuration Files Overview

| File                   | Purpose                                          | Documentation                                                     |
| ---------------------- | ------------------------------------------------ | ----------------------------------------------------------------- |
| `vite.config.ts`       | Configures Vite bundler, plugins, and dev server | [Vite Docs](https://vitejs.dev/config/)                           |
| `tsconfig.json`        | TypeScript compiler options                      | [TypeScript Docs](https://www.typescriptlang.org/tsconfig)        |
| `.eslintrc.cjs`        | Code linting rules                               | [ESLint Docs](https://eslint.org/docs/user-guide/configuring/)    |
| `.prettierrc`          | Code formatting rules                            | [Prettier Docs](https://prettier.io/docs/en/options.html)         |
| `vitest.config.ts`     | Unit testing configuration                       | [Vitest Docs](https://vitest.dev/config/)                         |
| `playwright.config.ts` | E2E testing configuration                        | [Playwright Docs](https://playwright.dev/docs/test-configuration) |
| `.env` files           | Environment variables                            | [Vite Env Variables](https://vitejs.dev/guide/env-and-mode.html)  |

## Environment Variables

Environment variables are managed through `.env` files:

- `.env`: Default environment variables for all environments
- `.env.local`: Local overrides (not committed to version control)
- `.env.development`: Variables for development environment
- `.env.production`: Variables for production environment

All environment variables must be prefixed with `VITE_` to be accessible in your code:

```
VITE_APP_TITLE=Vite PowerFlow
VITE_API_URL=https://api.example.com
```

Access variables in your code with `import.meta.env.VITE_VARIABLE_NAME`.
