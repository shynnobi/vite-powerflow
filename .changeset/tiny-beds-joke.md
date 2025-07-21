---
'@vite-powerflow/create': patch
---

fix: ensure VSCode settings are always included in generated projects

- Rename .vscode to \_vscode in the template for npm compatibility
- Explicitly include \_vscode in the npm package to guarantee VSCode settings are available
- CLI now renames \_vscode to .vscode in generated projects
- This makes the CLI/starter robust and portable across all npm workflows
