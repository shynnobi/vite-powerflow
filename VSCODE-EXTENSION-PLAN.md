# 🎯 Action Plan - VS Code Extension Sync Status

## 📊 Current Situation Analysis

### **Identified Problem:**

- **CLI v1.0.5** published on npm **WITHOUT `starterSource` metadata**
- **CLI Template** lacks the baseline to detect desyncs
- **VS Code Extension** cannot function properly without this baseline

### **Current Versions:**

- **npm published:** `@vite-powerflow/create@1.0.5` (commit: `668ab2e8`)
- **CLI version:** `1.0.5`
- **Starter version:** `1.0.0` (at the time of publication)
- **Template:** Exists but **without `starterSource`**

## 🚀 Detailed Action Plan

### **Phase 1: CLI Template Baseline Commit Fix (Urgent)**

#### **Step 1.1: Create fix branch**

```bash
# Start from clean dev/main
git checkout dev
git stash  # if necessary
git checkout -b fix/add-starter-source-baseline
```

#### **Step 1.2: Add starterSource to the template**

**File:** `packages/cli/template/package.json`

```json
"starterSource": {
  "version": "1.0.0",
  "commit": "668ab2e8f19ec5a066bfdba3e5f2713f29078ff5",
  "syncedAt": "2025-07-22T11:58:55.000Z"
}
```

#### **Step 1.3: Create changeset**

```bash
pnpm changeset
# Select: @vite-powerflow/create
# Type: patch
# Message: "fix(cli): add starterSource baseline metadata to template"
```

#### **Step 1.4: Commit and PR**

```bash
git add .
git commit -m "fix(cli): add starterSource baseline metadata to CLI template"
git push origin fix/add-starter-source-baseline
# Create PR to main
```

#### **Step 1.5: Merge and publish**

- Merge PR into main
- Changeset auto-generates PR "Version Packages"
- Merge → CLI v1.0.6 published with CLI template baseline commit

### **Phase 2: VS Code Extension (In Parallel)**

#### **Step 2.1: Finalize extension**

- Branch: `feat/vscode-starter-sync` (current)
- Improved detection logic (already done)
- Enhanced webview interface (already done)

#### **Step 2.2: Testing and validation**

```bash
# Test the extension with the new baseline
pnpm extension:deploy
# Verify the 3 states: sync, changeset needed, CLI sync needed
```

#### **Step 2.3: Documentation**

- Update extension README
- Document the complete workflow

### **Phase 3: Integrated Workflow**

#### **Step 3.1: Monorepo scripts**

- `pnpm sync:starter-to-template` (already done)
- `pnpm extension:deploy` (already done)

#### **Step 3.2: CI/CD Integration**

- Consider auto-deploying the extension
- Git hooks for automation

## 🔍 Final Detection Logic

### **3 Possible States:**

1. **🟢 SYNC:** `currentCommit === templateCommit`
2. **🟡 CLI_SYNC_NEEDED:** `starterVersion !== templateVersion`
3. **🔴 CHANGESET_NEEDED:** `currentCommit !== templateCommit && starterVersion === templateVersion`

### **Desync Triggers:**

- Direct modification of the starter → CHANGESET_NEEDED
- Applying a changeset → CLI_SYNC_NEEDED
- Syncing the template → SYNC

## 📋 Checklist

### **Phase 1 - Baseline (Priority 1)**

- [ ] Create branch `fix/add-starter-source-baseline`
- [ ] Add `starterSource` to the CLI template
- [ ] Create patch changeset
- [ ] PR and merge into main
- [ ] Publish CLI v1.0.6 with baseline

### **Phase 2 - Extension (Priority 2)**

- [x] Detection logic for 3 states
- [x] Enhanced webview interface
- [x] Formatted notifications
- [ ] Test with correct baseline
- [ ] Final documentation

### **Phase 3 - Integration (Priority 3)**

- [ ] Workflow documentation
- [ ] CI/CD integration
- [ ] Auto-deployment of the extension

## 🎯 Next Action

**IMMEDIATE:** Execute Phase 1 to fix the missing baseline in the published CLI.

---

_File created on: 2025-07-29_
_Last updated: 2025-07-29_
