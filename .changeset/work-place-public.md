---
'vite-powerflow-sync': patch
---

fix(changeset): add 'none' bump type to Changeset interface

- Add 'none' as a valid bumpType in Changeset interface
- Update changesetReader to handle none bumpType
- Fixes Utils package sync status detection for manually published packages
