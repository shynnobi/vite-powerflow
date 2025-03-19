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

### Starting a new feature

```bash
# Get the latest dev branch
git checkout dev
git pull

# Create your feature branch
git checkout -b feature/your-feature-name
```

Work on your changes, then validate them:

```bash
pnpm lint    # Check code quality
pnpm test    # Run tests
pnpm build   # Verify build
```

### 📝 Commit Guidelines

We follow conventional commits: `type(scope): description`

Common types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

Example: `feat(auth): add Google login support`

### 🔀 Pull Request Process

1. Push your branch and create a PR to the `dev` branch
2. Fill in the PR template
3. Address any review comments
4. Once approved, your changes will be merged

## 🛠️ Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Create production build
- `pnpm test` - Run tests
- `pnpm lint` - Check code quality

## 📏 Code Standards

We use TypeScript in strict mode with ESLint and Prettier. Configuration files are in the repository root. Set up your editor to use these tools automatically when saving files.

## 🚀 CI/CD Pipeline

Our GitHub Actions workflow automatically runs tests and builds on PRs and deployments.

## 🤝 Need Help?

If you have questions:

1. Check existing issues
2. Create a new issue with details about what you're trying to do
3. Reach out in our discussion channels

Happy coding!
