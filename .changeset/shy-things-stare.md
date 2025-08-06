---
'@vite-powerflow/create': minor
anchor: ff318853ee15d9aa1b99d71bf8ab48fa387c9dba
---

### Improvements

- **Enhanced Template Version Tracking**: To improve internal maintenance, the CLI now temporarily uses `starterSource` metadata to track the template version during project creation. This metadata is automatically removed from the final `package.json`, ensuring a clean and streamlined project for end-users.

### Internal Changes

- Updated end-to-end tests to use the correct `vite-powerflow-create` binary name, improving test reliability.
