---
'@vite-powerflow/create': minor
---

anchor: 9fd8accb46956767740e1245986d745f7f56df1c

Hardens the project scaffolding process. The CLI now dynamically replaces internal `workspace:*` dependencies with their correct local package versions in the generated `package.json`. This crucial change ensures that new projects are immediately installable and functional outside the monorepo, fixing `pnpm install` failures.
