# 🔧 VSCode Extension Refactoring Plan

## 📋 Overview

Major restructuring of the VSCode Starter Sync extension to improve:

- **File naming consistency** (explicit names matching content)
- **Flat structure** (avoid deep nesting)
- **Function naming coherence** (verbs aligned with file purpose)
- **Clean Code principles** (single responsibility, discoverability)

## 🎯 Goals

1. **Explicit file names** that immediately indicate content
2. **Flat structure** in `src/core/` for better navigation
3. **Coherent function names** with consistent verb patterns
4. **Logical grouping** by domain responsibility

---

## 📊 Current Structure Analysis

### Current Files & Functions:

```
src/core/
├── changesetFrontmatter.ts          # parseChangesetFrontmatter()
├── formatBaseline.ts                # formatBaseline()
├── monorepoUtils.ts                 # getWorkspaceRoot()
├── packageUtils.ts                  # getPackageInfo(), getLatestNpmVersion()
├── syncReportFormatter.ts           # formatSyncOutput(), formatBaselineLog(), handleInSync(), handleUnreleasedCommits()
├── syncTypes.ts                     # Types definitions
└── sync/
    ├── changesetUtils.ts            # getChangesetStatus(), getLatestChangesetForPackage()
    ├── gitUtils.ts                  # getCurrentCommit(), getCommitsSince(), resolveRefToSha(), getTemplateBaselineCommit()
    ├── syncErrorHandler.ts          # handleError()
    └── syncStatusChecker.ts         # getSyncStatus(), checkStarterStatus(), checkCliStatus()
```

### Issues Identified:

- ❌ **Inconsistent naming**: `Utils` vs explicit names
- ❌ **Split responsibilities**: Changeset functions in 2 different files
- ❌ **Deep nesting**: `sync/` subfolder when core/ could be flat
- ❌ **Mixed responsibilities**: `syncReportFormatter.ts` has both format AND handle functions
- ❌ **Inconsistent verbs**: `get*()`, `check*()`, `handle*()` mixed randomly

---

## 🎯 Target Structure

### New File Structure:

```
src/core/
├── changesetParser.ts               # parseChangesetFrontmatter()
├── changesetReader.ts               # readChangesetStatus(), readLatestChangeset()
├── gitCommands.ts                   # getCurrentCommit(), getCommitsSince(), getFilesChangedSince()
├── gitStatus.ts                     # resolveRefToSha(), getTemplateBaseline()
├── packageReader.ts                 # readPackageInfo(), readLatestNpmVersion()
├── workspaceDetector.ts             # detectWorkspaceRoot()
├── syncChecker.ts                   # checkSyncStatus(), checkStarterSync(), checkCliSync()
├── syncReporter.ts                  # formatSyncOutput(), formatPackageStatus(), formatBaselineLog()
├── syncHandler.ts                   # handleSyncResult(), handleInSync(), handleUnreleasedCommits()
├── errorHandler.ts                  # handleSyncError()
├── baselineFormatter.ts             # formatBaseline()
└── types.ts                         # All type definitions
```

### Verb Patterns by File Type:

- **Parser files**: `parse*()`
- **Reader files**: `read*()`
- **Detector files**: `detect*()`
- **Checker files**: `check*()`
- **Formatter files**: `format*()`
- **Handler files**: `handle*()`

---

## 🚚 Migration Steps

### Phase 1: Structural Reorganization

#### Step 1.1: Flatten sync/ directory

```bash
# Move all files from sync/ to core/ with new names
mv src/core/sync/changesetUtils.ts → src/core/changesetReader.ts
mv src/core/sync/gitUtils.ts → [SPLIT] → src/core/gitCommands.ts + src/core/gitStatus.ts
mv src/core/sync/syncErrorHandler.ts → src/core/errorHandler.ts
mv src/core/sync/syncStatusChecker.ts → src/core/syncChecker.ts
# Remove empty sync/ directory
```

#### Step 1.2: Rename existing files

```bash
mv src/core/changesetFrontmatter.ts → src/core/changesetParser.ts
mv src/core/formatBaseline.ts → src/core/baselineFormatter.ts
mv src/core/monorepoUtils.ts → src/core/workspaceDetector.ts
mv src/core/packageUtils.ts → src/core/packageReader.ts
mv src/core/syncReportFormatter.ts → src/core/syncReporter.ts
mv src/core/syncTypes.ts → src/core/types.ts
```

### Phase 2: Function Splitting & Content Reorganization

#### Step 2.1: Split gitUtils.ts

**Current gitUtils.ts functions:**

- `getCurrentCommit()` → gitCommands.ts
- `getCommitsSince()` → gitCommands.ts
- `getFilesChangedSince()` → gitCommands.ts
- `resolveRefToSha()` → gitStatus.ts
- `getTemplateBaselineCommit()` → gitStatus.ts (rename to `getTemplateBaseline()`)

#### Step 2.2: Split syncReportFormatter.ts

**Current syncReportFormatter.ts functions:**

- `formatSyncOutput()` → syncReporter.ts ✅
- `formatPackageStatus()` → syncReporter.ts ✅
- `formatBaselineLog()` → syncReporter.ts ✅
- `formatGlobalStatus()` → syncReporter.ts ✅
- `handleInSync()` → syncHandler.ts ❗ (new file)
- `handleUnreleasedCommits()` → syncHandler.ts ❗ (new file)

#### Step 2.3: Merge changeset functions

**Merge changesetFrontmatter.ts + changesetUtils.ts:**

- `parseChangesetFrontmatter()` → changesetParser.ts
- `getChangesetStatus()` → changesetReader.ts (rename to `readChangesetStatus()`)
- `getLatestChangesetForPackage()` → changesetReader.ts (rename to `readLatestChangeset()`)

