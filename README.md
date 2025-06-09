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

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Features](#-features)
- [Development Environment](#-development-environment)
- [Testing & Quality Assurance](#-testing--quality-assurance)
- [Configuration](#-configuration)
- [Scripts](#-scripts)
- [Contribution Guidelines](#-contribution-guidelines)
- [Additional Resources](#-additional-resources)
- [License](#-license)

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (v8 or higher)
- [Docker](https://www.docker.com/) (required for containerized development)
- [VS Code](https://code.visualstudio.com/) with [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension

### Installation

1. **Create a new project using the CLI**

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

### 🛠️ Core Stack

- **[React](https://reactjs.org/)** + **[Vite](https://vitejs.dev/)** + **[TypeScript](https://www.typescriptlang.org/)**
  - Modern UI development with type safety
  - Lightning fast build and development experience

### 🎨 UI & Styling

- **[Tailwind CSS](https://tailwindcss.com/)** + **[shadcn/ui](https://ui.shadcn.com/)**
  - Utility-first CSS with accessible components
  - Built-in dark mode support
  - Component documentation with **[Storybook](https://storybook.js.org/)**

### 📦 State & Data Management

- **[Zustand](https://github.com/pmndrs/zustand)** for lightweight state management
- **[TanStack Query](https://tanstack.com/query/latest)** for data fetching and caching

### 🧪 Testing & Quality

- **[Vitest](https://vitest.dev/)** for unit and integration tests
- **[Playwright](https://playwright.dev/)** for end-to-end testing
- **[ESLint](https://eslint.org/)** + **[Prettier](https://prettier.io/)** for code quality and formatting

### 🔄 Development Workflow

- Git hooks with **[Husky](https://typicode.github.io/husky/)**
- Staged files linting with **[lint-staged](https://github.com/okonet/lint-staged)**
- Standardized commits with **[commitlint](https://commitlint.js.org/)**
- Automated CI/CD with **[GitHub Actions](https://github.com/features/actions)**

## 🤖 AI-Powered Development

Vite PowerFlow is optimized for **Cursor AI Code Editor** with pre-configured rules that enhance pair programming, AI code assistance and code generation. These rules are defined in the `.cursor/rules/` directory and help the AI understand your project's context and best practices.

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

## 💻 Development Environment

### Development Tools

#### Code Quality & Standards

- **Linting & Formatting**
  - ESLint (`eslint.config.js`) — TypeScript and React linting rules
  - Prettier (`.prettierrc`) — Code formatting standards
  - EditorConfig (`.editorconfig`) — Editor-agnostic coding styles
- **Git Workflow**
  - CommitLint (`commitlint.config.js`) — Conventional commit messages
  - Husky — Git hooks for automated checks
  - lint-staged — Staged files validation

#### UI Development

- **Component Library**
  - shadcn/ui (`components.json`) — UI component library configuration
  - Storybook — Component documentation and development
- **Styling**
  - Tailwind CSS — Utility-first CSS framework
  - PostCSS — CSS processing and optimization

#### Development Environment

- **VS Code Dev Container** (`.devcontainer/devcontainer.json`)
  - Pre-configured settings in `.vscode/settings.json`
  - Automatic installation of preconfigured extensions (`.vscode/extensions.json`)
  - Custom lifecycle scripts (onCreate, postCreate, updateContent)
- **Docker Setup**
  - Identical environment for all contributors
  - Fast onboarding with pre-installed dependencies
  - Uses `Dockerfile`, `docker-compose.yml`, and `.devcontainer/devcontainer.json`

## 🧪 Testing & Quality Assurance

### Test Types & Tools

- **Unit/Integration Tests**
  - Vitest + Testing Library
  - Component testing
  - Utility function testing
- **E2E Tests**
  - Playwright with multi-browser support
  - User flow testing
  - Cross-browser compatibility

### Test Organization

- `tests/unit/` — Isolated logic and components
- `tests/integration/` — User flows and interactions
- `tests/e2e/` — End-to-end scenarios

### Browser Management

- Smart browser installation (on-demand)
- Chromium by default, Firefox/WebKit when needed
- Persistent browser cache for faster runs

### Automated Workflows

#### Local Development

- **Pre-commit** (`.husky/pre-commit`)
  - Fast validation: lint, unit/integration tests
  - Command: `pnpm validate:precommit`
- **Pre-push** (`.husky/pre-push`)
  - Full validation: lint, format, type-check, all tests
  - Command: `pnpm validate:full`

#### CI/CD Pipeline

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

## ⚙️ Configuration

### Environment Variables

- **Development**: `.env.development`
  - `VITE_API_URL`: API endpoint for development
  - `VITE_APP_ENV`: Set to "development"
- **Production**: `.env.production`
  - `VITE_API_URL`: Production API endpoint
  - `VITE_APP_ENV`: Set to "production"

### Project Structure

```
├── src/
│   ├── components/     # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions and configurations
│   ├── pages/         # Page components
│   ├── styles/        # Global styles and Tailwind config
│   └── types/         # TypeScript type definitions
├── tests/
│   ├── unit/          # Unit tests
│   ├── integration/   # Integration tests
│   └── e2e/           # End-to-end tests
└── public/            # Static assets
```

## 🚀 Scripts

### Development

- `pnpm dev` — Start development server
- `pnpm build` — Build for production
- `pnpm preview` — Preview production build
- `pnpm lint` — Run ESLint
- `pnpm format` — Run Prettier
- `pnpm type-check` — Run TypeScript compiler

### Testing

- `pnpm test` — Run all tests
- `pnpm test:unit` — Run unit tests
- `pnpm test:integration` — Run integration tests
- `pnpm test:e2e` — Run E2E tests
- `pnpm test:coverage` — Generate test coverage report

### Quality Assurance

- `pnpm validate:precommit` — Fast validation (lint, unit tests)
- `pnpm validate:full` — Full validation (lint, format, type-check, all tests)
- `pnpm storybook` — Start Storybook
- `pnpm build-storybook` — Build Storybook

### Docker

- `pnpm docker:build` — Build Docker image
- `pnpm docker:run` — Run Docker container
- `pnpm docker:compose` — Start with docker-compose

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

Here's our suggested branching strategy:

- `main`: For production-ready code
- `dev`: For ongoing development
- Feature branches: `feature/feature-name`
- Bug fix branches: `fix/bug-name`
- Release branches: `release/v1.x.x`

For pull requests, we recommend using the PR template and running the pre-commit hooks to ensure code quality.

### PR Conventions

To help maintain consistency and make the review process smoother, we recommend:

- Using conventional commit format for PR titles
- Filling out the PR template sections (`.github/pull_request_template.md`) to provide context
- Checking the relevant boxes in "Type of change" and "Quality assurance" sections
- Following the PR template structure to ensure all necessary information is included

These guidelines help us maintain a clear and organized workflow while making it easier for everyone to contribute.

## 📚 Additional Resources

### Documentation

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Vite Documentation](https://vitejs.dev/guide/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Storybook Documentation](https://storybook.js.org/docs/react/get-started/introduction)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Credits

This starter template was created and is maintained by [Shynn](https://github.com/shynnobi)

[![GitHub](https://img.shields.io/badge/GitHub-shynnobi-24292e.svg?style=for-the-badge&logo=github)](https://github.com/shynnobi)
[![Bluesky](https://img.shields.io/badge/Bluesky-@shynnobi-0560ff.svg?style=for-the-badge&logo=bluesky)](https://bsky.app/profile/shynnobi.bsky.social)
[![Instagram](https://img.shields.io/badge/Instagram-@shynnobi-E4405F.svg?style=for-the-badge&logo=instagram)](https://www.instagram.com/shynnobi_)
