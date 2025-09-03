---
'@vite-powerflow/create': minor
---

anchor: 7d69425a46218daa0a5b5d86b38fde6a67390ec3

Hardens the project scaffolding process. The CLI now dynamically replaces internal `workspace:*` dependencies with their correct local package versions in the generated `package.json`. This crucial change ensures that new projects are immediately installable and functional outside the monorepo, fixing `pnpm install` failures.
