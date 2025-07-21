# @vite-powerflow/create

Create modern React + Vite apps with production-ready tooling, testing, and best practices. Includes TypeScript, Tailwind CSS, shadcn/ui, Zustand, TanStack Query, and more.

## Quick Start

```bash
npx @vite-powerflow/create my-app
cd my-app
npm run dev
```

## Development

### Testing

The CLI includes multiple test types optimized for different scenarios:

#### Fast Development Tests (Recommended for daily work)

```bash
# Unit tests only - very fast (~500ms)
pnpm test:unit

# Development tests with verbose output
pnpm test:dev

# Watch mode for unit tests
pnpm test:watch:unit
```

#### Integration Tests (For CI/CD)

```bash
# All tests including E2E (slower, ~12s)
pnpm test

# Integration tests only (E2E + smoke)
pnpm test:integration
```

#### Test Performance

| Test Type   | Duration | Use Case          |
| ----------- | -------- | ----------------- |
| Unit tests  | ~500ms   | Daily development |
| Integration | ~12s     | CI/CD, pre-commit |
| All tests   | ~12s     | Full validation   |

### Scripts

- `pnpm test:unit` - Fast unit tests only
- `pnpm test:dev` - Development tests (no coverage)
- `pnpm test:integration` - E2E and smoke tests
- `pnpm test:watch:unit` - Watch mode for unit tests
- `pnpm test` - All tests

## Features

- **Modern Stack**: React 18, Vite 6, TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **State Management**: Zustand for simple state
- **Data Fetching**: TanStack Query for server state
- **Testing**: Vitest + React Testing Library
- **Code Quality**: ESLint, Prettier, Husky
- **Documentation**: Storybook for component docs
- **DevOps**: GitHub Actions, Docker support

## License

MIT
