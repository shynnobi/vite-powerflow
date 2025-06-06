# Development Environment

This guide details the development environment and workflow setup for Vite PowerFlow.

## Table of Contents

- [Getting Started](#getting-started)
  - [Installation](#installation)
- [Development Tools](#development-tools)
  - [VS Code Integration](#vs-code-integration)
  - [Dev Container, Docker & Playwright Browsers](#dev-container-docker--playwright-browsers)
- [Available Scripts](#available-scripts)
  - [Development](#development)
  - [Testing](#testing)
  - [Code Quality](#code-quality)
  - [Component Documentation](#component-documentation)
- [Testing Environment](#testing-environment)
- [Testing Strategy](#testing-strategy)
- [Pre-commit Hooks](#pre-commit-hooks)
- [Commit Message Conventions](#commit-message-conventions)

## Getting Started

### Installation

Create your project using our official CLI:

```bash
npx create-powerflow-app my-app
```

> Alternative package managers:
>
> ```bash
> # pnpm
> pnpm create powerflow-app my-app
>
> # yarn
> yarn create powerflow-app my-app
> ```

After installing, navigate to your project directory and start development:

```bash
cd my-project
pnpm install
pnpm dev
```

## Development Tools

### VS Code Integration

The project includes pre-configured VS Code settings in `.vscode/settings.json` with features like:

- Automatic formatting on save with Prettier
- ESLint error fixing on save
- Tailwind CSS IntelliSense
- Debugging configurations
- Recommended extensions

### Dev Container, Docker & Playwright Browsers

This project uses a modern containerized setup for maximum consistency and onboarding speed:

- **Dockerfile**: Defines the base image, system dependencies, and Node.js environment.
- **docker-compose.yml**: Orchestrates the container, mounts your code, and persists Playwright browser binaries in a Docker volume.
- **.devcontainer/devcontainer.json**: VS Code integration for seamless Dev Container experience.

**Benefits:**

- Identical environment for all contributors
- No "works on my machine" issues
- Fast onboarding: just "Reopen in Container" in VS Code

#### Playwright Browsers in Docker

This project uses the official Playwright Docker image which includes all necessary browser binaries (Chromium, Firefox, WebKit) and their dependencies. This ensures:

- Always up-to-date browser versions
- Consistent testing environment across all developers
- No need for manual browser installation
- Support for all major architectures (x64, ARM64)

The browsers are pre-installed in the Docker image, so you don't need to run any additional installation commands. This setup provides the most reliable and maintainable environment for running end-to-end tests.

## Available Scripts

The project includes a comprehensive set of npm scripts for various development tasks:

### Development

| Command        | Description                          |
| -------------- | ------------------------------------ |
| `pnpm dev`     | Start the development server         |
| `pnpm build`   | Build the application for production |
| `pnpm preview` | Preview the production build locally |

### Testing

| Command                 | Description                          |
| ----------------------- | ------------------------------------ |
| `pnpm test`             | Run all unit tests                   |
| `pnpm test:verbose`     | Run tests with detailed output       |
| `pnpm test:watch`       | Run tests in watch mode              |
| `pnpm test:coverage`    | Generate test coverage report        |
| `pnpm test:e2e`         | Run end-to-end tests with Playwright |
| `pnpm test:e2e:verbose` | Run E2E tests with tracing enabled   |

### Code Quality

| Command                   | Description                                      |
| ------------------------- | ------------------------------------------------ |
| `pnpm lint`               | Check code for linting errors                    |
| `pnpm lint:fix`           | Fix automatic linting errors                     |
| `pnpm format`             | Format code with Prettier                        |
| `pnpm format:check`       | Check code formatting                            |
| `pnpm fix`                | Run both formatter and linter                    |
| `pnpm type-check`         | Verify TypeScript types                          |
| `pnpm validate:static`    | Run all static checks (lint, format, types)      |
| `pnpm validate:unit`      | Run unit and integration tests                   |
| `pnpm validate:e2e`       | Run end-to-end tests (if present)                |
| `pnpm validate:quick`     | Run static checks and unit tests (no E2E)        |
| `pnpm validate:full`      | Run all validations including E2E tests          |
| `pnpm validate:precommit` | Run lint-staged and unit tests for quick commits |

### Component Documentation

| Command                | Description                               |
| ---------------------- | ----------------------------------------- |
| `pnpm storybook`       | Start Storybook for component development |
| `pnpm build-storybook` | Build Storybook for deployment            |

## Testing Environment

The project includes a complete testing environment with:

- **Vitest** configured in `vitest.config.ts` for unit and component testing
- **Testing Library** for component testing with a React-friendly API
- **Playwright** configured in `playwright.config.ts` for end-to-end testing

> For a detailed guide on our testing strategy, BDD approach, best practices, and examples, see [docs/testing.md](./testing.md).

## Testing Strategy

This project uses a Behavior-Driven Development (BDD) approach for all unit and integration tests.

Tests are organized in the `tests/` directory:

- `tests/unit/` for isolated logic and components
- `tests/integration/` for user flows and component interactions
- `tests/e2e/` for end-to-end scenarios (Playwright)

We chose BDD to improve test readability and maintainability by focusing on user behavior and clear scenarios. Tests are written using the Given-When-Then structure, which helps describe the system from the user's perspective.

You can find concrete examples in the test files within the `tests/` directory.

**Further reading:**

- [React Testing Library Docs](https://testing-library.com/docs/)
- [Vitest Docs](https://vitest.dev/)
- [Playwright Docs](https://playwright.dev/)
- [BDD Introduction](https://cucumber.io/docs/bdd/)

## Pre-commit Hooks

This project uses [Husky](https://typicode.github.io/husky/) to manage Git hooks. The scripts are located in the `.husky/` directory at the root of the project.

The validation system is designed to be:

- **Fast for daily development** (pre-commit)
- **Thorough for code quality** (pre-push)
- **Flexible** for different project needs
- **Supportive** of projects with or without E2E tests

### Pre-commit hook (`.husky/pre-commit`)

**Command used:**

```sh
pnpm validate:precommit
```

Runs automatically before each commit:

- Lint-staged checks on modified files
- Unit and integration tests
- Fast validation to keep commits quick

You can review or modify the script in `.husky/pre-commit` to fit your workflow.

### Pre-push hook (`.husky/pre-push`)

**Command used:**

```sh
pnpm validate:full
```

Runs automatically before pushing to remote:

- Full static validation (lint, format, type-check)
- All tests including E2E (if present)
- Complete project validation

You can review or modify the script in `.husky/pre-push` to fit your workflow.

## Commit Message Conventions

This project uses [commitlint](https://commitlint.js.org/) to enforce [Conventional Commits](https://www.conventionalcommits.org/) for all commit messages.

**Key rules:**

- The commit title (header) must not exceed 72 characters
- Each line of the commit body must not exceed 100 characters
- Use a conventional commit type (e.g., feat, fix, chore, docs, etc.)

These rules are enforced in two complementary ways:

- **Project configuration:** The [`commitlint.config.js`](../commitlint.config.js) file defines and enforces the commit message rules for all contributors.
- **AI pair programming instructions:** The `.cursor/rules` directory contains explicit instructions for the AI assistant to follow the same commit conventions, ensuring consistency across both traditional and AI-powered workflows.

This synergy guarantees that all contributors—whether using traditional tools or AI assistance—produce consistent, high-quality commit messages, making the project history easy to read and automate.

For more details, see [Conventional Commits](https://www.conventionalcommits.org/).
