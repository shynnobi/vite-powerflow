# GitHub CI Workflows Setup Guide

This document describes the GitHub Actions workflows pre-configured in this starter project and provides guidance on ensuring they function correctly in your repository.

## Overview

This starter project uses GitHub Actions for:

1. **Continuous Integration (CI)** - Runs code quality checks on PRs and pushes to `main` and `dev` branches.
2. **Dependabot Automation** - Automatically approves and attempts to merge dependency updates.

## Ensuring Workflows Function in Your Project

When using this starter template for a new project, the workflows are already included. However, to ensure they operate correctly within _your specific GitHub repository_, please review the following configuration aspects:

### 1. GitHub Integration and Repository Settings

**Crucial Step:** For automated features like Dependabot auto-merge to function, your repository needs to be correctly configured to permit these actions. This involves:

- **Personal Access Token (PAT):** You may need a PAT for various GitHub interactions. Learn how to create one in the [GitHub Authentication and Permissions Setup Guide](./github-permissions-setup.md).
- **`GH_PAT` Repository Secret:** While most pre-configured workflows use the standard `GITHUB_TOKEN`, setting up a `GH_PAT` secret in your repository (using your PAT) can be important for certain Dependabot behaviors or for custom workflows you might add. Details on its role and setup are in the [GitHub Authentication and Permissions Setup Guide (Section 1.C)](./github-permissions-setup.md#c-repository-GH_PAT-secret).
- **Repository Action Permissions:** Your repository must be configured to allow GitHub Actions to have read and write access and to create/approve PRs. These settings are vital for the standard `GITHUB_TOKEN` used by workflows.
  - Refer to the [GitHub Authentication and Permissions Setup Guide (Section 2)](./github-permissions-setup.md#2-github-actions-workflow-permissions-repository-settings) for instructions on configuring these permissions (Settings → Actions → General → Workflow permissions).

Please ensure you've reviewed and applied the relevant configurations from the **[GitHub Authentication and Permissions Setup Guide](./github-permissions-setup.md)** before expecting all automated workflows to function seamlessly.

### 2. Branch Protection Rules (Recommended)

To maintain code quality in your repository, consider setting up branch protection rules for `main` and/or `dev` branches:

1. Go to **Settings** → **Branches** → **Branch protection rules** → **Add rule**.
2. For "Branch name pattern," enter `main` (and/or `dev`).
3. Check:
   - **Require a pull request before merging**
   - **Require status checks to pass before merging**
     - Select the relevant CI checks (e.g., `ESLint`, `TypeScript`, `Build`).
4. For Dependabot compatibility with branch protection:
   - Ensure your CI checks are configured to run on Dependabot PRs.
   - Consider adding `dependabot[bot]` to "Allow specified actors to bypass required pull requests" if your auto-merge strategy relies on this and your security posture allows it. Alternatively, ensure the auto-merge workflow can satisfy all checks.

### 3. Included Workflow Files

This starter project includes the following workflow files in `.github/workflows/`:

- `ci.yml` (Continuous Integration)
- `dependabot-auto.yml` (Dependabot Auto-Approve and Merge)

### 4. Testing the Workflows

Once your repository settings are configured as per the [GitHub Authentication and Permissions Setup Guide](./github-permissions-setup.md):

**For CI Workflow:**

1. Make a small change to any file in a new branch.
2. Push the branch and open a pull request targeting your `main` or `dev` branch.
3. Observe the CI workflow execution in the "Actions" tab of your PR or repository.
4. Once all checks pass, the PR should indicate it's ready for review/merge.

**For Dependabot Auto-Merge:**

- This is best observed when Dependabot creates a PR for a dependency update.
- Ensure repository Action permissions and potentially the `GH_PAT` secret are configured as per the [GitHub Authentication and Permissions Setup Guide](./github-permissions-setup.md).
- When a Dependabot PR is created:
  - The `dependabot-auto.yml` workflow should trigger.
  - It should attempt to approve the PR.
  - If auto-merge conditions are met (PR is mergeable, CI passes), it should attempt to merge.

## CI Workflow (`.github/workflows/ci.yml`)

The CI workflow runs on pushes and pull requests to the `main` and `dev` branches.

### Jobs

1. **ESLint** - Lints JavaScript/TypeScript.
2. **Prettier** - Checks code formatting.
3. **TypeScript** - Verifies type correctness.
4. **Commitlint** - Validates commit message format (on PRs via `pull_request_target`).
5. **Build** - Builds the project if previous checks pass.

### CI Workflow Configuration

```yaml
on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main, dev]
```

The workflow uses `pnpm` with caching. Each job sets up Node.js, installs dependencies, and runs checks.

## Dependabot Auto-Merge (`.github/workflows/dependabot-auto.yml`)

This workflow aims to automatically approve and merge dependency updates from Dependabot.

### Key Features

- Auto-approves Dependabot PRs.
- Attempts to auto-merge patch, minor, AND major version updates if CI passes and the PR is mergeable.
- Uses `pull_request_target` for appropriate permissions with the standard `GITHUB_TOKEN`.

### Dependabot Workflow Configuration & Permissions

```yaml
permissions:
  pull-requests: write
  contents: write
```

These permissions are granted to the standard `GITHUB_TOKEN` that the workflow runs with. It's crucial that your repository settings (Settings → Actions → General → Workflow permissions) allow actions to have these permissions, as detailed in the [GitHub Authentication and Permissions Setup Guide](./github-permissions-setup.md).

## Common Issues and Solutions

### Dependabot Auto-Merge Not Working

If auto-merge isn't working for Dependabot PRs, check these first:

1. **Repository Action Permissions:** Verify that your repository settings (Settings → Actions → General) allow "Read and write permissions" and "Allow GitHub Actions to create and approve pull requests." This is fundamental. See the [GitHub Authentication and Permissions Setup Guide](./github-permissions-setup.md).
2. **Branch Protection Rules:** If enabled:
   - Ensure Dependabot PRs can satisfy all required status checks.
   - Consider if `dependabot[bot]` needs to be allowed to bypass PR requirements or if the merge strategy needs adjustment.
3. **Workflow Permissions in `dependabot-auto.yml`:** The file requests `pull-requests: write` and `contents: write`. These are for the standard `GITHUB_TOKEN` and should be sufficient if repository settings (point 1) are correct.
4. **`GH_PAT` Secret Role:** The `GH_PAT` repository secret (if you've set one up) is typically not the primary mechanism for the `dependabot-auto.yml` workflow's _own execution permissions_. However, it can be relevant if Dependabot runs into issues that require elevated permissions beyond the standard `GITHUB_TOKEN` (e.g., overriding branch protections not configured to allow `dependabot[bot]`) or if you have custom scripts that authenticate using `secrets.GH_PAT`. For basic auto-approve/merge, the standard `GITHUB_TOKEN` with correct repo/workflow permissions is key.
5. **Merge Conflicts or Failing CI:** Auto-merge will naturally fail if the PR has merge conflicts or if required CI checks are failing.

### General Workflow Permission Errors

1. **Repository-Level Permissions:** Always re-check **Settings → Actions → General → "Workflow permissions"** first. "Read and write permissions" is generally recommended for this starter to function fully.
2. **PAT Scopes for `GH_PAT` (if used explicitly):** If any workflow _you add or modify_ is designed to use your custom `GH_PAT` secret, ensure the PAT used for that secret has the necessary scopes (e.g., `contents: write`, `pull-requests: write`).
3. **Permissions in Workflow YAML:** The `permissions` block in a workflow file dictates the maximum permissions for the _standard_ `GITHUB_TOKEN` for that run. It cannot grant more than what's allowed at the repository level.

## Workflow Maintenance

When managing the workflows in this starter:

1. **Action Versions**: Periodically review and update action versions (e.g., `actions/checkout@vX`) in the YAML files for security and features.
2. **pnpm Version**: Ensure the pnpm version specified in workflows matches your project's `package.json` `engines` or `packageManager` field if present.
3. **Test Changes**: Always test workflow modifications in a feature branch and PR before merging to `main` or `dev`.
4. **Monitor Runs**: Regularly check the "Actions" tab in your repository for the status of workflow runs.

---

**Note:** For detailed guidance on setting up your development environment for GitHub CLI and AI-assisted development, which complements these automated workflows, refer to the [GitHub CLI AI Setup Guide](./github-cli-ai-setup.md).
