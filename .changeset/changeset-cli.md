---
'@vite-powerflow/create': minor
---

anchor: 1a64a177836277f911f022184f75cba8c2c6bf8f

Hardens the project scaffolding process. The CLI now dynamically replaces internal `workspace:*` dependencies with their correct local package versions in the generated `package.json`. This crucial change ensures that new projects are immediately installable and functional outside the monorepo, fixing `pnpm install` failures.
