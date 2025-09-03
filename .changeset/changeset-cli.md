---
'@vite-powerflow/create': minor
---

anchor: 824a0a4f503086755859cf04c86534fc44e93723

Hardens the project scaffolding process. The CLI now dynamically replaces internal `workspace:*` dependencies with their correct local package versions in the generated `package.json`. This crucial change ensures that new projects are immediately installable and functional outside the monorepo, fixing `pnpm install` failures.
