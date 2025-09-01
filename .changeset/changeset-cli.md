---
'@vite-powerflow/create': minor
---

anchor: ad81146eadd03fd62d060b2b57912fad570e4fdb

Hardens the project scaffolding process. The CLI now dynamically replaces internal `workspace:*` dependencies with their correct local package versions in the generated `package.json`. This crucial change ensures that new projects are immediately installable and functional outside the monorepo, fixing `pnpm install` failures.
