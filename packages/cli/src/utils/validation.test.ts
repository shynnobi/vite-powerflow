import { describe, expect, it } from 'vitest';

import { validateProjectName } from './validation.js';

describe('validateProjectName', () => {
  it('should require a name', () => {
    expect(validateProjectName('')).toBe('Project name is required');
  });

  it('should only allow lowercase letters, numbers, and hyphens', () => {
    expect(validateProjectName('MyProject')).toBe('Project name can only contain lowercase letters, numbers, and hyphens');
    expect(validateProjectName('my_project')).toBe('Project name can only contain lowercase letters, numbers, and hyphens');
  });

  it('should require at least 3 characters', () => {
    expect(validateProjectName('ab')).toBe('Project name must be at least 3 characters long');
  });

  it('should require less than 214 characters', () => {
    expect(validateProjectName('a'.repeat(215))).toBe('Project name must be less than 214 characters');
  });

  it('should return true for valid names', () => {
    expect(validateProjectName('my-project')).toBe(true);
    expect(validateProjectName('abc')).toBe(true);
  });
});