### Phase 3: Function Renaming for Consistency

#### Step 3.1: Reader functions (read\* pattern)

```typescript
// packageReader.ts
getPackageInfo() → readPackageInfo()
getLatestNpmVersion() → readLatestNpmVersion()

// changesetReader.ts
getChangesetStatus() → readChangesetStatus()
getLatestChangesetForPackage() → readLatestChangeset()
```

#### Step 3.2: Detector functions (detect\* pattern)

```typescript
// workspaceDetector.ts
getWorkspaceRoot() → detectWorkspaceRoot()
```

#### Step 3.3: Checker functions (check\* pattern)

```typescript
// syncChecker.ts
getSyncStatus() → checkSyncStatus()
checkStarterStatus() → checkStarterSync()
checkCliStatus() → checkCliSync()
```

#### Step 3.4: Handler functions (handle\* pattern)

```typescript
// errorHandler.ts
handleError() → handleSyncError()

// syncHandler.ts (new file)
handleInSync() → handleSyncResult() [or keep as is]
handleUnreleasedCommits() → handleUnreleasedCommits() [keep as is]
```

### Phase 4: Import Updates

#### Step 4.1: Update all imports in core files

- Update relative imports between core files
- Ensure all new file names are referenced correctly

#### Step 4.2: Update imports in other directories

- `src/extension.ts`
- `src/ui/*.ts`
- `src/utils/*.ts`

#### Step 4.3: Update imports in test files

- Update all `*.test.ts` files to reference new file names
- Update test file names to match new structure

---

## 📁 Detailed File Mapping

### File Transformations:

| Current File                | New File(s)                          | Functions Moved                                          | Renamed Functions                                                                                                             |
| --------------------------- | ------------------------------------ | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `changesetFrontmatter.ts`   | `changesetParser.ts`                 | `parseChangesetFrontmatter()`                            | No change                                                                                                                     |
| `sync/changesetUtils.ts`    | `changesetReader.ts`                 | `getChangesetStatus()`, `getLatestChangesetForPackage()` | → `readChangesetStatus()`, `readLatestChangeset()`                                                                            |
| `sync/gitUtils.ts`          | `gitCommands.ts` + `gitStatus.ts`    | Split by function type                                   | `getTemplateBaselineCommit()` → `getTemplateBaseline()`                                                                       |
| `packageUtils.ts`           | `packageReader.ts`                   | All functions                                            | `getPackageInfo()` → `readPackageInfo()`, `getLatestNpmVersion()` → `readLatestNpmVersion()`                                  |
| `monorepoUtils.ts`          | `workspaceDetector.ts`               | `getWorkspaceRoot()`                                     | → `detectWorkspaceRoot()`                                                                                                     |
| `sync/syncStatusChecker.ts` | `syncChecker.ts`                     | All functions                                            | `getSyncStatus()` → `checkSyncStatus()`, `checkStarterStatus()` → `checkStarterSync()`, `checkCliStatus()` → `checkCliSync()` |
| `syncReportFormatter.ts`    | `syncReporter.ts` + `syncHandler.ts` | Split format vs handle functions                         | No renames needed                                                                                                             |
| `sync/syncErrorHandler.ts`  | `errorHandler.ts`                    | `handleError()`                                          | → `handleSyncError()`                                                                                                         |
| `formatBaseline.ts`         | `baselineFormatter.ts`               | `formatBaseline()`                                       | No change                                                                                                                     |
| `syncTypes.ts`              | `types.ts`                           | All types                                                | No change                                                                                                                     |

---

## ✅ Testing Strategy

### Phase 1: Structural Testing

1. **Compile check**: Ensure TypeScript compiles after each file move
2. **Import verification**: Verify all imports resolve correctly
3. **Test execution**: Run existing tests after import updates

### Phase 2: Functional Testing

1. **Unit tests**: Update and run all unit tests
2. **Integration tests**: Verify extension functionality
3. **Manual testing**: Test extension in VS Code

### Phase 3: Validation

1. **Code review**: Review final structure
2. **Documentation**: Update README/docs if needed
3. **Performance check**: Ensure no performance regression

---

## 🎯 Success Criteria

### Must Have:

- ✅ All TypeScript compilation errors resolved
- ✅ All tests passing
- ✅ Extension loads and functions correctly in VS Code
- ✅ No runtime errors

### Nice to Have:

- ✅ Improved development experience (easier to find functions)
- ✅ Better code discoverability
- ✅ Consistent naming patterns throughout codebase
- ✅ Flat, navigable structure

---

## 🚨 Risk Mitigation

### Backup Strategy:

- Work on feature branch (`refactor/clean-structure`)
- Commit after each major phase
- Keep detailed migration log

### Rollback Plan:

- If major issues encountered, revert to current structure
- Identify specific problem areas and address incrementally

### Dependencies:

- No external dependencies affected
- Only internal imports need updating
- Tests may need updates but logic remains same

---

## 📝 Implementation Notes

### Order of Operations:

1. **File moves first** (preserve git history)
2. **Content splits/merges second**
3. **Function renames last**
4. **Import updates throughout**

### Git Strategy:

```bash
# Use git mv to preserve history
git mv oldfile.ts newfile.ts
# Commit file moves separately from content changes
git commit -m "refactor: move and rename files for better structure"
# Then modify content and commit separately
git commit -m "refactor: split functions and rename for consistency"
```

### Testing Frequency:

- Test compilation after every few file moves
- Run full test suite after each phase
- Manual extension testing after major changes

---

_This plan serves as the single source of truth for the refactoring effort. Update this document as progress is made and requirements evolve._
