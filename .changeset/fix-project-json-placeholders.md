---
'@vite-powerflow/create': patch
---

anchor: 6cdb4a17c5922ba8cb2fb2ba271e462434143f9d

fix: replace project name placeholders in project.json

- Add step 9 to replace @vite-powerflow/starter with {{projectName}} in project.json
- Replace buildTarget references with correct project name
- Update step numbering for consistency
- Ensures generated projects have correct Nx project configuration

This fix ensures that when users create new projects with the CLI, the generated project.json file will have the correct project name instead of the hardcoded @vite-powerflow/starter references.
