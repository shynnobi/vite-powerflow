# Vite PowerFlow ⚡️

<div align="center">
  <img src="public/vite.svg" alt="Vite Logo" width="100" />
  <br />
  <p><strong>Vite PowerFlow</strong> — Your next React project, ready to go.</p>
  <p>
   <a href="https://img.shields.io/npm/v/react?color=61DAFB&label=React&logo=react&logoColor=white">
      <img src="https://img.shields.io/npm/v/react?color=61DAFB&label=React&logo=react&logoColor=white" />
    </a>
    <a href="https://img.shields.io/npm/v/vite?color=646CFF&label=Vite&logo=vite&logoColor=white">
      <img src="https://img.shields.io/npm/v/vite?color=646CFF&label=Vite&logo=vite&logoColor=white" />
    </a>
    <a href="https://img.shields.io/npm/v/typescript?color=3178C6&label=TypeScript&logo=typescript&logoColor=white">
      <img src="https://img.shields.io/npm/v/typescript?color=3178C6&label=TypeScript&logo=typescript&logoColor=white" />
    </a>
    <a href="https://img.shields.io/npm/v/tailwindcss?color=06B6D4&label=Tailwind%20CSS&logo=tailwindcss&logoColor=white">
      <img src="https://img.shields.io/npm/v/tailwindcss?color=06B6D4&label=Tailwind%20CSS&logo=tailwindcss&logoColor=white" />
    </a>
    <a href="https://img.shields.io/npm/v/vitest?color=6E9F18&label=Vitest&logo=vitest&logoColor=white">
      <img src="https://img.shields.io/npm/v/vitest?color=6E9F18&label=Vitest&logo=vitest&logoColor=white" />
    </a>
    <a href="https://img.shields.io/npm/v/playwright?color=2EAD33&label=Playwright&logo=playwright&logoColor=white">
      <img src="https://img.shields.io/npm/v/playwright?color=2EAD33&label=Playwright&logo=playwright&logoColor=white" />
    </a>
     <a href="https://img.shields.io/npm/v/storybook?color=FF4785&label=Storybook&logo=storybook&logoColor=white">
      <img src="https://img.shields.io/npm/v/storybook?color=FF4785&label=Storybook&logo=storybook&logoColor=white" />
    </a>
    <a href="https://img.shields.io/npm/v/eslint?color=4B32C3&label=ESLint&logo=eslint&logoColor=white">
      <img src="https://img.shields.io/npm/v/eslint?color=4B32C3&label=ESLint&logo=eslint&logoColor=white" />
    </a>
    <a href="https://img.shields.io/github/license/shynnobi/vite-powerflow?color=yellow&label=License">
      <img src="https://img.shields.io/github/license/shynnobi/vite-powerflow?color=yellow&label=License" />
    </a>
  </p>
</div>

## Table of Contents

