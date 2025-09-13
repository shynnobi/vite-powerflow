---
'vite-powerflow-sync': patch
---

anchor: d7fe39cb30c9371bfa2fb3f8e8e65393863a2f13

Fix critical sync monitoring and release commit detection bugs

- Fix lastReleaseCommitSha detection by searching in unfiltered commit history
- Use findIndex instead of findLastIndex to get first release commit (published version)
- Remove variable redeclaration that was overwriting lastReleaseCommitSha with undefined
- Update extension baseline from extensionBaseline to syncBaseline with latest release commit
- Add backward compatibility fallback for legacy extensionBaseline field
- Add comprehensive debug logging for release commit detection flow
- Ensure Utils package displays (npm) + release commit in status report

Resolves critical issues where packages showed incorrect warning status despite being properly synced.
