---
'@vite-powerflow/create': minor
---

anchor: ff31d6b94e5fd182f41540fbfdbb355b2545a914

Hardens the project scaffolding process. The CLI now dynamically replaces internal `workspace:*` dependencies with their correct local package versions in the generated `package.json`. This crucial change ensures that new projects are immediately installable and functional outside the monorepo, fixing `pnpm install` failures.
