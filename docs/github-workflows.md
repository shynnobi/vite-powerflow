# GitHub Workflows

This document describes the GitHub Actions workflows configured in this project and provides guidance on managing them.

## Overview

The project uses GitHub Actions for:

1. **Continuous Integration (CI)** - Runs code quality checks on all PRs and branch pushes
2. **Dependabot Automation** - Automatically approves and merges dependency updates

## CI Workflow (`.github/workflows/ci.yml`)

The CI workflow runs on all pushes and pull requests to the `main` and `dev` branches.

### Jobs

1. **ESLint** - Runs JavaScript/TypeScript linting
2. **Prettier** - Checks code formatting
3. **TypeScript** - Verifies type correctness
4. **Commitlint** - Validates commit message format (only on PRs)
5. **Build** - Builds the project if all previous checks pass

### Configuration

```yaml
on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main, dev]
```

The workflow uses the `pnpm` package manager with caching for better performance. Each job sets up the Node.js environment, installs dependencies, and runs the respective checks.

## Dependabot Auto-Merge (`.github/workflows/dependabot-auto.yml`)

This workflow automatically approves and merges dependency updates from Dependabot.

### Key Features

- Auto-approves all Dependabot PRs
- Auto-merges patch, minor, AND major version updates
- Uses `pull_request_target` event for proper permissions handling

### Configuration

```yaml
permissions:
  pull-requests: write
  contents: write
```

These permissions are crucial for the workflow to function correctly - they allow it to approve PRs and enable auto-merge.

## Common Issues and Solutions

### Dependabot Auto-Merge Not Working

If auto-merge isn't working for Dependabot PRs, check:

1. **Branch Protection Rules**: If you've enabled branch protection in your repository:

   - Go to Settings → Branches → Branch protection rules
   - Consider adding `dependabot[bot]` to "Allow specified actors to bypass required pull requests"
   - Make sure required status checks can be satisfied by Dependabot PRs

2. **Required Reviews**: If your protection rules require reviews:

   - The auto-approve step should handle this
   - Verify the workflow completed successfully

3. **Required CI Checks**: If CI checks are required to pass:
   - Ensure the CI workflow is working properly
   - Make sure no checks are failing on Dependabot PRs

### Token Permissions

The workflow uses `GITHUB_TOKEN` with explicitly defined permissions:

```yaml
permissions:
  pull-requests: write
  contents: write
```

If you're seeing permission errors:

- Check that these permissions are correctly defined
- Verify you haven't unintentionally restricted workflow permissions in repository settings

## Workflow Maintenance

When updating GitHub Actions workflows:

1. **Action Versions**: Keep action versions (e.g., `actions/checkout@v4`) updated
2. **pnpm Version**: Ensure the pnpm version in the workflows matches the one in `package.json`
3. **Test Changes**: Test workflow changes in a branch before merging to `main`
4. **Monitor Runs**: After changes, monitor workflow runs to ensure they complete successfully
