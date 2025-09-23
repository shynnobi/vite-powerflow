---
'@vite-powerflow/create': patch
---

anchor: 6ec80d1baf0f2acf53a7dc5698f0df8f6f46604c

fix: replace project name placeholders in project.json

- Add step 9 to replace @vite-powerflow/starter with {{projectName}} in project.json
- Replace buildTarget references with correct project name
- Update step numbering for consistency
- Ensures generated projects have correct Nx project configuration

This fix ensures that when users create new projects with the CLI, the generated project.json file will have the correct project name instead of the hardcoded @vite-powerflow/starter references.
