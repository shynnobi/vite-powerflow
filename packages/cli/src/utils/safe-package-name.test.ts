import { describe, expect, it } from 'vitest';

import { safePackageName } from './safe-package-name.js';

describe('safePackageName', () => {
  it('should lowercase and replace spaces with hyphens', () => {
    expect(safePackageName('My Project')).toBe('my-project');
  });

  it('should remove invalid characters', () => {
    expect(safePackageName('My@Project!')).toBe('myproject');
  });

  it('should trim leading/trailing special chars', () => {
    expect(safePackageName('---my.project---')).toBe('my.project');
  });

  it('should allow dots and underscores', () => {
    expect(safePackageName('my_project.name')).toBe('my_project.name');
  });
});
