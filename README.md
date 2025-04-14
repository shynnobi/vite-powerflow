# Vite PowerFlow

A modern, feature-rich starter template for React applications built with Vite.

<div align="center">
  <img src="public/vite.svg" alt="Vite Logo" width="100" />
  <br />
  <p>
    <strong>Vite PowerFlow</strong> - Your next React project, ready to go.
  </p>
</div>

<div align="center">

![Vite](https://img.shields.io/npm/v/vite?color=646CFF&label=Vite&logo=vite&logoColor=white)
![React](https://img.shields.io/npm/v/react?color=61DAFB&label=React&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/npm/v/typescript?color=3178C6&label=TypeScript&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/npm/v/tailwindcss?color=06B6D4&label=Tailwind%20CSS&logo=tailwindcss&logoColor=white)
![Vitest](https://img.shields.io/npm/v/vitest?color=6E9F18&label=Vitest&logo=vitest&logoColor=white)
![Playwright](https://img.shields.io/npm/v/playwright?color=2EAD33&label=Playwright&logo=playwright&logoColor=white)
![ESLint](https://img.shields.io/npm/v/eslint?color=4B32C3&label=ESLint&logo=eslint&logoColor=white)
![License](https://img.shields.io/github/license/shynnobi/vite-powerflow?color=yellow&label=License)

</div>

## 📋 Table of Contents

- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [🏗️ Project Architecture](#-project-architecture)
- [📜 Available Scripts](#-available-scripts)
- [💻 Development Environment](#-development-environment)
- [⚙️ Configuration](#-configuration)
- [📅 Changelog](#-changelog)
- [📄 License](#-license)
- [👤 Credits](#-credits)

## ✨ Features

Vite PowerFlow comes with a comprehensive set of features to help you build modern React applications:

### Core Technologies

- ⚡️ [Vite](https://vitejs.dev/) (v6+) - Lightning fast build tool
- ⚛️ [React](https://react.dev/) (v19+) - UI library
- 📝 [TypeScript](https://www.typescriptlang.org/) (v5+) - Type safety

### UI & Styling

- 🎨 [Tailwind CSS](https://tailwindcss.com/) (v4+) - Utility-first CSS framework
- 🎭 [shadcn/ui](https://ui.shadcn.com/) - Reusable components
- 🌓 Dark mode support with theme switching
- 📚 [Storybook](https://storybook.js.org/) (v8+) - Component documentation

### State & Data Management

- 📦 [Zustand](https://zustand-demo.pmnd.rs/) (v5+) - State management
- 🚀 [TanStack Query](https://tanstack.com/query/latest) - Data fetching and caching

### Development Tools

- 🔄 Hot Module Replacement (HMR)
- 🎯 Path aliases for clean imports
- 🔒 Environment variables management
- 📦 Optimized production builds

### Quality Assurance

- 🧪 [Vitest](https://vitest.dev/) (v3+) - Unit and integration testing
- 🎭 [Playwright](https://playwright.dev/) (v1.51+) - E2E testing
- 📝 [ESLint](https://eslint.org/) (v9+) - Code linting with flat config
- 💅 [Prettier](https://prettier.io/) - Code formatting

### Git Integration

- 🔍 [Husky](https://typicode.github.io/husky/) - Git hooks
- 📋 [lint-staged](https://github.com/okonet/lint-staged) - Staged files linting
- 📊 [commitlint](https://commitlint.js.org/) - Standardized commits

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (v8+) - _recommended package manager_
- [Git](https://git-scm.com/) (optional)

### Installation

#### Option 1: Using the CLI (Recommended)

The fastest way to create a new project:

```bash
# Using npx (no installation required)
npx create-powerflow-app my-app

# OR with global installation
npm install -g create-powerflow-app
create-powerflow-app my-app
```

The CLI helps you:

- Set project name and description
- Add author information
- Initialize Git repository (optional)
- Choose whether to include example tests
- Configure Dev Container settings (optional)

#### Option 2: Manual Installation

```bash
# Using degit (no git history)
pnpm degit shynnobi/vite-powerflow my-app

# OR using git clone (includes git history)
git clone https://github.com/shynnobi/vite-powerflow.git my-app

# Navigate to project and install dependencies
cd my-app
pnpm install
```

## 🏗️ Project Architecture

Vite PowerFlow follows a feature-based architecture pattern where code is organized by its domain functionality rather than technical type.

### Directory Structure

```
├── src/                  # Application source code
│ ├── components/         # Reusable components
│ │ └── ui/               # shadcn/ui components with Storybook stories
│ ├── store/              # Zustand state management
│ ├── assets/             # Static assets (images, fonts, etc.)
│ ├── context/            # React context providers
│ ├── pages/              # Page components and routing
│ ├── lib/                # Third-party library configurations
│ ├── utils/              # Utility functions and helpers
│ └── shared/             # Shared types and interfaces
├── tests/                # Test files
│ ├── e2e/                # End-to-end tests (Playwright)
│ ├── integration/        # Integration tests
│ └── unit/               # Unit tests
├── public/               # Static files (served as-is)
├── .husky/               # Git hooks configuration
├── docs/                 # Documentation files
└── config files          # Configuration files
```

### Path Aliases

Path aliases are configured for cleaner imports:

```typescript
// Instead of this:
import { Button } from '../../../components/ui/Button';

// Use this:
import { Button } from '@/components/ui/Button';
```

Available aliases include `@/*`, `@components/*`, `@context/*`, `@lib/*`, `@pages/*`, `@store/*`, `@utils/*`, and more. See [Architecture Documentation](docs/architecture.md) for a complete list.

## 📜 Available Scripts

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

### Documentation & Development

| Command                | Description                                       |
| ---------------------- | ------------------------------------------------- |
| `pnpm storybook`       | Start Storybook for component development         |
| `pnpm build-storybook` | Build Storybook for deployment                    |
| `pnpm clean-examples`  | Remove example tests and components (if included) |

## 💻 Development Environment

Vite PowerFlow provides a complete development environment for modern React applications.

### VS Code Integration

The project includes pre-configured VS Code settings with features like:

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

### Testing Environment

The project includes a complete testing environment with:

- **Vitest** configured for unit and component testing
- **Testing Library** for component testing with a React-friendly API
- **Playwright** for end-to-end testing
- **Storybook** for component development and visual testing
- Automatic test runners in pre-commit hooks

### Development Workflow

The repository is organized with a simplified Git Flow:

- `main`: Production-ready code
- `develop`: Development branch
- Feature branches: `feature/feature-name`
- Bug fix branches: `fix/bug-name`
- Release branches: `release/v1.x.x`

The project uses conventional commits:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types include: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.

Pre-commit hooks automatically run TypeScript type checking, ESLint, Prettier formatting, and unit tests.

## ⚙️ Configuration

Vite PowerFlow includes several configuration files to customize your development experience:

| File                   | Purpose                                          |
| ---------------------- | ------------------------------------------------ |
| `vite.config.ts`       | Configures Vite bundler, plugins, and dev server |
| `tsconfig.json`        | TypeScript compiler options                      |
| `.eslintrc.cjs`        | Code linting rules                               |
| `.prettierrc`          | Code formatting rules                            |
| `vitest.config.ts`     | Unit testing configuration                       |
| `playwright.config.ts` | E2E testing configuration                        |
| `.env` files           | Environment variables                            |

### Environment Variables

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

## 📅 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Credits

This starter template was created and is maintained by [Shynn](https://github.com/shynnobi)

[![GitHub](https://img.shields.io/badge/GitHub-shynnobi-24292e.svg?style=for-the-badge&logo=github)](https://github.com/shynnobi)
[![Bluesky](https://img.shields.io/badge/Bluesky-@shynnobi-0560ff.svg?style=for-the-badge&logo=bluesky)](https://bsky.app/profile/shynnobi.bsky.social)
[![Instagram](https://img.shields.io/badge/Instagram-@shynnobi-E4405F.svg?style=for-the-badge&logo=instagram)](https://www.instagram.com/shynnobi_)
