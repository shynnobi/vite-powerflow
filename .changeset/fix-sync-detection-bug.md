---
'vite-powerflow-sync': patch
---

anchor: ab8b7e14ab57563194858f795fb4f593fa068b89

Fix sync detection logic and improve extension packaging

- Fix anchor determination using findLastIndex instead of findIndex in syncEngine
- Add comprehensive documentation for 9-phase analysis process
- Improve unreleased commits detection accuracy
- Enhance baseline/anchor relationship clarity
- Fix edge cases in release commit identification
- Fix VSIX filename to use fixed name instead of versioned
- Create robust install-extension.ts script with error handling
- Add file validation and corruption detection
- Improve extension installation feedback and logging
