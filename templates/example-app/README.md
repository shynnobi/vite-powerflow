# Example App – Vite Powerflow Monorepo

Minimal React + TypeScript application using Vite, ready to use as a template in the Vite Powerflow monorepo.

## Installation & Start

```sh
pnpm install
pnpm --filter example-app dev
```

## Available Scripts

- `dev`: start the development server
- `build`: production build
- `preview`: preview the production build

## Monorepo Notes

- Dependencies are shared at the monorepo root.
- Scripts must be run with the workspace manager (e.g., pnpm).
- To create a new app: `pnpm generate:app <app-name>`

## Useful Links

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Monorepo README](../../README.md)
