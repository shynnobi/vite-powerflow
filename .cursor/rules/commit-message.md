# Commit Message Rules

## Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

## Rules

1. Header (first line):

   - Must be ≤ 72 characters
   - Format: `<type>(<scope>): <subject>`
   - No period at the end
   - Use imperative mood ("add" not "added")

2. Body:

   - Must be ≤ 100 characters per line
   - Each line must be a complete thought
   - Use `-m` flag for each line in git commit command
   - Be descriptive and provide context

3. Types:
   - build: Changes to build system
   - chore: Maintenance tasks
   - ci: CI configuration changes
   - docs: Documentation changes
   - feat: New features
   - fix: Bug fixes
   - perf: Performance improvements
   - refactor: Code refactoring
   - revert: Revert changes
   - style: Code style changes
   - test: Test changes

## Examples

✅ Good (descriptive while respecting limits):

```bash
git commit -m "feat(ui): add cursor-pointer to interactive elements" -m "Update Button component to provide visual feedback on hover" -m "Improve user experience by making interactive elements more obvious"
```

❌ Bad (exceeds character limits):

```bash
git commit -m "feat(ui): add cursor-pointer to all interactive buttons" -m "Update Button component to ensure pointer feedback for better UX. No visual regression, only improved user experience."
```