- [🚀 Quick Start](#-quick-start)
- [✨ Features](#-features)
- [🏗️ Project Architecture](#️-project-architecture)
- [📜 Available Scripts](#-available-scripts)
- [💻 Development Environment](#-development-environment)
- [🤖 AI Pair Programming & Cursor Rules](#-ai-pair-programming--cursor-rules)
- [🧪 Quality Assurance & Testing](#-quality-assurance--testing)
- [🤝 Contribution Guidelines](#-contribution-guidelines)
- [⚙️ Configuration](#️-configuration)
- [📅 Changelog](#-changelog)
- [📄 License](#-license)
- [👤 Credits](#-credits)

## 🚀 Quick Start

1. **Generate your app:**

   ```bash
   npx create-powerflow-app my-app
   cd my-app
   ```

2. Open your new project in [Cursor](https://cursor.com) (recommended) or [VS Code](https://code.visualstudio.com)

3. `Reopen in Container` when prompted (DevContainer)

4. Start developing! 🚀

> For the full AI pair programming experience, use the Cursor code editor.
> In Visual Studio Code, Cursor rules are not usable.

## ✨ Features

### 🛠️ Core Technologies

- **[React](https://reactjs.org/)** — Modern UI library for building user interfaces
- **[Vite](https://vitejs.dev/)** — Lightning fast build tool and development server
- **[TypeScript](https://www.typescriptlang.org/)** — Type safety and enhanced developer experience

### 🎨 UI & Components

- **[Tailwind CSS](https://tailwindcss.com/)** — Utility-first CSS framework for rapid UI development
- **[shadcn/ui](https://ui.shadcn.com/)** — Reusable, accessible components built with Radix UI
- **Dark mode** — Built-in theme switching support
- **[Storybook](https://storybook.js.org/)** — Component documentation and development

### 📦 State & Data

- **[Zustand](https://github.com/pmndrs/zustand)** — Lightweight state management
- **[TanStack Query](https://tanstack.com/query/latest)** — Powerful data fetching and caching

### 🧪 Testing & Code Quality

- **[Vitest](https://vitest.dev/)** — Fast unit and integration testing
- **[Playwright](https://playwright.dev/)** — End-to-end testing
- **[ESLint](https://eslint.org/)** — Flat config, strict linting rules
- **[Prettier](https://prettier.io/)** — Code formatting and style consistency

### 🔄 Git Integration

- [Husky](https://typicode.github.io/husky/) - Git hooks
- [lint-staged](https://github.com/okonet/lint-staged) - Staged files linting
- [commitlint](https://commitlint.js.org/) - Standardized commits
- [GitHub Actions](https://github.com/features/actions) — CI/CD pipelines

## 🤖 AI-Powered Development

Vite PowerFlow is optimized for **Cursor AI Code Editor** with pre-configured rules that enhance pair programming, IA code assistance and code generation. These rules are defined in the `.cursor/rules/` directory and help the AI understand your project's context and best practices.

> **Note**: While the project works perfectly with any IDE, Cursor's AI features require a paid subscription to access the enhanced development experience.

### Available Rules

The following rules are pre-configured to enhance your development experience:

| Rule File                             | Description                                                              |
| ------------------------------------- | ------------------------------------------------------------------------ |
| `code-standards.mdc`                  | Coding standards for the project (TypeScript, React, naming conventions) |
| `development-methodology.mdc`         | Methodologies to follow (TDD, atomic commits, SoC)                       |
| `documentation-versioning.mdc`        | How to manage documentation and versioning                               |
| `ecosystem-convention.mdc`            | How to align with ecosystem and tool-specific conventions                |
| `expected-AI-behavior.mdc`            | How the AI should interact, suggest, and validate code                   |
| `git-practices.mdc`                   | Commit message conventions and best practices                            |
| `github-cli-integration.mdc`          | How to use GitHub CLI efficiently in the workflow                        |
| `github-pr-conventions.mdc`           | Pull request standards and templates                                     |
| `interaction-protocol.mdc`            | How the AI should communicate and interact with the user                 |
| `language-policy.mdc`                 | Language and naming conventions for code and documentation               |
| `project-architecture-principles.mdc` | Architectural guidelines for the project                                 |
| `technical-AI-posture.mdc`            | The expected technical rigor and posture of the AI assistant             |

> **Note**: You can customize these rules by adding, removing, or modifying them in the `.cursor/rules/` directory to better match your project's requirements and development workflow.

## 🏗️ Project Architecture

### Directory Structure

```
├── src/                  # Application source code
│ ├── components/         # Reusable components
│ │ └── ui/               # shadcn/ui components with Storybook stories
│ │ ├── store/              # Zustand state management
│ │ ├── assets/             # Static assets (images, fonts, etc.)
│ │ ├── context/            # React context providers
│ │ ├── pages/              # Page components and routing
│ │ ├── lib/                # Third-party library configurations
│ │ ├── utils/              # Utility functions and helpers
│ │ └── shared/             # Shared types and interfaces
│ │
│ ├── tests/                # Test files (unit, integration, e2e)
│ ├── public/               # Static files (served as-is)
│ ├── .husky/               # Git hooks configuration
│ ├── docs/                 # Documentation files
│ └── config files          # Configuration files
```

### Path Aliases

Path aliases are configured for cleaner imports and better code organization:

```typescript
// Instead of this:
import { Button } from '../../../components/ui/Button';

// Use this:
import { Button } from '@/components/ui/Button';
```

#### Available Aliases

Path aliases allow for cleaner and more maintainable imports in the project. Instead of using complex relative paths (e.g., `../../../components/Button`), you can use absolute imports with aliases (e.g., `@/components/Button`). These aliases are configured in both `vite.config.ts` and `tsconfig.json` to ensure consistency between the bundler and TypeScript.

| Alias            | Path               | Description            |
| ---------------- | ------------------ | ---------------------- |
| `@/*`            | `src/*`            | All source files       |
| `@/assets/*`     | `src/assets/*`     | Static assets          |
| `@/components/*` | `src/components/*` | UI components          |
| `@/context/*`    | `src/context/*`    | Context providers      |
| `@/lib/*`        | `src/lib/*`        | Library configurations |
| `@/pages/*`      | `src/pages/*`      | Page components        |
| `@/types/*`      | `src/types/*`      | Type definitions       |
| `@/store/*`      | `src/store/*`      | State management       |
| `@/tests/*`      | `tests/*`          | Test files             |
| `@/utils/*`      | `src/utils/*`      | Utility functions      |

#### Adding a New Path Alias

To add a new path alias, update both `tsconfig.json` and `vite.config.ts`:

1. In `tsconfig.json`:
   ```json
   {
   	"compilerOptions": {
   		"paths": {
   			"@/newAlias/*": ["src/newPath/*"]
   		}
   	}
   }
   ```
2. In `vite.config.ts`:
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

| Command          | Description                               |
| ---------------- | ----------------------------------------- |
| `pnpm dev`       | Start the development server              |
| `pnpm build`     | Build the application for production      |
| `pnpm preview`   | Preview the production build locally      |
| `pnpm test`      | Run all unit and integration tests        |
| `pnpm test:e2e`  | Run end-to-end tests with Playwright      |
| `pnpm lint`      | Check code for linting errors             |
| `pnpm format`    | Format code with Prettier                 |
| `pnpm storybook` | Start Storybook for component development |

Additional scripts are available for code quality validation, pre-commit hooks, and CI/CD pipelines:

- **Validation Scripts**:
  - `pnpm validate:static` — Run static code analysis (formatting, linting, type checking)
  - `pnpm validate:unit` — Run unit and integration tests
  - `pnpm validate:e2e` — Run end-to-end tests
  - `pnpm validate:quick` — Quick validation for development (static + unit tests)
  - `pnpm validate:full` — Complete validation (static + unit + e2e tests)
  - `pnpm validate:precommit` — Validation run by Husky before each commit

These scripts are automatically used in the development workflow through Husky hooks and CI/CD pipelines.

See `package.json` for the complete list of available scripts.

## 💻 Development Environment

This section outlines the development tools and environment setup. The project uses a containerized development environment to ensure consistency across all contributors.

### Development Tools

The project includes a comprehensive set of tools to maintain code quality and consistency:

- **Code Quality**

  - ESLint (`eslint.config.js`) — TypeScript and React linting rules
  - Prettier (`.prettierrc`) — Code formatting standards
  - EditorConfig (`.editorconfig`) — Editor-agnostic coding styles
  - CommitLint (`commitlint.config.js`) — Conventional commit messages

- **UI Components**
  - shadcn/ui (`components.json`) — UI component library configuration
  - Tailwind CSS — Utility-first CSS framework

### Containerized Development

The project uses Docker and VS Code Dev Containers to provide a consistent development environment across all machines:

- **VS Code Dev Container**

  - Pre-configured settings in `.vscode/settings.json`
  - Integrated formatting, linting, and debugging
  - Tailwind CSS IntelliSense support

- **Docker Setup**
  - Identical environment for all contributors
  - Fast onboarding with pre-installed dependencies
  - Uses `Dockerfile`, `docker-compose.yml`, and `.devcontainer/devcontainer.json`

## 🧪 Quality Assurance & Testing

Our testing strategy combines multiple approaches to ensure code quality and reliability, from unit tests to end-to-end scenarios.

### Testing Strategy

The project implements a comprehensive testing approach with different levels of testing:

- **Unit Tests** (`tests/unit/`)

  - Isolated logic and components
  - Vitest and Testing Library
  - Behavior-Driven Development (BDD) structure

- **Integration Tests** (`tests/integration/`)

  - User flows and component interactions
  - Vitest and Testing Library
  - Given-When-Then format

- **E2E Tests** (`tests/e2e/`)
  - End-to-end scenarios with Playwright
  - Browser support: Chromium (default), Firefox, WebKit
  - Mobile device emulation
  - Smart browser installation:
    - Browsers are installed on-demand when running e2e tests
    - Only Chromium is installed by default for faster container startup
    - Other browsers (Firefox, WebKit) are installed only when needed
    - Persistent browser cache using a named volume for faster subsequent runs

### Git Hooks

Git hooks ensure code quality at every step of development:

- **Pre-commit** (`.husky/pre-commit`)

  - Fast validation: lint, unit/integration tests
  - Command: `pnpm validate:precommit`

- **Pre-push** (`.husky/pre-push`)
  - Full validation: lint, format, type-check, all tests
  - Command: `pnpm validate:full`

### CI/CD Pipeline

The project includes pre-configured GitHub Actions workflows and branch protection rules. After creating a new project with the CLI, you only need to enable GitHub Actions in your repository settings:

1. **Enable GitHub Actions**
   - Go to your repository's Settings > Actions > General
   - Enable "Allow all actions and reusable workflows"
   - Enable "Read and write permissions" under "Workflow permissions"

The following workflows are automatically configured via project files:

- **Local Development Checks** (via Husky)

  - Pre-commit: Fast validation (formatting, linting, unit tests)
  - Pre-push: Full validation (all tests including E2E)
  - Immediate feedback during development

- **Continuous Integration** (`.github/workflows/ci.yml`)

  - Code quality checks: ESLint, Prettier, TypeScript
  - Commit message validation with CommitLint
  - Build verification
  - Runs on push to `main`/`dev` and pull requests
  - Clean environment validation
  - ⚠️ E2E tests skipped in CI (free tier) but required locally

- **Branch Protection** (`.github/branch-protection.yml`)

  - Automated protection rules for `main` and `dev` branches
  - Required status checks for all branches
  - Linear history enforcement
  - Pull request review requirements

- **Dependency Management** (`.github/workflows/dependabot-auto.yml`)
  - Automated dependency updates with Dependabot
  - Auto-merge for compatible updates
  - Support for semver updates (patch, minor, major)
  - Automatic PR approval for security updates

## 🤝 Contribution Guidelines

### Commit Message Conventions

This project uses [commitlint](https://commitlint.js.org/) to enforce [Conventional Commits](https://www.conventionalcommits.org/) for all commit messages.

**Key rules:**

- The commit title (header) must not exceed 72 characters
- Each line of the commit body must not exceed 100 characters
- Use a conventional commit type (e.g., feat, fix, chore, docs, etc.)

**Format:**

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- build: Changes to build system
- chore: Maintenance tasks
- ci: CI configuration changes
- docs: Documentation changes
- feat: New features
- fix: Bug fixes
- perf: Performance improvements
- refactor: Code refactoring
- revert: Revert changes
- style: Code style changes
- test: Test changes

**Examples:**

```
feat(ui): add cursor-pointer to interactive elements

Changes include:
- Add cursor-pointer to all buttons
- Update hover states for better feedback
- Ensure consistent behavior across themes
```

```
fix(auth): resolve login token expiration

Update token refresh logic to prevent premature expiration
Add proper error handling for expired tokens
```

### Git Workflow

- **Branches**:
  - `main`: Production-ready code
  - `dev`: Development branch
  - Feature branches: `feature/feature-name`
  - Bug fix branches: `fix/bug-name`
  - Release branches: `release/v1.x.x`
- **Pull Requests**: Use the PR template, follow commit message rules, and fill out all relevant sections
- **Pre-commit hooks**: Run TypeScript type checking, ESLint, Prettier formatting, and unit tests automatically

### PR Conventions

- PR titles must follow the conventional commit format
- Fill out all relevant sections of the PR template
- Mark the appropriate checkboxes in the "Type of change" and "Quality assurance" sections
- Never create PRs without using the template structure

## ⚙️ Configuration

- **Environment Variables**: Managed via `.env`
