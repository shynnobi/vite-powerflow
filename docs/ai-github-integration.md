# AI GitHub Integration Guide

This guide explains how to set up GitHub CLI authentication in development containers to enable AI assistants to perform GitHub operations like creating PRs, viewing issues, and more.

## Prerequisites

- GitHub CLI installed in your development environment (usually pre-installed in GitHub Codespaces and our devcontainer)
- A GitHub account with access to the repository
- A Personal Access Token (PAT) with appropriate permissions

## Setup Steps

### 1. Generate a GitHub Personal Access Token (PAT)

1. Go to your GitHub account → Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. Click "Generate new token"
3. Set an appropriate name and expiration date
4. Set the repository access to the specific repository or all repositories
5. Select these permissions:
   - Repository permissions:
     - Contents: Read and write
     - Pull requests: Read and write
     - Issues: Read and write
     - Workflows: Read and write
6. Click "Generate token" and copy the token value

### 2. Authenticate GitHub CLI in your Development Container

When you start your development container or codespace, you'll need to authenticate the GitHub CLI:

```bash
# Option 1: Interactive authentication
gh auth login

# Option 2: Non-interactive authentication
gh auth login --with-token < <(echo YOUR_PAT_TOKEN)
```

For AI pair programming, Option 2 is recommended as it can be done programmatically.

### 3. Persist Authentication Across Sessions (Optional)

To avoid reauthenticating in each new session, you can:

1. Add your GitHub token to your repository's secrets
2. Configure your devcontainer to use this secret

Add this to your `.devcontainer/devcontainer.json`:

```json
"containerEnv": {
  "GH_TOKEN": "${localEnv:GH_TOKEN}"
},
```

The GitHub CLI looks for the `GH_TOKEN` environment variable. In our project, we standardize on using `GH_TOKEN` for all GitHub operations, including GitHub Actions workflows (where traditionally `GITHUB_TOKEN` is used).

You can set the GH_TOKEN environment variable before starting your devcontainer:

```bash
# On Linux/macOS
export GH_TOKEN=your_token_here

# On Windows (PowerShell)
$env:GH_TOKEN = "your_token_here"
```

## Using GitHub CLI with AI Assistants

Once authenticated, AI assistants can use GitHub CLI commands like:

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

1. **Authentication errors**: Ensure your PAT has not expired and has the correct permissions
2. **Permission denied**: Check that your token has access to the repository
3. **Command not found**: Verify that GitHub CLI is installed (`gh --version`)
4. **Rate limiting**: GitHub API has rate limits; ensure you're not exceeding them
5. **Token environment variable issues**:
   - Make sure `GH_TOKEN` is set correctly for both GitHub CLI and GitHub Actions

## Security Considerations

- Never commit your PAT to version control
- Consider using repository secrets for storing sensitive tokens
- Use tokens with the minimum required permissions
- Set appropriate expiration dates for your tokens

## References

- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [GitHub PAT Documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitHub Codespaces Environment Variables](https://docs.github.com/en/codespaces/developing-in-codespaces/using-github-codespaces-with-github-cli)
