---
'vite-powerflow-sync': patch
---

fix(extension): update baseline resolution and improve sync monitoring

- Update extension baseline from extensionBaseline to syncBaseline with latest release commit
- Add backward compatibility fallback for legacy extensionBaseline field
- Fix extension:install script to use correct .vsix version (0.0.3)
- Remove debug logs from syncEngine for production readiness
- Improve sync status reporting accuracy

The extension now properly tracks its own sync status using the unified
syncBaseline approach, ensuring consistent monitoring across all packages.
