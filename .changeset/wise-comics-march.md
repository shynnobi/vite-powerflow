---
'@vite-powerflow/create': patch
---

fix: ensure .vscode and postinstall.sh are always included and executable in published package

- Explicitly include `dist/template/vscode` in the npm package to guarantee VSCode settings are available in generated projects.
- Force executable permissions on `scripts/postinstall.sh` in the build output to prevent permission errors on install.
- This makes the CLI/starter robust and portable across all platforms and npm workflows.
