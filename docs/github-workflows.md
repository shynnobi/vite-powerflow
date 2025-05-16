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

### CI Workflow Configuration

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

### Dependabot Workflow Configuration

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

The workflow uses `GH_TOKEN` with explicitly defined permissions:

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

## Setup for New Projects

When using this starter template for a new project, follow these steps to ensure GitHub workflows function correctly:

### 1. Repository Setup

After creating your repository (either by using this template or cloning and pushing to a new repo):

- Go to repository **Settings** → **Actions** → **General**
- Under "Workflow permissions":
  - Select **Read and write permissions**
  - Check **Allow GitHub Actions to create and approve pull requests**
  - Click **Save**

![Workflow Permissions Settings](https://docs.github.com/assets/cb-44583/mw-1440/images/help/actions/workflow-permissions.webp)

### 2. Branch Protection (Optional but Recommended)

To ensure code quality:

1. Go to **Settings** → **Branches** → **Branch protection rules** → **Add rule**
2. For "Branch name pattern" enter `main` (and/or `dev`)
3. Check:
   - **Require a pull request before merging**
   - **Require status checks to pass before merging**
     - In the status checks search, select the CI checks like `ESLint`, `TypeScript`, etc.
4. For Dependabot compatibility, consider:
   - Adding `dependabot[bot]` to **Allow specified actors to bypass required pull requests**
   - Checking **Allow specified actors to bypass required status checks**

### 3. GitHub Token Setup

The workflows are configured to use the `GH_TOKEN` which needs to be set up in your repository.

**IMPORTANT**: For auto-merge/approval functionality to work, you **MUST** configure your repository settings:

1. Go to repository **Settings** → **Actions** → **General**
2. Under "Workflow permissions":
   - Select **Read and write permissions**
   - Check **Allow GitHub Actions to create and approve pull requests**
   - Click **Save**

If you cannot or prefer not to enable these settings, you'll need to modify the workflows to use a custom Personal Access Token (PAT):

1. Create a new fine-grained PAT in your GitHub account:

   - Go to **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**
   - Set appropriate permissions (at minimum: Contents: write, Pull requests: write)
   - Copy the generated token

2. Add this token as a repository secret:

   - Go to your repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
   - Name it `GH_TOKEN`
   - Paste your token as the value and click **Add secret**

3. The workflows are already configured to use this token name.

### 4. Verify Workflow Files

Ensure these workflow files exist in your repository:

- `.github/workflows/ci.yml`
- `.github/workflows/dependabot-auto.yml`

If you've used this starter template directly, they should already be in place. If you've copied files manually, make sure to include these workflow files.

### 5. Testing the Workflows

Once your repository is set up with the correct permissions and workflows:

**For CI Workflow:**

1. Make a small change to any file in your repository
2. Create a branch and push the change
3. Open a pull request targeting your `main` or `dev` branch
4. Observe that the CI workflow automatically runs and performs all checks
5. Once all checks pass, your PR can be merged

**For Dependabot Auto-Merge:**

- This can only be fully tested when Dependabot creates actual PRs
- You may need to wait for dependency updates or manually trigger Dependabot
- To manually trigger, you can modify your `dependabot.yml` file to run more frequently or use GitHub's interface to trigger dependency checks
- When a Dependabot PR is created, verify that:
  - The PR is automatically approved
  - Auto-merge is enabled (you'll see a note in the PR that "This pull request will be automatically merged")

---

**Note:** For information on setting up and using the GitHub CLI (`gh`) for manual or AI-assisted GitHub operations, which can complement these automated workflows, please see the [AI GitHub Integration Guide](./ai-github-integration.md).
