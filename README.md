# Vite PowerFlow ⚡

<div style="display: flex; flex-wrap: wrap; gap: 4px;">
  <img src="https://img.shields.io/github/package-json/dependency-version/shynnobi/vite-powerflow/dev/vite?label=Vite&logo=vite&logoColor=white&color=646CFF" alt="Vite" />
  <img src="https://img.shields.io/github/package-json/dependency-version/shynnobi/vite-powerflow/dev/react?label=React&logo=react&logoColor=white&color=61DAFB" alt="React" />
  <img src="https://img.shields.io/github/package-json/dependency-version/shynnobi/vite-powerflow/dev/typescript?label=TypeScript&logo=typescript&logoColor=white&color=3178C6" alt="TypeScript" />
  <img src="https://img.shields.io/github/package-json/dependency-version/shynnobi/vite-powerflow/tailwindcss?label=Tailwind%20CSS&logo=tailwindcss&logoColor=white&color=06B6D4" alt="Tailwind CSS" />
  <img src="https://img.shields.io/github/package-json/dependency-version/shynnobi/vite-powerflow/dev/vitest?label=Vitest&logo=vitest&logoColor=white&color=6E9F18" alt="Vitest" />
  <img src="https://img.shields.io/github/package-json/dependency-version/shynnobi/vite-powerflow/dev/@playwright/test?label=Playwright&logo=playwright&logoColor=white&color=2EAD33" alt="Playwright" />
  <img src="https://img.shields.io/github/package-json/dependency-version/shynnobi/vite-powerflow/dev/eslint?label=ESLint&logo=eslint&logoColor=white&color=4B32C3" alt="ESLint" />
  <img src="https://img.shields.io/github/package-json/dependency-version/shynnobi/vite-powerflow/dev/storybook?label=Storybook&logo=storybook&logoColor=white&color=FF4785" alt="Storybook" />
  <img src="https://img.shields.io/github/package-json/dependency-version/shynnobi/vite-powerflow/zustand?label=Zustand&logo=zustand&logoColor=white&color=F45825" alt="Zustand" />
  <img src="https://img.shields.io/github/package-json/dependency-version/shynnobi/vite-powerflow/@tanstack/react-query?label=TanStack%20Query&logo=react-query&logoColor=white&color=FF4154" alt="TanStack Query" />
  <img src="https://img.shields.io/github/license/shynnobi/vite-powerflow?color=yellow&label=License" alt="License" />

</div>
<br/>

