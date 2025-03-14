# Contributing Guide

Welcome to the project! This guide will help you get started quickly.

## 🐳 Development Environment

This project uses Dev Containers to ensure a consistent development environment across the team.

### Prerequisites

- Docker Desktop
- VS Code with Remote - Containers extension

### Quick Setup

1. Clone the repository
2. Open in VS Code
3. Click "Reopen in Container" when prompted
4. Wait for the container to build

> 💡 The container will automatically install all required extensions and dependencies

## 🔄 Quick Start

1. **Setup your branch**

   ```bash
   git checkout dev
   git checkout -b feature/my-feature
   ```

2. **Development**

   - Write your code
   - Add tests
   - Follow our standards

3. **Validation**

   ```bash
   pnpm lint      # Code verification
   pnpm test      # Unit tests
   pnpm build     # Build verification
   ```

4. **Submit Changes**
   - Create PR to `dev`
   - Wait for checks
   - Address reviews

> 📚 For detailed workflow information, see [Technical Workflow](docs/workflow.md)

## 📝 Commit Conventions

Format: `type(scope): description`

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Maintenance

Examples:

```bash
feat(auth): add Google login
fix(api): fix request timeout
docs(readme): update installation guide
```

## 📦 Available Scripts

```bash
pnpm dev          # Local development
pnpm build        # Production build
pnpm test         # Unit tests
pnpm test:e2e     # E2E tests
pnpm lint         # Code verification
pnpm format       # Code formatting
```

## 🔍 Code Standards

- TypeScript strict mode
- ESLint with standard configuration
- Prettier for formatting
- Tests required for new features

> 📚 For detailed standards and configurations, see [Technical Workflow](docs/workflow.md#quality-tools)

## 🤝 Need Help?

1. Check the [Technical Workflow](docs/workflow.md) documentation
2. Review our [Best Practices](docs/workflow.md#best-practices-for-solo-dev)
3. Create an issue if you're stuck
