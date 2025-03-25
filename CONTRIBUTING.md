# Contributing Guide

Welcome to the project! This guide will help you get started with our development workflow.

## 🐳 Development Environment

We use Dev Containers to ensure everyone works in the same environment.

### Setup

1. Make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) and [VS Code](https://code.visualstudio.com/) with [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) installed
2. Clone the repository and open it in VS Code
3. When prompted, click "Reopen in Container"
4. The container will build and set up everything you need

Our Dev Container provides:

- Consistent environment across all team members
- Pre-installed dependencies (Node.js, pnpm)
- Configured extensions (ESLint, Prettier, GitHub, TypeScript tools)
- Isolated development that won't conflict with your local setup

The configuration is in `.devcontainer/devcontainer.json` if you need to check the details.

## 🔄 Development Workflow

### Branch Organization

We follow a structured branching strategy:

- `main` - Production-ready code, protected branch
- `dev` - Main development branch, all feature work branches from here
- `feature/*` - New features (e.g., `feature/auth-system`)
- `fix/*` - Bug fixes (e.g., `fix/login-validation`)

The `dev` branch is automatically created during project initialization, providing a stable base for development.

### Starting a new feature

```bash
# Ensure you're on dev and it's up to date
git checkout dev
git pull origin dev

# Create your feature branch
git checkout -b feature/your-feature-name
# OR for bug fixes
git checkout -b fix/your-fix-name
```

Work on your changes, then validate them:

```bash
pnpm lint    # Check code quality
pnpm test    # Run tests
pnpm build   # Verify build
```

### Pull Request Flow

1. Push your branch:

   ```bash
   git push origin feature/your-feature-name
   ```

2. Create a Pull Request targeting the `dev` branch (not `main`)
3. Fill in the PR template
4. Address any review comments
5. Once approved, your changes will be merged into `dev`

Periodically, `dev` will be merged into `main` for releases.

### 📝 Commit Guidelines

We follow conventional commits: `type(scope): description`

Common types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

Example: `feat(auth): add Google login support`

## 🛠️ Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Create production build
- `pnpm test` - Run tests
- `pnpm lint` - Check code quality

## 📏 Code Standards

We use TypeScript in strict mode with ESLint and Prettier. Configuration files are in the repository root. Set up your editor to use these tools automatically when saving files.

## 🪝 Git Hooks

We use Husky to run Git hooks that enforce code quality:

- **pre-commit**: Runs linting and formatting checks on staged files
- **commit-msg**: Validates commit messages follow our conventions

The project is configured to automatically initialize a Git repository if needed and set up hooks when you install dependencies. If hooks don't run correctly, you may need to:

```bash
# Configure Git to use the hooks in the .husky directory
git config core.hooksPath .husky

# Make sure hooks have execute permissions
chmod +x .husky/*
```

These commands run automatically on `npm/pnpm install` through the postinstall script.

## 🚀 CI/CD Pipeline

Our GitHub Actions workflow automatically runs tests and builds on PRs and deployments.

## 🤝 Need Help?

If you have questions:

1. Check existing issues
2. Create a new issue with details about what you're trying to do
3. Reach out in our discussion channels

Happy coding!