A React + Vite starter, fully containerized for reproducible and collaborative development, with strict code quality tooling and AI pair programming workflow (Cursor rules). Includes comprehensive testing, linting, and CI/CD configurations following industry best practices.

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [AI-Powered Development](#-ai-powered-development)
- [Development Setup](#-development-setup)
- [Testing](#-testing)
- [Configuration](#️-project-configuration)
- [Available Scripts](#-available-scripts)
- [Contribution Guidelines](#-contribution-guidelines)
- [License](#-license)

<hr>

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

### 🧪 Testing & Code Quality

- **[Vitest](https://vitest.dev/)** for unit and integration tests
- **[Playwright](https://playwright.dev/)** for end-to-end testing
- **[ESLint](https://eslint.org/)** + **[Prettier](https://prettier.io/)** for code quality and formatting

### 🔄 Development Workflow

- Git hooks with **[Husky](https://typicode.github.io/husky/)**
- Staged files linting with **[lint-staged](https://github.com/okonet/lint-staged)**
- Standardized commits with **[commitlint](https://commitlint.js.org/)**
- Automated CI/CD with **[GitHub Actions](https://github.com/features/actions)**

<hr>

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
<!-- - [Docker](https://www.docker.com/) (required for containerized development) -->
- [Cursor AI Editor](https://www.cursor.com) or [Visual Studio Code](https://code.visualstudio.com/)
- [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension

### Installation

1. **Create a new project using the CLI**

   ```bash
   npx create-powerflow-app my-app
   cd my-app
   ```

2. Open your new project in [Cursor](https://cursor.com) (recommended) or [VS Code](https://code.visualstudio.com)

3. `Reopen in Container` when prompted (DevContainer)

4. Start developing! 🚀

> For the full AI-powered development experience, use the Cursor code editor.
> In Visual Studio Code, Cursor rules are not recognized.

<hr>

## 🤖 AI-Powered Development

Vite PowerFlow is optimized for **[Cursor AI Code Editor](https://cursor.com)** with pre-configured rules that enhance AI code assistance and code generation. These rules are defined in the `.cursor/rules/` directory and help the AI understand your project's context and best practices.

> **Note**: While the project works perfectly with any IDE, Cursor's AI features require a paid subscription to access the enhanced development experience.

For detailed GitHub CLI and AI integration setup, see [GitHub CLI AI Setup](docs/github-cli-ai-setup.md)

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

<hr>

## 💻 Development Setup

This section outlines the essential tools, configurations, and workflows that power the development environment. From code quality tools to CI/CD pipelines, everything is set up to ensure consistent, high-quality development practices across the team.

### Code Quality

- Prettier (`.prettierrc`) — Code formatting standards
- ESLint (`eslint.config.js`) — TypeScript and React linting rules
- EditorConfig (`.editorconfig`) — Editor-agnostic coding styles
- CommitLint (`commitlint.config.js`) — Conventional commit messages
- lint-staged — Staged files validation

### Development Environment

- **VS Code Dev Container** (`.devcontainer/devcontainer.json`)
  - Pre-configured settings in `.vscode/settings.json`
  - Automatic installation of preconfigured extensions (`.vscode/extensions.json`)
  - Custom lifecycle scripts (`.devcontainer/scripts/`)
    - `on-create.sh`: Initial setup when container is created
    - `post-create.sh`: Post-creation tasks and configurations
    - `update-content.sh`: Updates applied when container is rebuilt
- **Docker Setup**
  - Identical environment for all contributors
  - Fast onboarding with pre-installed dependencies
  - Uses `Dockerfile`, `docker-compose.yml`, and `.devcontainer/devcontainer.json`

### UI Development

- **Component Library**
  - shadcn/ui (`components.json`) — UI component library configuration
  - Storybook — Component documentation and development
- **Styling**
  - Tailwind CSS — Utility-first CSS framework
  - PostCSS — CSS processing and optimization

### CI/CD Workflows

#### Local Development

Local development workflows ensure code quality before changes are committed or pushed to the repository. These hooks run automatically to validate your changes.

- **Pre-commit** (`.husky/pre-commit`)
  - Fast validation: lint, unit/integration tests
  - Command: `pnpm validate:precommit`
- **Pre-push** (`.husky/pre-push`)
  - Full validation: lint, format, type-check, all tests
  - Command: `pnpm validate:full`

#### Pipeline Configuration

The main CI/CD pipeline configuration that runs on GitHub Actions. This pipeline ensures code quality and consistency across all environments.

- **Continuous Integration** (`.github/workflows/ci.yml`)
  - Code quality checks: ESLint, Prettier, TypeScript
  - Commit message validation with CommitLint
  - Build verification
  - Runs on push to `main`/`dev` and pull requests
  - Clean environment validation
  - ⚠️ E2E tests skipped in CI (free tier) but required locally

> For detailed CI/CD setup instructions, see [GitHub CI/CD Workflows Setup](docs/github-ci-workflows-setup.md)

#### Branch Protection

Branch protection rules are managed through Configuration as Code. The rules defined in `.github/branch-protection.yml` are automatically applied by a GitHub Actions workflow, ensuring consistent protection across all environments. When creating a new project from this template, branch protection rules are automatically set up - no manual configuration needed in GitHub's interface.

- **Branch Protection** (`.github/branch-protection.yml`)
  - Automated protection rules for `main` and `dev` branches
  - Required status checks for all branches
  - Linear history enforcement
  - Pull request review requirements

> For detailed GitHub permissions and branch protection setup, see [GitHub Permissions Setup](docs/github-permissions-setup.md)

#### Dependency Management

Automated dependency updates and security patches management through Dependabot. All updates are created as PRs targeting the `dev` branch for proper review and testing before reaching production.

- **Dependency Management** (`.github/workflows/dependabot-auto.yml`)
  - Automated dependency updates with Dependabot
  - Auto-merge for compatible updates
  - Support for semver updates (patch, minor, major)
  - Automatic PR approval for security updates
  - Weekly updates for npm and GitHub Actions
  - Grouped updates by dependency type (dev/prod)

<hr>

## 🧪 Testing

Our testing strategy ensures code quality and reliability through a comprehensive suite of automated tests. We employ a multi-layered approach combining unit, integration, and end-to-end testing to catch issues early and maintain high standards.

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

### Browser Management (Playwright)

- Smart browser installation (on-demand)
- Chromium by default, Firefox/WebKit when needed
- Persistent browser cache for faster runs

<hr>

## ⚙️ Project Configuration

This section details the essential configuration aspects of the project, including environment variables, project structure, and architectural decisions. Understanding these configurations is crucial for development and maintenance.

### Environment Variables

- **Development**: `.env.development`
  - `VITE_API_URL`: API endpoint for development
  - `VITE_APP_ENV`: Set to "development"
- **Production**: `.env.production`
  - `VITE_API_URL`: Production API endpoint
  - `VITE_APP_ENV`: Set to "production"

### Architecture

```
├── src/
│   ├── components/    # Reusable UI components
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

<hr>

## 🚀 Available Scripts

This project includes a comprehensive set of scripts to streamline development, testing, and quality assurance workflows. These scripts are designed to maintain code quality and ensure consistent development practices.

### Development

- `pnpm dev` — Start development server
- `pnpm build` — Build for production
- `pnpm preview` — Preview production build
- `pnpm lint` — Run ESLint
- `pnpm format` — Run Prettier
- `pnpm type-check` — Run TypeScript compiler

### Testing

- `pnpm test` — Run unit and integration tests
- `pnpm test:unit` — Run unit tests
- `pnpm test:integration` — Run integration tests
- `pnpm test:e2e` — Run E2E tests
- `pnpm test:coverage` — Generate test coverage report

### Quality Assurance

- `pnpm validate:precommit` — Fast validation (lint, format, type-check and unit tests)
- `pnpm validate:full` — Full validation (lint, format, type-check and unit tests, integration tests, E2E tests)
- `pnpm storybook` — Start Storybook local server

See `package.json` for the complete list of available scripts.

<hr>

## 🤝 Contribution Guidelines

These guidelines are designed to help your team collaborate effectively on any project built with this starter template. They provide a standardized approach to development that ensures code quality and maintainability across your team.

### Commit Conventions

We recommend using [commitlint](https://commitlint.js.org/) to enforce [Conventional Commits](https://www.conventionalcommits.org/) for all commit messages. This helps maintain a clear and consistent commit history.

**Simple format:**

```
type(scope): short description

detailed description (optional)

footer (optional)
```

**Commit types:**

- ✨ `feat`: New feature
- 🐛 `fix`: Bug fix
- 📚 `docs`: Documentation
- 💅 `style`: Formatting, missing semicolons, etc.
- ♻️ `refactor`: Code refactoring
- ⚡️ `perf`: Performance improvements
- ✅ `test`: Tests
- 🔧 `chore`: Maintenance

**Example commits:**

```bash
# Adding a feature
feat(auth): add Google authentication

# Fixing a bug
fix(api): fix 404 error handling

# Documentation
docs(readme): update installation instructions
```

### Git Workflow

We recommend this branching strategy for your project:

```
main (production)
   ↑
dev (development)
   ↑
feature/* (new features)
```

- `main`: Production-ready code
- `dev`: Main development branch
- `feature/*`: Feature branches for new development

### Pull Requests

We provide two approaches for creating Pull Requests, both based on our PR template (`.github/pull_request_template.md`):

#### 1. Using Cursor IDE (Recommended)

If you're using Cursor IDE, the AI will automatically:

- Analyze your code changes
- Generate a comprehensive PR description based on the template
- Suggest appropriate change types and quality checks
- Help review the changes for consistency and standards

The AI uses the PR template structure while intelligently filling it based on your actual code modifications.

#### 2. Using PR Template Directly

For those not using Cursor, you can directly use the PR template located at `.github/pull_request_template.md`. This template provides a structured format for:

- Describing changes
- Listing implemented features
- Tracking completed tasks
- Specifying change types
- Ensuring quality assurance
- Adding additional notes
- Handling Dependabot updates

Both approaches ensure consistent PR documentation by following the same template structure. Cursor IDE simply makes the process more efficient by automatically generating the content based on your changes.

<hr>

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<hr>

## 👤 Credits

This starter template was created and is maintained by [Shynn](https://github.com/shynnobi)

[![GitHub](https://img.shields.io/badge/GitHub-shynnobi-24292e.svg?style=for-the-badge&logo=github)](https://github.com/shynnobi)
