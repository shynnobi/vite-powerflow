# Vite PowerFlow ⚡

A React + Vite starter, fully containerized for reproducible and collaborative development, with strict code quality tooling and AI pair programming workflow (Cursor rules). Includes comprehensive testing, linting, and CI/CD configurations following industry best practices.

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

- [Vite PowerFlow ⚡](#vite-powerflow-)
  - [📋 Table of Contents](#-table-of-contents)
  - [✨ Features](#-features)
    - [Quality Assurance](#quality-assurance)
    - [Git Integration](#git-integration)
  - [🚀 Quick Start](#-quick-start)
  - [🏗️ Project Architecture](#️-project-architecture)
    - [Directory Structure](#directory-structure)
  - [Path Aliases](#path-aliases)
    - [Available Aliases](#available-aliases)
    - [Adding a New Path Alias](#adding-a-new-path-alias)
  - [📜 Available Scripts](#-available-scripts)
    - [Development](#development)
    - [Testing](#testing)
    - [Code Quality](#code-quality)
    - [Documentation \& Development](#documentation--development)
    - [Component Documentation](#component-documentation)
  - [💻 Development Environment](#-development-environment)
    - [VS Code Integration](#vs-code-integration)
    - [Dev Container, Docker \& Playwright Browsers](#dev-container-docker--playwright-browsers)
      - [Playwright Browsers in Docker](#playwright-browsers-in-docker)
    - [Testing Environment](#testing-environment)
    - [Testing Strategy](#testing-strategy)
  - [Pre-commit Hooks](#pre-commit-hooks)
    - [Pre-commit hook (`.husky/pre-commit`)](#pre-commit-hook-huskypre-commit)
    - [Pre-push hook (`.husky/pre-push`)](#pre-push-hook-huskypre-push)
  - [Commit Message Conventions](#commit-message-conventions)
    - [Development Workflow](#development-workflow)
  - [⚙️ Configuration](#️-configuration)
    - [Environment Variables](#environment-variables)
  - [AI Pair Programming \& Cursor Rules](#ai-pair-programming--cursor-rules)
    - [Introduction](#introduction)
    - [Why AI Pair Programming?](#why-ai-pair-programming)
    - [How Cursor Rules Work](#how-cursor-rules-work)
    - [Overview of Rule Files](#overview-of-rule-files)
    - [Development Plan Generation](#development-plan-generation)
    - [Customizing AI Behavior](#customizing-ai-behavior)
    - [Best Practices](#best-practices)
    - [Further Reading](#further-reading)
  - [📅 Changelog](#-changelog)
  - [📄 License](#-license)
  - [👤 Credits](#-credits)

## ✨ Features

Vite PowerFlow comes with a comprehensive set of features to help you build modern React applications:

- ⚡️ [Vite](https://vitejs.dev/) (v6+) - Lightning fast build tool
- ⚛️ [React](https://react.dev/) (v19+) - UI library
- 📝 [TypeScript](https://www.typescriptlang.org/) (v5+) - Type safety
- 🎨 [Tailwind CSS](https://tailwindcss.com/) (v4+) - Utility-first CSS framework
- 🎭 [shadcn/ui](https://ui.shadcn.com/) - Reusable components
- 🌓 Dark mode support with theme switching
- 📚 [Storybook](https://storybook.js.org/) (v9+) - Component documentation
- 📦 [Zustand](https://zustand-demo.pmnd.rs/) (v5+) - State management
- 🚀 [TanStack Query](https://tanstack.com/query/latest) - Data fetching and caching

### Code Quality

- 🧪 [Vitest](https://vitest.dev/) (v3+) - Unit and integration testing
- 🎭 [Playwright](https://playwright.dev/) (v1.51+) - E2E testing
- 📝 [ESLint](https://eslint.org/) (v9+) - Code linting with flat config
- 💅 [Prettier](https://prettier.io/) - Code formatting

### Git Integration

- 🔍 [Husky](https://typicode.github.io/husky/) - Git hooks
- 📋 [lint-staged](https://github.com/okonet/lint-staged) - Staged files linting
- 📊 [commitlint](https://commitlint.js.org/) - Standardized commits

## 🚀 Quick Start

Get started in minutes with a fully containerized, AI-optimized environment.

1. **Generate your app:**

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

2. **Open your new project in [Cursor](https://cursor.com) (recommended) or [VS Code](https://code.visualstudio.com)**

3. **Reopen in Container** when prompted (DevContainer)

4. **Start developing!**

> For the full AI pair programming experience, use Cursor with the pre-configured rules. In VS Code, Cursor rules are not available, but you can use other AI tools.

For advanced setup, see [Development Environment](docs/development.md).

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

## Path Aliases

Path aliases are configured for cleaner imports and better code organization:

```typescript
// Instead of this:
import { Button } from '../../../components/ui/Button';

// Use this:
import { Button } from '@/components/ui/Button';
```

### Available Aliases

| Alias            | Path               | Description            |
| ---------------- | ------------------ | ---------------------- |
| `@/*`            | `src/*`            | All source files       |
| `@/components/*` | `src/components/*` | UI components          |
| `@/context/*`    | `src/context/*`    | Context providers      |
| `@/lib/*`        | `src/lib/*`        | Library configurations |
| `@/pages/*`      | `src/pages/*`      | Page components        |
| `@/types/*`      | `src/types/*`      | Type definitions       |
| `@/store/*`      | `src/store/*`      | State management       |
| `@/tests/*`      | `tests/*`          | Test files             |
| `@/utils/*`      | `src/utils/*`      | Utility functions      |

### Adding a New Path Alias

To add a new path alias, you need to update the TypeScript and Vite configurations:

1. Add the alias in `tsconfig.json` and `tsconfig.app.json`:

   ```json
   {
   	"compilerOptions": {
   		"paths": {
   			"@/newAlias/*": ["src/newPath/*"]
   		}
   	}
   }
   ```

2. Add it in `vite.config.ts`:
   ```typescript
   export default defineConfig({
   	resolve: {
   		alias: [
   			{
   				find: '@/newAlias',
   				replacement: resolve(__dirname, 'src/newPath'),
   			},
   		],
   	},
   });
   ```

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

### Component Documentation

| Command                | Description                               |
| ---------------------- | ----------------------------------------- |
| `pnpm storybook`       | Start Storybook for component development |
| `pnpm build-storybook` | Build Storybook for deployment            |

## 💻 Development Environment

Vite PowerFlow provides a complete development environment for modern React applications.

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

### Testing Environment

The project includes a complete testing environment with:

- **Vitest** configured for unit and component testing
- **Testing Library** for component testing with a React-friendly API
- **Playwright** for end-to-end testing
- **Storybook** for component development and visual testing
- Automatic test runners in pre-commit hooks
-

### Testing Strategy

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

| File                   | Purpose                                          | Documentation                                                     |
| ---------------------- | ------------------------------------------------ | ----------------------------------------------------------------- |
| `vite.config.ts`       | Configures Vite bundler, plugins, and dev server | [Vite Docs](https://vitejs.dev/config/)                           |
| `tsconfig.json`        | TypeScript compiler options                      | [TypeScript Docs](https://www.typescriptlang.org/tsconfig)        |
| `.eslintrc.cjs`        | Code linting rules                               | [ESLint Docs](https://eslint.org/docs/user-guide/configuring/)    |
| `.prettierrc`          | Code formatting rules                            | [Prettier Docs](https://prettier.io/docs/en/options.html)         |
| `vitest.config.ts`     | Unit testing configuration                       | [Vitest Docs](https://vitest.dev/config/)                         |
| `playwright.config.ts` | E2E testing configuration                        | [Playwright Docs](https://playwright.dev/docs/test-configuration) |
| `.env` files           | Environment variables                            | [Vite Env Variables](https://vitejs.dev/guide/env-and-mode.html)  |

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

## AI Pair Programming & Cursor Rules

### Introduction

This guide explains how to leverage AI pair programming in Vite PowerFlow using Cursor rules for a collaborative and high-quality development workflow. The `.cursor/rules` directory provides explicit instructions for the AI assistant, ensuring it follows your team's standards and workflows—whether you use traditional or AI-powered tools like [Cursor](https://www.cursor.so/). This approach guarantees a seamless, high-quality experience for all contributors.

### Why AI Pair Programming?

- Accelerates development by providing intelligent code suggestions and automation.
- Ensures consistency by enforcing project-specific standards and workflows.
- Facilitates onboarding and knowledge sharing for new contributors.
- Complements traditional development practices without replacing them.

### How Cursor Rules Work

Cursor reads the rules in `.cursor/rules/` to adapt its behavior as your AI pair programmer.
Each rule file describes a specific aspect of the workflow, coding standards, or communication protocol.

### Overview of Rule Files

- **code-standards.mdc**: Coding standards for the project (e.g., TypeScript, React, naming conventions).
- **development-methodology.mdc**: Methodologies to follow (e.g., TDD, atomic commits, SoC).
- **expected-AI-behavior.mdc**: How the AI should interact, suggest, and validate code.
- **github-cli-integration.mdc**: How to use GitHub CLI efficiently in the workflow.
- **github-pr-conventions.mdc**: Pull request standards and templates.
- **git-practices.mdc**: Commit message conventions and best practices.
- **interaction-protocol.mdc**: How the AI should communicate and interact with the user.
- **language-policy.mdc**: Language and naming conventions for code and documentation.
- **documentation-versioning.mdc**: How to manage documentation and versioning.
- **project-architecture-principles.mdc**: Architectural guidelines for the project.
- **ecosystem-convention.mdc**: How to align with ecosystem and tool-specific conventions.
- **technical-AI-posture.mdc**: The expected technical rigor and posture of the AI assistant.

### Development Plan Generation

Before starting any new project, use the Development Plan Generator Prompt (`workflows/DEVELOPMENT_PLAN_PROMPT.md`) to create a structured development plan. This prompt helps you:

- Define clear user stories and requirements
- Create a feature-slice based MVP approach
- Establish a TDD workflow with explicit test-writing steps
- Set up Git workflow integration with proper conventions
- Define milestones and versioning strategy

The generated plan serves as a roadmap for both you and the AI assistant, ensuring:

- Consistent understanding of project goals
- Clear progression through development phases
- Proper test coverage from the start
- Incremental feature delivery
- Better collaboration between human and AI pair programmers

### Customizing AI Behavior

You can edit or add rules in `.cursor/rules/` to tailor the AI's behavior to your team's needs.
For example, you can enforce stricter code review, change commit message formats, or adapt the interaction style.

### Best Practices

- Keep rules concise and focused on one topic per file.
- Update rules as your project evolves or as your team's workflow changes.
- Review the rules with your team to ensure alignment.
- Always start new projects with the Development Plan Generator Prompt.
- Use the generated plan to guide both human and AI development efforts.

### Further Reading

- [Cursor Documentation](https://docs.cursor.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**In summary:**
The `.cursor/rules` directory is the backbone of the AI pair programming experience in this starter.
It ensures that every contributor—human or AI—follows the same high standards and workflow, making collaboration seamless and efficient.

## 📅 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Credits

This starter template was created and is maintained by [Shynn](https://github.com/shynnobi)

[![GitHub](https://img.shields.io/badge/GitHub-shynnobi-24292e.svg?style=for-the-badge&logo=github)](https://github.com/shynnobi)
[![Bluesky](https://img.shields.io/badge/Bluesky-@shynnobi-0560ff.svg?style=for-the-badge&logo=bluesky)](https://bsky.app/profile/shynnobi.bsky.social)
[![Instagram](https://img.shields.io/badge/Instagram-@shynnobi-E4405F.svg?style=for-the-badge&logo=instagram)](https://www.instagram.com/shynnobi_)
