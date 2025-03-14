# Contributing Guide

## 🌳 Branch Structure

```
main (production)
  └── dev (development)
       └── feature/* (features)
```

- `main`: Production code, stable
- `dev`: Active development, feature integration
- `feature/*`: Temporary branches for new features

## 🔄 Development Workflow

1. **Feature Creation**

   ```bash
   git checkout dev
   git checkout -b feature/my-feature
   ```

2. **Development**

   - Frequent commits with conventional messages
   - Unit tests for new features
   - Follow code standards

3. **Local Validation**

   ```bash
   pnpm lint      # Code verification
   pnpm test      # Unit tests
   pnpm build     # Build verification
   ```

4. **Pull Request**
   - Create PR to `dev`
   - Fill PR template
   - Wait for automatic checks

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

## 🔍 Code Standards

- TypeScript strict mode
- ESLint with standard configuration
- Prettier for formatting
- Unit tests with Vitest
- E2E tests with Playwright

## 🚀 Branch Protection

### Main (Production)

- Tests required
- Review required
- No direct push
- Linear history

### Dev (Development)

- Tests required
- Review recommended
- Merge via PR only

## 📦 Available Scripts

```bash
pnpm dev          # Local development
pnpm build        # Production build
pnpm test         # Unit tests
pnpm test:e2e     # E2E tests
pnpm lint         # Code verification
pnpm format       # Code formatting
```

## 🤝 Best Practices

1. **Commits**

   - Clear and descriptive messages
   - One commit = one logical change
   - No commits on `main`

2. **Code**

   - Relevant comments
   - Explicit variable names
   - Tests for new features

3. **Pull Requests**

   - Clear description
   - Screenshots for UI changes
   - List of changes

4. **Reviews**
   - Check logic
   - Test locally
   - Constructive comments
