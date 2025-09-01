---
'@vite-powerflow/create': minor
---

anchor: 5835b769f3e875816fcc1ce078e9a4b56db501a7

Hardens the project scaffolding process. The CLI now dynamically replaces internal `workspace:*` dependencies with their correct local package versions in the generated `package.json`. This crucial change ensures that new projects are immediately installable and functional outside the monorepo, fixing `pnpm install` failures.
