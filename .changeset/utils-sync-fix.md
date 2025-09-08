---
'@vite-powerflow/utils': patch
---

fix(sync): correct Utils package release commit detection and display

- Fix lastReleaseCommitSha detection by searching in unfiltered commit history
- Use findIndex instead of findLastIndex to get first release commit (published version)
- Remove variable redeclaration that was overwriting lastReleaseCommitSha with undefined
- Ensure Utils package displays (npm) + release commit in status report

Resolves issue where Utils package showed warning status despite being
synchronized with NPM published version. The release commit e2bdf2c4 was
found but not properly assigned due to variable scope issues in syncEngine.
