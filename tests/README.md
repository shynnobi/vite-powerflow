# Tests Structure

This directory contains all test-related files for the project.

## Directory Structure

```
tests/
├── unit/           # Unit tests (Vitest)
│   ├── setup.ts    # Unit tests setup
│   └── *.test.tsx  # Unit test files
├── e2e/            # End-to-end tests (Playwright)
│   └── *.spec.ts   # E2E test files
└── README.md       # This file
```

## Test Types

### Unit Tests

- Located in `unit/`
- Uses Vitest and Testing Library
- Run with `pnpm test` or `pnpm test:watch`
- Coverage reports in `coverage/unit/`

### E2E Tests

- Located in `e2e/`
- Uses Playwright
- Run with `pnpm test:e2e`
- Results in `test-results/e2e/`
- UI mode available with `pnpm test:e2e:ui`

## Configuration Files

- Unit Tests: `vite.config.ts`
- E2E Tests: `playwright.config.ts`

## Best Practices

1. Keep test files close to their implementation
2. Use `.test.tsx` for unit tests
3. Use `.spec.ts` for E2E tests
4. Write meaningful test descriptions
5. Follow AAA pattern (Arrange, Act, Assert)
