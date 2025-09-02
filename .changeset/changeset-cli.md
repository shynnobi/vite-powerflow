---
'@vite-powerflow/create': minor
---

anchor: cf3d4b625615ddad099aa2a64fa5a4024c497c15

Hardens the project scaffolding process. The CLI now dynamically replaces internal `workspace:*` dependencies with their correct local package versions in the generated `package.json`. This crucial change ensures that new projects are immediately installable and functional outside the monorepo, fixing `pnpm install` failures.
