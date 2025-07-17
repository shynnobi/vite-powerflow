import { describe, expect, it } from 'vitest';

import { safePackageName } from './safe-package-name.js';

describe('safePackageName', () => {
  it('should lowercase and replace spaces with hyphens', () => {
    expect(safePackageName('My Project')).toBe('my-project');
  });

  it('should remove invalid characters', () => {
    // @ and ! are removed, but the result is hyphenated
    expect(safePackageName('My@Project!')).toBe('my-project');
  });

  it('should trim leading/trailing special chars and replace with hyphens', () => {
    // Dots and leading/trailing dashes are replaced by hyphens
    expect(safePackageName('---my.project---')).toBe('my-project');
  });

  it('should replace dots and underscores with hyphens', () => {
    expect(safePackageName('my_project.name')).toBe('my-project-name');
  });
});
