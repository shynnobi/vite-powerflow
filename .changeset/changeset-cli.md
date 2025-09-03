---
'@vite-powerflow/create': minor
---

anchor: 26c906b456c8517d4339fdd7dd7ff0068b51810b

Hardens the project scaffolding process. The CLI now dynamically replaces internal `workspace:*` dependencies with their correct local package versions in the generated `package.json`. This crucial change ensures that new projects are immediately installable and functional outside the monorepo, fixing `pnpm install` failures.
