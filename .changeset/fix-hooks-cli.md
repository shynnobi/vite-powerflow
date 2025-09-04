---
'@vite-powerflow/create': patch
---

Improve development workflow and package metadata

- Remove automatic template sync from pre-commit hook to enable atomic commits
- Add consistent package metadata (author, repository, homepage, bugs)
- Update packageManager to pnpm@10.13.1
- Fix TypeScript module resolution with explicit .js extensions in barrel generation
