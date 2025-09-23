---
'@vite-powerflow/create': patch
---

anchor: 8f909d68931f234610062716a08409aa0ae2d1b5

<<<<<<< HEAD

<<<<<<< HEAD

<<<<<<< HEAD

# <<<<<<< HEAD

> > > > > > > # 2beae03a (chore: remove nx-optimization.patch reference file)
> > > > > > >
> > > > > > > # 8294268f (feat(turbo): optimize cache configuration for monorepo tests)
> > > > > > >
> > > > > > > # c37801c6 (refactor: move type definitions to dedicated types directory)
> > > > > > >
> > > > > > > 6cc2019e (fix: update vite.config.ts import path for pwa types)

fix: replace project name placeholders in project.json

- Add step 9 to replace @vite-powerflow/starter with {{projectName}} in project.json
- Replace buildTarget references with correct project name
- Update step numbering for consistency
- Ensures generated projects have correct Nx project configuration

This fix ensures that when users create new projects with the CLI, the generated project.json file will have the correct project name instead of the hardcoded @vite-powerflow/starter references.
