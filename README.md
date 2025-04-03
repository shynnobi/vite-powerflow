# Vite PowerFlow ⚡ v1.0.0

A modern React starter kit with a robust development workflow, featuring comprehensive tooling and industry best practices for professional applications.

[![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)](./CHANGELOG.md)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.4-646CFF.svg)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.0.17-38B2AC.svg)](https://tailwindcss.com/)
[![Storybook](https://img.shields.io/badge/Storybook-8.6.11-FF4785.svg)](https://storybook.js.org/)
[![ESLint](https://img.shields.io/badge/ESLint-9.23.0-4B32C3.svg)](https://eslint.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

<div align="center">

## 👨‍💻 Author

<a href="https://github.com/shynnobi">
  <img src="https://github.com/shynnobi.png" width="100" alt="Shynn" style="border-radius: 100px"/>
</a>

**Shynn** · _Front-end Developer & 3D Artist_

[![GitHub](https://img.shields.io/badge/GitHub-shynnobi-24292e.svg?style=for-the-badge&logo=github)](https://github.com/shynnobi)
[![Bluesky](https://img.shields.io/badge/Bluesky-@shynnobi-0560ff.svg?style=for-the-badge&logo=bluesky)](https://bsky.app/profile/shynnobi.bsky.social)
[![Instagram](https://img.shields.io/badge/Instagram-@shynnobi-E4405F.svg?style=for-the-badge&logo=instagram)](https://www.instagram.com/shynnobi_)

</div>

## 📑 Table of Contents

- [Vite PowerFlow](#vite-powerflow)
  - [📑 Table of Contents](#-table-of-contents)
  - [✨ Features](#-features)
  - [📦 Project Structure](#-project-structure)
  - [🚀 Getting Started](#-getting-started)
    - [Option 1: Standard Setup](#option-1-standard-setup)
    - [Option 2: Using Dev Container (Recommended)](#option-2-using-dev-container-recommended)
    - [Dev Container Benefits](#dev-container-benefits)
    - [Git Configuration with Dev Container](#git-configuration-with-dev-container)
  - [🎨 Theming](#-theming)
  - [🔄 Path Aliases](#-path-aliases)
    - [Adding a New Path Alias](#adding-a-new-path-alias)
  - [🔗 Git Hooks](#-git-hooks)
  - [🧪 Testing](#-testing)
  - [📚 Component Development with Storybook](#-component-development-with-storybook)
  - [🛠️ Available Scripts](#️-available-scripts)
  - [📝 Code Conventions](#-code-conventions)
  - [📄 License](#-license)
  - [📋 Changelog](#-changelog)

## ✨ Features

- ⚡️ **[Vite](https://vitejs.dev/)** - Lightning fast build tool
- ⚛️ **[React 19.1](https://react.dev/)** - Latest React version with Hooks
- 📝 **[TypeScript](https://www.typescriptlang.org/)** - Static typing for robust code
- 🎨 **Styling & UI** :
  - 🌊 [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
  - 🎯 [shadcn/ui](https://ui.shadcn.com/) for beautiful, accessible components
  - 📚 [Storybook](https://storybook.js.org/) for component documentation and testing
  - 🌓 Dark mode support with theme switching
  - 🎭 [react-icons](https://react-icons.github.io/react-icons/) for beautiful icons
- 🧪 **Complete Testing Setup** :
  - 🃏 [Vitest](https://vitest.dev/) for unit and integration tests
  - 🎭 [Playwright](https://playwright.dev/) for E2E testing
  - 🧪 [@testing-library/react](https://testing-library.com/react) for component testing
- 📏 **Code Quality** :
  - [ESLint](https://eslint.org/) with latest flat config (v9)
  - [Prettier](https://prettier.io/) for code formatting
  - [TypeScript ESLint](https://typescript-eslint.io/) for TypeScript-specific rules
- 🔍 **Pre-commit hooks** :
  - [Husky](https://typicode.github.io/husky/) for git hooks
  - [lint-staged](https://github.com/okonet/lint-staged) for staged files linting
  - [commitlint](https://commitlint.js.org/) for standardized commit messages
- 📦 **State Management** :
  - [Zustand](https://zustand-demo.pmnd.rs/) for simple and scalable state management

## 📦 Project Structure

```
├── src/                  # Application source code
│ ├── components/         # Reusable components
│ │ └── ui/               # shadcn/ui components with Storybook stories
│ ├── store/              # Zustand state management
│ ├── assets/             # Static assets
│ ├── context/            # React context providers
│ ├── pages/              # Page components
│ ├── lib/                # Utility libraries
│ ├── utils/              # Utility functions (logging, etc.)
│ └── shared/             # Shared types and interfaces
├── tests/                # Tests
│ ├── e2e/                # End-to-end tests
│ ├── integration/        # Integration tests
│ └── unit/               # Unit tests
├── public/               # Static files
├── .husky/               # Git hooks configuration
├── eslint.config.js      # ESLint configuration
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── vitest.config.ts      # Vitest configuration
├── playwright.config.ts  # Playwright E2E testing configuration
├── commitlint.config.js  # Commit message linting rules
├── .storybook/          # Storybook configuration
└── components.json       # shadcn/ui components configuration
```

## 🚀 Getting Started

This starter kit can be used in two ways: directly or with development containers.

### Option 1: Standard Setup

1. Create a new project using this template:

   ```bash
   # Using degit (recommended)
   npx degit shynnobi/vite-powerflow my-project
   # OR clone the repository
   git clone https://github.com/shynnobi/vite-powerflow my-project
   ```

2. Navigate to your project:

   ```bash
   cd my-project
   ```

3. Install dependencies:

   ```bash
   pnpm install
   # OR using npm
   npm install
   # OR using yarn
   yarn install
   ```

4. Start the development server:
   ```bash
   pnpm dev
   # OR using npm
   npm run dev
   # OR using yarn
   yarn dev
   ```

### Option 2: Using Dev Container (Recommended)

For a consistent development experience across all environments, we recommend using the included Dev Container configuration:

1. Prerequisites:

   - Install [Docker](https://www.docker.com/get-started/) on your machine
   - Install [VS Code](https://code.visualstudio.com/)
   - Install the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for VS Code

2. Create a new project using this template:

   ```bash
   # Using degit (recommended)
   npx degit shynnobi/vite-powerflow my-project
   # OR clone the repository
   git clone https://github.com/shynnobi/vite-powerflow my-project
   ```

3. Open the project in VS Code:

   ```bash
   cd my-project
   code .
   ```

4. When prompted "Reopen in Container", click "Reopen in Container"

   - Alternatively, use the command palette (F1) and select "Dev Containers: Reopen in Container"

5. The container will build automatically, install all dependencies, and you can start developing immediately. The development server will be accessible at http://localhost:5173.

### Dev Container Benefits

- Consistent development environment for all contributors
- All dependencies and tools are pre-installed
- No need to install Node.js, PNPM, or other tools locally
- Isolation from your local system
- Works identically on Windows, macOS, and Linux

### Git Configuration with Dev Container

The development container is configured to use your local Git configuration. Make sure your `.gitconfig` file is properly set up with your name and email:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

If you're using the development container and your commits don't appear with your GitHub avatar, you may need to run these commands inside the container.

## 🎨 Theming

The project includes a dark mode implementation using Tailwind CSS and React context:

- Toggle between light and dark modes
- System preference detection
- Persistent theme selection
- Smooth theme transitions

## 🔄 Path Aliases

This project uses path aliases to avoid relative import paths like `../../../components`. The following aliases are pre-configured:

- `@/*` → `src/*`
- `@assets/*` → `src/assets/*`
- `@components/*` → `src/components/*`
- `@context/*` → `src/context/*`
- `@lib/*` → `src/lib/*`
- `@pages/*` → `src/pages/*`
- `@shared/*` → `src/shared/*`
- `@store/*` → `src/store/*`
- `@tests/*` → `tests/*`
- `@utils/*` → `src/utils/*`

### Adding a New Path Alias

To add a new path alias (e.g., `@utils/*`), you need to update the following files:

1. **vite.config.ts**:

   ```typescript
   resolve: {
     alias: [
       // ... existing aliases
       { find: '@utils', replacement: resolve(__dirname, 'src/utils') },
     ],
   },
   ```

2. **vitest.config.ts**:

   ```typescript
   resolve: {
     alias: [
       // ... existing aliases
       { find: '@utils', replacement: resolve(__dirname, 'src/utils') },
     ],
   },
   ```

3. **tsconfig.json**:

   ```json
   "paths": {
     // ... existing paths
     "@utils/*": ["src/utils/*"]
   }
   ```

4. **tsconfig.app.json**:
   ```json
   "paths": {
     // ... existing paths
     "@utils/*": ["src/utils/*"]
   }
   ```

After adding the alias, you can use it in your imports:

```typescript
import { formatDate } from '@utils/date';
```

## 🔗 Git Hooks

This project includes pre-configured Git hooks using Husky and lint-staged to ensure code quality. These hooks run automatically when you commit code:

### Pre-commit Workflow

1. **Code Formatting** (via Prettier)

   - Runs only on staged files via lint-staged
   - Automatically fixes formatting issues
   - Ensures consistent code style
   - Handles indentation, spacing, and other formatting rules

2. **Code Quality** (via ESLint)

   - Runs on staged files
   - Enforces coding standards
   - Catches potential errors
   - Ensures best practices are followed

3. **Type Checking** (via TypeScript)

   - Validates all TypeScript types
   - Ensures type safety across the codebase
   - Prevents type-related runtime errors

4. **Testing** (via Vitest)
   - Runs tests related to changed files
   - Ensures no breaking changes
   - Maintains code reliability

### Commit Message Validation

Uses commitlint to enforce [Conventional Commits](https://www.conventionalcommits.org/) format:

```bash
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks
- `perf` - Performance improvements
- `ci` - CI/CD changes
- `revert` - Revert changes

**Examples:**

```bash
feat(ui): add new button component
fix(api): handle null response from server
docs: update installation instructions
```

### Configuration Files

- `.husky/` - Hook scripts
- `commitlint.config.js` - Commit message rules
- `.lintstagedrc` - Staged files configuration

The hooks are installed automatically when you run `pnpm install` through the `prepare` script.

> **Note**: If you're using Windows, make sure you have Git Bash or a similar Unix-like environment installed for the hooks to work properly.

## 🧪 Testing

- Unit and Integration tests:

  ```bash
  pnpm test # Run all tests
  pnpm test:watch # Watch mode
  pnpm test:ui # Vitest UI interface
  ```

- E2E tests:
  ```bash
  pnpm test:e2e # Run E2E tests with Playwright
  pnpm test:e2e:ui # Run E2E tests with Playwright UI
  ```

## 📚 Component Development with Storybook

This starter includes Storybook for component development and documentation:

```bash
# Start Storybook development server
pnpm storybook

# Build Storybook for production
pnpm build-storybook
```

Features included in the setup:

- Interactive component playground
- Dark mode support
- Responsive viewport testing
- Accessibility addon
- Documentation with MDX support

> **Note**: Check out the [Storybook documentation](https://storybook.js.org/) for best practices and guidelines on how to structure and write your stories.

## 🛠️ Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm test` - Run all tests
- `pnpm test:verbose` - Run tests with detailed output
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm test:e2e` - Run E2E tests with Playwright
- `pnpm test:e2e:verbose` - Run E2E tests with detailed tracing
- `pnpm lint` - Check code with ESLint
- `pnpm lint:fix` - Fix ESLint issues automatically
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm fix` - Format and fix all code (Prettier + ESLint)
- `pnpm type-check` - Check TypeScript types
- `pnpm validate` - Run all validation checks (format:check, lint, type-check, test)
- `pnpm prepare` - Prepare Husky git hooks
- `pnpm storybook` - Start Storybook development server
- `pnpm build-storybook` - Build Storybook for production

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

The MIT License is a permissive license that allows you to use, modify, distribute, and sublicense the code for both private and commercial purposes, provided that the original copyright notice and the license text are included.

## 📋 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a detailed list of changes between versions.
