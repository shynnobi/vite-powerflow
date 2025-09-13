---
'@vite-powerflow/create': patch
'@vite-powerflow/starter': patch
---

baseline: d0de5cc8c98fc878c41bc9cd8e37244d66793de3

Fix desync between starter and npm template

The starter package (v1.2.7) and the published CLI template (v1.1.0) are out of sync. This changeset will:

- Sync the latest starter code to the CLI template
- Update the template baseline commit metadata
- Publish the updated CLI package to npm

This ensures users get the latest starter improvements when using `create-vite-powerflow`.
