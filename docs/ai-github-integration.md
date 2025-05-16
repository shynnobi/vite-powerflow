# AI GitHub Integration Guide

This guide explains **the existing setup** for GitHub CLI authentication in your development container, enabling AI assistants to perform GitHub operations like creating PRs, viewing issues, and more. **This setup is pre-configured in this starter project.**

## Prerequisites

- A GitHub Personal Access Token (PAT) with appropriate permissions (see below for generation steps if you need a new one or want to understand the required permissions).
- The `GH_TOKEN` environment variable set on your **local machine** (the one running VS Code and Docker) with the value of your PAT. The dev container will automatically pick this up.

## Understanding the Setup

### 1. GitHub Personal Access Token (PAT)

For the GitHub CLI to operate on your behalf (whether used by you directly or by an AI assistant), it needs a Personal Access Token (PAT).

**If you need to create or verify your PAT:**

1. Go to your GitHub account → Settings → Developer settings → Personal access tokens → Fine-grained tokens.
2. Click "Generate new token".
3. Set an appropriate name (e.g., "devcontainer-vite-powerflow") and expiration date.
4. Set repository access to this specific repository or all repositories you intend to work on with this setup.
5. Ensure the following permissions are selected:
   - Repository permissions:
     - Contents: Read and write
     - Pull requests: Read and write
     - Issues: Read and write
     - Workflows: Read and write
6. Click "Generate token" and copy the token value. **This token is what you\'ll set as `GH_TOKEN` on your local machine.**

### 2. GitHub CLI Authentication in the Development Container

The GitHub CLI (`gh`) is pre-installed in your development container. It\'s authenticated in one of two ways:

- **Automatic (Recommended & Pre-configured): Via `GH_TOKEN` Environment Variable:**

  - The dev container is configured (in `.devcontainer/devcontainer.json`) to set an internal `GH_TOKEN` environment variable using the value of `GH_TOKEN` from your **local machine\'s environment** (thanks to `"${localEnv:GH_TOKEN}"`).
  - **Action required by you:** Ensure you have `GH_TOKEN` exported in your local shell environment _before_ launching the dev container. For example:

    ```bash
    # On Linux/macOS (add to your .zshrc, .bashrc, etc. for persistence)
    export GH_TOKEN=your_pat_token_here

    # On Windows (PowerShell) (add to your PowerShell profile for persistence)
    $env:GH_TOKEN = "your_pat_token_here"
    ```

  - The GitHub CLI automatically detects and uses this `GH_TOKEN` for authentication. This is the standard approach for this starter project.

- **Manual (If `localEnv:GH_TOKEN` is not set up or fails):**

  - If `GH_TOKEN` is not picked up from your local environment, you might need to authenticate `gh` manually inside the container for the session:

    ```bash
    # Option A: Interactive authentication (will prompt you)
    gh auth login

    # Option B: Non-interactive authentication (useful for scripting or if prompted by AI)
    gh auth login --with-token < <(echo YOUR_PAT_TOKEN_VALUE_HERE)
    ```

  - For AI pair programming, if manual login is needed, Option B is often preferred.

### 3. How AI Assistants Use This Setup

Once the GitHub CLI is authenticated (ideally automatically via your local `GH_TOKEN`), AI assistants can leverage it by proposing `gh` commands to run in the integrated terminal. Examples:

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
    - Verify that `GH_TOKEN` is correctly set on your **local machine** and exported _before_ you launched the dev container.
    - Ensure your PAT has not expired and has the correct permissions (Contents, Pull requests, Issues, Workflows - all Read & Write).
    - If you suspect the automatic `GH_TOKEN` passing isn\'t working, try a manual `gh auth login` inside the container as a test.
2.  **Permission denied**: Double-check PAT scopes and repository access settings on GitHub.
3.  **Command not found (`gh`):** This shouldn\'t happen as `gh` is installed via `onCreateCommand` in `devcontainer.json`. If it does, there might have been an issue during container creation.
4.  **Rate limiting**: GitHub API has rate limits. This is rare for typical CLI usage.

## Security Considerations

- Never commit your PAT directly into `devcontainer.json` or any other project files. The `${localEnv:GH_TOKEN}` mechanism is designed to avoid this.
- Use tokens with the minimum required permissions.
- Set appropriate expiration dates for your PATs.

## References

- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [GitHub PAT Documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitHub Codespaces Environment Variables](https://docs.github.com/en/codespaces/developing-in-codespaces/using-github-codespaces-with-github-cli)

---

**Note:** For details on the automated GitHub Actions workflows used in this project (such as CI and Dependabot auto-merging), please refer to the [GitHub Workflows Guide](./github-workflows.md).
