# Development Environment

This guide covers the essential development environment and workflow setup in Vite PowerFlow.

## Table of Contents

- [Available Scripts](#available-scripts)
  - [Development](#development)
  - [Testing](#testing)
  - [Code Quality](#code-quality)
  - [Component Documentation](#component-documentation)
- [Development Tools](#development-tools)
  - [VS Code Integration](#vs-code-integration)
  - [Dev Container Support](#dev-container-support)
- [Getting Started with Development](#getting-started-with-development)
  - [Installation Options](#installation-options)
- [Testing Environment](#testing-environment)
- [Development Workflow](#development-workflow)
  - [Branch Management](#branch-management)
  - [Commit Messages](#commit-messages)
- [Pre-commit Hooks](#pre-commit-hooks)

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

| Command             | Description                   |
| ------------------- | ----------------------------- |
| `pnpm lint`         | Check code for linting errors |
| `pnpm lint:fix`     | Fix automatic linting errors  |
| `pnpm format`       | Format code with Prettier     |
| `pnpm format:check` | Check code formatting         |
| `pnpm fix`          | Run both formatter and linter |
| `pnpm type-check`   | Verify TypeScript types       |
| `pnpm validate`     | Run all code quality checks   |

### Component Documentation

| Command                | Description                               |
| ---------------------- | ----------------------------------------- |
| `pnpm storybook`       | Start Storybook for component development |
| `pnpm build-storybook` | Build Storybook for deployment            |

## Development Tools

### VS Code Integration

The project includes pre-configured VS Code settings in `.vscode/settings.json` with features like:

- Automatic formatting on save with Prettier
- ESLint error fixing on save
- Tailwind CSS IntelliSense
- Debugging configurations
- Recommended extensions

### Dev Container Support

A complete development environment is configured in `.devcontainer/devcontainer.json` providing:

- Node.js runtime environment
- Essential VS Code extensions pre-installed
- Port forwarding for development server
- Automatic dependency installation

**Benefits of using Dev Containers:**

| Feature             | Local Development                       | With Dev Container                                |
| ------------------- | --------------------------------------- | ------------------------------------------------- |
| 🔄 Team consistency | ❌ May vary based on local setup and OS | ✅ Identical environment for all team members     |
| 🛠️ Configuration    | ❌ Manual setup of tools and extensions | ✅ Automatic setup of the entire environment      |
| 🌐 Cross-platform   | ⚠️ May encounter OS-specific issues     | ✅ Works identically on Windows, macOS, and Linux |

When opening the project in VS Code, you'll be prompted to "Reopen in Container" if you have the Dev Containers extension. Simply click "Reopen in Container" when prompted to use this feature.

## Getting Started with Development

### Installation Options

You can create a new project in three ways:

```bash
# Option 1: Using the official CLI (recommended)
npx create-powerflow-app my-project

# Option 2: Using degit (no Git history)
npx degit shynnobi/vite-powerflow my-project

# Option 3: Using Git clone (includes full history)
git clone https://github.com/shynnobi/vite-powerflow my-project
```

> **Which method to choose?**
>
> - The **CLI** provides a guided setup experience with customization options
> - **degit** downloads only the latest code without Git history, providing a clean start
> - **git clone** includes the full history and Git references

After installing, navigate to your project directory and start development:

```bash
cd my-project
pnpm install
pnpm dev
```

## Testing Environment

The project includes a complete testing environment with:

- **Vitest** configured in `vitest.config.ts` for unit and component testing
- **Testing Library** for component testing with a React-friendly API
- **Playwright** configured in `playwright.config.ts` for end-to-end testing
- **Storybook** for component development and visual testing
- Automatic test runners in pre-commit hooks

Test files are organized in the `tests/` directory with subdirectories for different types of tests.

## Development Workflow

### Branch Management

The repository is organized with a simplified Git Flow:

- `main`: Production-ready code
- `develop`: Development branch
- Feature branches: `feature/feature-name`
- Bug fix branches: `fix/bug-name`
- Release branches: `release/v1.x.x`

### Commit Messages

The project uses conventional commits:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Maintenance tasks

## Pre-commit Hooks

The following checks are configured to run automatically before each commit:

- TypeScript type checking
- ESLint
- Prettier formatting
- Unit tests
