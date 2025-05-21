# GitHub CLI AI Setup Guide

This guide explains how AI assistants leverage the GitHub CLI within your development container to perform GitHub operations like creating PRs, viewing issues, and more. **This setup relies on prior configuration.**

## Prerequisites

- Copy `.env.example` to `.env` at the root of your project.
- Add your GitHub Personal Access Token (PAT) as follows:
  ```
  GH_PAT=your_personal_access_token_here
  ```
- The `init-gh-auth.sh` script (called automatically at each container creation/rebuild) will authenticate the GitHub CLI using this token if present.

## How the Setup Works

- The GitHub CLI (`gh`) is pre-installed in your development container.
- At each container creation/rebuild, the `init-gh-auth.sh` script will attempt to authenticate the CLI using the token in `.env`.
- If `.env` or `GH_PAT` is missing, the script will display a help message.
- Once authenticated, AI assistants and the CLI can perform GitHub operations (create PRs, list issues, etc.) without further manual intervention.

## Re-authentication / Token Update

- If your token expires or you need to change it, update the value in `.env` and run:
  ```sh
  sh ./init-gh-auth.sh
  ```
- You can also rebuild the container to trigger automatic authentication.

## Security Considerations

- Never commit your PAT or the `.env` file. `.env` is in `.gitignore` by default. Only `.env.example` is versioned.
- Use the minimum required scopes for your PAT.

## References

- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [GitHub PAT Documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitHub Authentication and Permissions Setup Guide](./github-permissions-setup.md)

---

For details on the automated GitHub Actions workflows used in this project (such as CI and Dependabot auto-merging), please refer to the [GitHub Workflows Guide](./github-ci-workflows-setup.md).
