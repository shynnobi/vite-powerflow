# GitHub Workflows

This document describes the GitHub Actions workflows configured in this project and provides guidance on managing them.

## Overview

The project uses GitHub Actions for:

1. **Continuous Integration (CI)** - Runs code quality checks on all PRs and branch pushes to `main` and `dev`.
2. **Dependabot Automation** - Automatically approves and merges dependency updates targeting the `dev` branch.

## CI Workflow (`.github/workflows/ci.yml`)

The CI workflow runs on all pushes and pull requests to the `main` and `dev` branches.

### Jobs

1. **ESLint** - Runs JavaScript/TypeScript linting
2. **Prettier** - Checks code formatting
3. **TypeScript** - Verifies type correctness
4. **Commitlint** - Validates commit message format (only on PRs)
5. **Build** - Builds the project if all previous checks pass

### CI Workflow Configuration Snippet

```yaml
on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main, dev]
```

The workflow uses the `pnpm` package manager with caching for better performance. Each job sets up the Node.js environment, installs dependencies, and runs the respective checks.

## Dependabot Auto-Merge (`.github/workflows/dependabot-auto.yml`)

This workflow automatically approves and merges dependency updates from Dependabot that target the `dev` branch.

### Key Features

- Auto-approves all Dependabot PRs targeting `dev`.
- Auto-merges patch, minor, AND major version updates if all checks pass.
- Uses `pull_request_target` event for proper permissions handling when using `secrets.GH_TOKEN`.

### Dependabot Workflow Configuration Snippet (Permissions)

```yaml
permissions:
  pull-requests: write # Required for the built-in GITHUB_TOKEN if used by actions
  contents: write # Required for the built-in GITHUB_TOKEN if used by actions

# ... inside jobs steps that use gh CLI:
# env:
#   GH_TOKEN: ${{secrets.GH_TOKEN}} # Uses the PAT stored in repository secrets
```

These top-level permissions allow the built-in `GITHUB_TOKEN` to perform actions if directly used by an action. However, our `dependabot-auto.yml` explicitly uses `secrets.GH_TOKEN` for `gh` commands, so the permissions of the PAT in that secret are paramount.

## Common Issues and Solutions

### Dependabot Auto-Merge Not Working

If auto-merge isn't working for Dependabot PRs (targeting `dev`):

1.  **`GH_TOKEN` Secret**: Ensure the `GH_TOKEN` repository secret is created and contains a valid PAT with `pull-requests: write` and `contents: write` permissions for the repository (see "Repository Configuration for Workflows" below).
2.  **Branch Protection Rules on `dev`**: If you've enabled branch protection:
    - Ensure required status checks can be satisfied by Dependabot PRs (CI should run and pass).
    - The auto-approve step (using `GH_TOKEN`) should satisfy review requirements if any.
3.  **Workflow Failure**: Check the run logs for the "Dependabot Auto-Merge" workflow on the PR for any errors.

## Workflow Maintenance

When updating GitHub Actions workflows:

1.  **Action Versions**: Keep action versions (e.g., `actions/checkout@v4`) updated for security and features.
2.  **pnpm Version**: Ensure the pnpm version in the workflows matches the one in `package.json`.
3.  **Test Changes**: Test workflow changes in a feature branch before merging to `dev`.
4.  **Monitor Runs**: After changes, monitor workflow runs to ensure they complete successfully.

## Repository Configuration for Workflows

For the GitHub Actions workflows (CI and Dependabot Auto-Merge) to function correctly in your repository (especially when created from this starter), certain repository settings and secrets need to be in place.

### 1. Workflow Permissions (Repository Level)

Ensure your repository allows Actions to have sufficient permissions:

1.  Go to your repository **Settings** → **Actions** → **General**.
2.  Under "Workflow permissions":
    - It's recommended to select **Read and write permissions**. This allows actions like `actions/checkout` to write to `GITHUB_EVENT_PATH` and enables workflows to create or approve pull requests if they are designed to do so using the built-in `GITHUB_TOKEN`.
    - Crucially, ensure **Allow GitHub Actions to create and approve pull requests** is checked. This is essential for the `dependabot-auto.yml` workflow (which uses a PAT via `secrets.GH_TOKEN`) to be able to approve and merge PRs.
3.  Click **Save**.

![Workflow Permissions Settings](https://docs.github.com/assets/cb-44583/mw-1440/images/help/actions/workflow-permissions.webp)

### 2. `GH_TOKEN` Repository Secret (Crucial for Dependabot Auto-Merge)

The `dependabot-auto.yml` workflow uses a Personal Access Token (PAT) via a repository secret named `GH_TOKEN` to approve and merge Dependabot pull requests.

**Action Required:** You MUST create this secret in your repository:

1.  Create a new fine-grained PAT in your GitHub account:
    - Go to **Your GitHub Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**.
    - Set an appropriate name (e.g., "repo-vite-powerflow-dependabot").
    - Select the **expiration** for the token.
    - For **Repository access**, select "Only select repositories" and choose your `vite-powerflow` repository.
    - Under **Permissions** → **Repository permissions**, grant:
      - `Contents`: Read and write
      - `Pull requests`: Read and write
      - (Optionally, `Workflows`: Read and write, if you anticipate this token might be used for workflow dispatch or management in the future, though not strictly needed for the current dependabot auto-merge script).
    - Click **Generate token** and copy the generated token.
2.  Add this token as a repository secret:
    - Go to your repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.
    - Name it exactly: `GH_TOKEN`
    - Paste your PAT as the value and click **Add secret**.

_The `dependabot-auto.yml` workflow is already configured to use this `GH_TOKEN` secret._

### 3. Branch Protection Rules (Optional but Recommended)

To maintain code quality on your `main` and `dev` branches, consider setting up branch protection rules:

1.  Go to **Settings** → **Branches** → **Branch protection rules** → **Add rule**.
2.  For "Branch name pattern", enter `main` (and repeat for `dev` if desired).
3.  Commonly enabled protections:
    - **Require a pull request before merging**: Ensures changes go through a review process.
    - **Require status checks to pass before merging**:
      - In the status checks search, select the CI checks defined in `ci.yml` (e.g., `ESLint`, `TypeScript`, `Build`).
    - **Require conversation resolution before merging**.
4.  **For Dependabot Compatibility with Branch Protections (on `dev` branch):**
    - If you require status checks, ensure Dependabot PRs can satisfy them (our CI runs on its PRs targeting `dev`).
    - The auto-approve step in `dependabot-auto.yml` (using the PAT in `GH_TOKEN`) should satisfy review requirements if any.
    - The PAT in `GH_TOKEN` needs `pull-requests: write` and `contents: write` to perform the merge.

### 4. Verifying Workflow Functionality

Once your repository is set up with the correct permissions and secrets:

**For CI Workflow:**

1.  Make a small change in a new branch.
2.  Open a pull request targeting `dev` (or `main`).
3.  Observe the CI workflow runs and all checks pass.

**For Dependabot Auto-Merge:**

- This is best tested when Dependabot actually creates PRs (configured to target `dev` as per `.github/dependabot.yml`).
- When a Dependabot PR is created for `dev`:
  - Verify the `dependabot` check (from `dependabot-auto.yml`) runs and succeeds.
  - If all other CI checks on the PR pass, it should auto-merge.

---

**Note:** For information on setting up and using the GitHub CLI (`gh`) for manual or AI-assisted GitHub operations, which can complement these automated workflows, please see the [AI GitHub Integration Guide](./ai-github-integration.md).
