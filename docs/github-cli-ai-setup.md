# GitHub CLI AI Setup Guide

This guide explains how AI assistants leverage the GitHub CLI within your development container to perform GitHub operations like creating PRs, viewing issues, and more. **This setup relies on prior configuration.**

## Prerequisites

Before proceeding, ensure you have configured your GitHub Personal Access Token (PAT) and made it available as `GH_PAT` (or your host machine's equivalent like `GITHUB_PAT` if `localEnv:GITHUB_PAT` is used in `devcontainer.json`) in your local environment, as detailed in the **[GitHub Authentication and Permissions Setup Guide](./github-permissions-setup.md)**. This initial setup is crucial for the GitHub CLI to authenticate correctly, both for your direct use and for AI-driven operations. You will likely need to explicitly authenticate the GitHub CLI using this token as described below.

## Understanding the Setup

This section explains how GitHub CLI (`gh`) is authenticated within the dev container, assuming the prerequisites (PAT creation and `GH_PAT` local environment variable setup as per the [GitHub Authentication and Permissions Setup Guide](./github-permissions-setup.md)) are met.

### 1. GitHub CLI Authentication in the Development Container

The GitHub CLI (`gh`) is pre-installed in your development container. It needs to be authenticated, typically using your `GH_PAT` environment variable:

- **`GH_PAT` Environment Variable:**

  - The dev container (`.devcontainer/devcontainer.json`) should be configured to set an internal `GH_PAT` environment variable using the value of `GH_PAT` (or `GITHUB_PAT` if that is the name of the variable on your local machine) from your **local machine's environment** (e.g., via `"${localEnv:GH_PAT}"` or `"${localEnv:GITHUB_PAT}"`).
  - **Your responsibility:** Ensure `GH_PAT` (or `GITHUB_PAT`) is exported in your local shell environment _before_ launching the dev container. For detailed instructions on creating a PAT and setting up this local `GH_PAT` (or `GITHUB_PAT`), refer to the [GitHub Authentication and Permissions Setup Guide](./github-permissions-setup.md).
  - **CLI Authentication Step:** The GitHub CLI (`gh`) does not automatically detect `GH_PAT` for authentication. You must explicitly authenticate it, for example, by running `echo $GH_PAT | gh auth login --with-token -` or `gh auth login --with-token` and pasting your PAT value once the container is running or as part of its setup.

- **Host `gh` Authentication:**

  - If `gh` is authenticated on your host machine, some dev container setups (especially with Docker Desktop and VS Code) can forward this authentication into the container. However, explicitly setting and using `GH_PAT` as above provides more direct control.

- **Manual Authentication (Alternative):**
  - If the `GH_PAT` environment variable is not set or propagated, you would need to manually authenticate `gh` inside the container for the session, typically by running `gh auth login --with-token` and pasting the token. Refer to the [GitHub Authentication and Permissions Setup Guide](./github-permissions-setup.md) for PAT generation.

### 2. How AI Assistants Use This Setup

Once the GitHub CLI is authenticated (using your `GH_PAT` as described above), AI assistants can leverage it by proposing `gh` commands to run in the integrated terminal. Examples:

```bash
# Create a PR
gh pr create --title "Your PR title" --body-file pr_description.md --base main

# List open PRs
gh pr list --state open --json number,title,headRefName

# Check PR status
gh pr view [PR_NUMBER] --json number,title,state,mergeable
```

## Troubleshooting

Common issues and their solutions:

1.  **Authentication errors with `gh` commands**:
    - Verify that `GH_PAT` (or `GITHUB_PAT` if that is your local variable name) is correctly set on your **local machine** and exported _before_ you launched the dev container, as per the [GitHub Authentication and Permissions Setup Guide](./github-permissions-setup.md).
    - Ensure you have run `gh auth login --with-token` using your `GH_PAT` inside the dev container or in your current session.
    - Ensure your PAT (used for `GH_PAT`) has not expired and has the correct permissions (e.g., `contents: write`, `pull-requests: write`). See the [GitHub Authentication and Permissions Setup Guide](./github-permissions-setup.md) for scope recommendations.
    - If you suspect issues with `GH_PAT` propagation, you can test inside the container by running `echo $GH_PAT` (should show your PAT) or try a manual `gh auth status` (after attempting to login).
2.  **Permission denied**: Double-check PAT scopes (defined in your `GH_PAT`) and repository access settings on GitHub. The [GitHub Authentication and Permissions Setup Guide](./github-permissions-setup.md) provides guidance on necessary permissions.
3.  **Command not found (`gh`):** This is unlikely as `gh` is installed via `devcontainer.json`. If it occurs, rebuilding the container might resolve it.
4.  **Rate limiting**: GitHub API has rate limits. This is rare for typical CLI usage.

## Security Considerations

- Never commit your PAT directly into `devcontainer.json` or any other project files. The `${localEnv:GH_PAT}` (or `${localEnv:GITHUB_PAT}`) mechanism is designed to avoid this.
- Follow the principle of least privilege for PAT scopes, as recommended in the [GitHub Authentication and Permissions Setup Guide](./github-permissions-setup.md).
- Set appropriate expiration dates for your PATs.

## References

- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [GitHub PAT Documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitHub Codespaces Environment Variables](https://docs.github.com/en/codespaces/developing-in-codespaces/using-github-codespaces-with-github-cli)
- **[GitHub Authentication and Permissions Setup Guide](./github-permissions-setup.md)** - For PAT creation, scopes, and `GH_PAT` (local environment and repository secret) setup.

---

**Note:** For details on the automated GitHub Actions workflows used in this project (such as CI and Dependabot auto-merging), please refer to the [GitHub Workflows Guide](./github-ci-workflows-setup.md).
