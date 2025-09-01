---
'@vite-powerflow/create': minor
---

anchor: 4e1832191d83433fcf15c30026a18d5e915aa627

Hardens the project scaffolding process. The CLI now dynamically replaces internal `workspace:*` dependencies with their correct local package versions in the generated `package.json`. This crucial change ensures that new projects are immediately installable and functional outside the monorepo, fixing `pnpm install` failures.
