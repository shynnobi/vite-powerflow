---
'@vite-powerflow/create': patch
---

- Refactor CLI build and create logic for robust \_vscode to .vscode handling and cleanup
- Enforce .vscode folder presence in CLI template during build
- Remove unused starterSource.version from scripts, types, and template package.json
- Add \_vscode/settings.json and \_vscode/tailwind.json to CLI template
- Update syncChecker, syncReporter, and types for new metadata structure
- Improves release workflow clarity and maintainability
