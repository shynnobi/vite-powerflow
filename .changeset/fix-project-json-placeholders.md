---
'@vite-powerflow/create': patch
---

anchor: 6d8c966eb774f0cfb0174b593c83a7e0a974061b

<<<<<<< HEAD

# <<<<<<< HEAD

> > > > > > > # 2beae03a (chore: remove nx-optimization.patch reference file)
> > > > > > >
> > > > > > > 8294268f (feat(turbo): optimize cache configuration for monorepo tests)

fix: replace project name placeholders in project.json

- Add step 9 to replace @vite-powerflow/starter with {{projectName}} in project.json
- Replace buildTarget references with correct project name
- Update step numbering for consistency
- Ensures generated projects have correct Nx project configuration

This fix ensures that when users create new projects with the CLI, the generated project.json file will have the correct project name instead of the hardcoded @vite-powerflow/starter references.
