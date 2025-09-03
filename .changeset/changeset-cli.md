---
'@vite-powerflow/create': minor
---

anchor: 898125a4aadd3baeeab70d8ed4a08f0446677b64

Hardens the project scaffolding process. The CLI now dynamically replaces internal `workspace:*` dependencies with their correct local package versions in the generated `package.json`. This crucial change ensures that new projects are immediately installable and functional outside the monorepo, fixing `pnpm install` failures.
