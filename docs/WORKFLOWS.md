# Technical Workflow

## Development Environment

### Dev Container Benefits

Our Dev Container setup provides several advantages:

- Consistent development environment for all team members
- Automatic installation of required extensions
- Preconfigured linting and formatting
- Isolated dependencies
- Reproducible builds

### Container Configuration

The Dev Container is configured in `.devcontainer/devcontainer.json`:

```json
{
	"name": "Docker Vite Blank Starter",
	"dockerFile": "Dockerfile",
	"customizations": {
		"vscode": {
			"extensions": [
				"dbaeumer.vscode-eslint",
				"esbenp.prettier-vscode",
				"github.vscode-pull-request-github"
				// ... other extensions
			]
		}
	}
}
```

### Installed Extensions

- ESLint: Code quality and style checking
- Prettier: Code formatting
- GitHub Pull Requests: PR management
- TypeScript support
- Testing tools

### Local Development Flow

1. **First Time Setup**:

   ```bash
   git clone <repository>
   code <repository>
   # VS Code will prompt to reopen in container
   ```

2. **Container Features**:

   - Node.js and pnpm pre-installed
   - Git configured with credential forwarding
   - Pre-configured development tools
   - Shared extensions across team

3. **Best Practices**:

   - Always work inside the container
   - Use VS Code's integrated terminal
   - Let extensions handle formatting
   - Use container-specific settings

4. **Troubleshooting**:
   - Rebuild container if dependencies change
   - Check Docker logs for issues
   - Verify Docker Desktop is running
   - Check port conflicts

## Branch Protection

### Why?

Branch protection is essential for:

- Maintaining code quality
- Avoiding accidental errors
- Ensuring review process
- Keeping clean history

### Configuration

```yaml
# For main branch
protection:
  required_status_checks:
    strict: true
    contexts:
      - lint # Check code quality
      - test # Run tests
      - build # Verify compilation
```

#### Automatic Checks

1. **Lint**:

   - ESLint checks style
   - Prettier checks formatting
   - TypeScript checks types

2. **Tests**:

   - Unit tests (Vitest)
   - E2E tests (Playwright)
   - Code coverage

3. **Build**:
   - TypeScript compilation
   - Vite build
   - Bundle analysis

## Git Workflow

### 1. Local Development

```bash
# Create a new feature
git checkout dev
git checkout -b feature/new-feature

# Develop and commit
git add .
git commit -m "feat(scope): description"

# Update from dev
git fetch origin dev
git rebase origin/dev
```

### 2. Local Checks

```bash
# Before each commit
pnpm lint      # Check code
pnpm test      # Run tests
pnpm build     # Verify build

# Automatic hooks
pre-commit     # Lint + Tests
commit-msg     # Check message format
```

### 3. Pull Request

- Create on GitHub
- Fill template
- Wait for checks
- Request review

### 4. Review Process

1. **Reviewer**:

   - Check logic
   - Test locally
   - Comment code
   - Approve or request changes

2. **Author**:
   - Respond to comments
   - Make changes
   - Push corrections
   - Request new review

### 5. Merge

```bash
# Once approved
git checkout dev
git merge --no-ff feature/new-feature
git push origin dev
```

## Quality Tools

### ESLint

```javascript
// Configuration
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ]
}
```

### Prettier

```javascript
// Configuration
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2
}
```

### TypeScript

```json
// Strict configuration
{
	"strict": true,
	"noImplicitAny": true,
	"strictNullChecks": true
}
```

## CI/CD Pipeline

### GitHub Actions

1. **Pull Request**:

   - Lint
   - Tests
   - Build
   - Preview

2. **Merge to Dev**:

   - Complete tests
   - Build
   - Deploy staging

3. **Merge to Main**:
   - Complete tests
   - Build
   - Deploy production

## Best Practices for Solo Dev

1. **Why Follow This Process?**

   - Maintains quality
   - Trains in standards
   - Facilitates future collaboration
   - Automatic documentation

2. **Solo Adaptations**

   - Optional reviews
   - Simplified CI/CD
   - Focus on automation

3. **Benefits**
   - Cleaner code
   - Fewer bugs
   - Better maintainability
   - Professional growth
