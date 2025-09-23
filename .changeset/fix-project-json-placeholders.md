---
'@vite-powerflow/create': patch
---

anchor: 050c6abd8f8b81e05a99fe4e075133375a4e829e

fix: replace project name placeholders in project.json

- Add step 9 to replace @vite-powerflow/starter with {{projectName}} in project.json
- Replace buildTarget references with correct project name
- Update step numbering for consistency
- Ensures generated projects have correct Nx project configuration

This fix ensures that when users create new projects with the CLI, the generated project.json file will have the correct project name instead of the hardcoded @vite-powerflow/starter references.
