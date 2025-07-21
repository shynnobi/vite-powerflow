---
'@vite-powerflow/create': patch
---

fix(cli): Fix template packaging and add missing files

- Move fs-extra to dependencies to fix runtime crash
- Fix template path to use dist/template instead of source
- Add .gitignore and .vscode to template (renamed to avoid npm ignore)
- Update bin name to vite-powerflow-create to avoid conflicts
- Clean up package.json files field
- Simplify .npmignore configuration
