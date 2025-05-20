# GitHub Authentication and Permissions Setup Guide

This guide helps you, as a user of the Vite PowerFlow starter, to set up your GitHub Personal Access Token (PAT) and configure your repository for optimal GitHub interaction. This includes enabling pre-configured automated workflows and effectively using tools like GitHub CLI and AI assistants.

## 1. GitHub Personal Access Token (PAT)

A GitHub Personal Access Token (PAT) is often required for tools and services to interact with your repositories on your behalf or with specific permissions.

### A. Creating a GitHub PAT

1.  Go to your [GitHub Developer Settings](https://github.com/settings/tokens?type=beta).
2.  Click on "Fine-grained tokens" then "Generate new token".
3.  **Token name:** Give your token a descriptive name (e.g., `vite-powerflow-dev-user`).
4.  **Expiration:** Choose an appropriate expiration period.
5.  **Repository access:**
    - Select "Only select repositories" and choose the repository where you are using this starter.
6.  **Permissions:** Under "Repository permissions," grant the following scopes based on your needs:
    - **For CLI & AI Development Tools:**
      - **Contents:** Read and write (for committing changes, reading files).
      - **Pull requests:** Read and write (for creating/managing PRs).
      - **Issues:** Read and write (for interacting with issues).
      - **Workflows:** Read and write (for `gh workflow` commands).
      - _(Optional)_ **Gists:** Read and write (if you use `gh gist`).
      - _(Optional, for organization access)_ **Administration (Organization):** `read:org`.
    - **For a PAT used as `GH_PAT` Repository Secret (see section 1.C):**
      - **Actions:** Read and write (to allow actions triggered by this token to manage other actions or checks).
      - **Contents:** Read and write.
      - **Pull requests:** Read and write.
      - **Workflows:** Read and write.
    - **Metadata:** Read-only (standard, usually default for most tokens).
7.  Click "Generate token".
8.  **Important:** Copy the token immediately. You will not be able to see it again.

### B. Configuring `GH_PAT` for the Development Environment (CLI & AI Tools)

This token, set as an environment variable `GH_PAT` in your development environment, allows tools like GitHub CLI (`gh`) and AI assistants (like Cursor) to interact with GitHub on your behalf.

**For the Dev Container (Recommended for this Starter Project):**

Our `devcontainer.json` is designed to help make `GH_PAT` available within the container. To leverage this:

1.  **Ensure your PAT is accessible for Dev Container injection.**

    - **Option 1 (Host `gh` Authentication & Forwarding):** Authenticate GitHub CLI on your _host machine_ (outside the container) using your PAT.
      1.  Install GitHub CLI on your host: [https://github.com/cli/cli#installation](https://github.com/cli/cli#installation)
      2.  Run: `gh auth login` on your host, choose "Paste an authentication token," and use your PAT. This will typically store the token in a way that `gh` (even inside the container if host integration is good) can find it. Alternatively, ensure your PAT is exported as `GH_PAT` (or the variable name you use on your host, like `GITHUB_PAT` if that's what `localEnv` refers to) in the host environment from which the dev container is launched (e.g. in your `.zshrc` or `.bashrc`).
          The dev container is often configured to pick this up.
    - **Option 2 (Project Environment File - if configured):** Some setups might use a `.env` file (e.g., at project root, added to `.gitignore`) that `devcontainer.json` reads:
      ```env
      GH_PAT=YOUR_PAT_HERE
      ```
      _(Refer to this project's `devcontainer.json` or related setup notes for the specific mechanism used.)_

2.  **Verify in Dev Container:** Once the dev container is running, check with `echo $GH_PAT`. For `gh` to use this, you will likely need to run `echo $GH_PAT | gh auth login --with-token -` or `gh auth login --with-token` and paste the token value.

**General GitHub CLI Authentication:**

1.  Install GitHub CLI: [https://github.com/cli/cli#installation](https://github.com/cli/cli#installation)
2.  Set the `GH_PAT` environment variable: `export GH_PAT="YOUR_PAT_HERE"` (add this to your shell profile like `.zshrc` or `.bashrc`).
3.  Authenticate the CLI: `echo $GH_PAT | gh auth login --with-token -` or `gh auth login --with-token` and paste your PAT.

This configures `gh` for general use. For persistence in dev containers, the methods under "For the Dev Container" are preferred, along with the `gh auth login` step inside the container.

### C. Repository `GH_PAT` Secret

While many of this starter's pre-configured GitHub Actions workflows (like CI and Dependabot auto-merge) primarily use the standard, built-in `GITHUB_TOKEN` (which gets its permissions from repository settings and the workflow's `permissions:` block), setting a repository secret named `GH_PAT` (using a PAT you created) can be beneficial:

1.  **Enhanced Permissions for Specific Tools/Actions:** Some tools or actions, including Dependabot in certain scenarios (e.g., to bypass restrictive branch protections if `dependabot[bot]` isn't whitelisted, or if it needs to perform actions beyond what the standard `GITHUB_TOKEN` allows), might require or benefit from a PAT with specific scopes.
2.  **Custom Workflows:** If you add custom workflows to the project that are designed to use `secrets.GH_PAT` for authentication, this provides a consistent secret name.
3.  **User-Specific Identity for Automated Actions:** If you want automated actions performed by workflows (that are configured to use this secret) to be clearly attributed to a specific bot user identity associated with your PAT.

**To set this secret in your repository:**

1.  Go to your GitHub repository.
2.  Click "Settings" > "Secrets and variables" > "Actions".
3.  Click "New repository secret".
4.  **Name:** `GH_PAT`
5.  **Secret:** Paste the PAT you created in step A (ensure it has appropriate scopes like `repo`, `workflow`, `actions`).
6.  Click "Add secret".

**Note:** The primary execution permissions for the pre-configured workflows in this starter are managed via repository-level Action settings (see Section 2 below) and the `permissions:` key within each workflow file, which apply to the standard `GITHUB_TOKEN`.

## 2. GitHub Actions Workflow Permissions (Repository Settings)

For GitHub Actions workflows to operate correctly in your repository (especially those that modify content, create/merge PRs, like the pre-configured Dependabot auto-merge), your repository must grant them adequate permissions.

1.  Go to your GitHub repository.
2.  Click "Settings" > "Actions" > "General".
3.  Under "Workflow permissions":
    - **Recommended:** Select "Read and write permissions". This allows actions to create branches, commit code, create/merge PRs, etc., using the standard `GITHUB_TOKEN`.
    - Ensure "Allow GitHub Actions to create and approve pull requests" is checked if you want workflows (like Dependabot auto-merge or release drafters) to be able to do so.

These settings are crucial for the standard `GITHUB_TOKEN` used by workflows.

## 3. Dependabot Configuration (Review)

The `dependabot.yml` file in `.github/` is pre-configured in this starter to help keep your dependencies up to date.

- It targets the `dev` branch by default. Ensure this matches your primary development branch.
- For Dependabot (and its auto-merge workflow) to function correctly:
  - Repository Action permissions (Section 2) must be set to allow workflows to manage PRs and write content.
  - The `dependabot-auto.yml` workflow itself requests the necessary permissions for the `GITHUB_TOKEN`.
  - In some complex scenarios or with very strict branch protections, ensuring Dependabot operates with sufficient privilege might involve the `GH_PAT` repository secret (Section 1.C) or specific branch protection rule adjustments for `dependabot[bot]`.

Review `/.github/dependabot.yml` in your project and ensure its settings align with your branching strategy.

---

This guide provides the foundation for integrating your user identity and repository settings with GitHub's features. For more specific details on the pre-configured workflows or AI integration, please refer to:

- [`docs/github-cli-ai-setup.md`](./github-cli-ai-setup.md) (Details on AI assistant and GitHub CLI setup)
- [`docs/github-ci-workflows-setup.md`](./github-ci-workflows-setup.md) (Details on the CI and Dependabot workflows included in this starter)
