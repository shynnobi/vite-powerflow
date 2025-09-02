---
'@vite-powerflow/create': minor
---

anchor: 94a482f1de9ba500d119c5fc4143f37de38fe26a

Hardens the project scaffolding process. The CLI now dynamically replaces internal `workspace:*` dependencies with their correct local package versions in the generated `package.json`. This crucial change ensures that new projects are immediately installable and functional outside the monorepo, fixing `pnpm install` failures.
