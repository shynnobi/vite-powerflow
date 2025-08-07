import { describe, expect, it } from 'vitest';

import { parseChangesetFrontmatter } from './changesetFrontmatter.js';

describe('changesetFrontmatter', () => {
  describe('parseChangesetFrontmatter', () => {
    it('should parse valid changeset frontmatter with single package', () => {
      // GIVEN: A changeset file with single package frontmatter
      const content = `---
'@vite-powerflow/create': minor
---

# Some changes

This is a test changeset.`;

      // WHEN: Parsing the frontmatter
      const result = parseChangesetFrontmatter(content);

      // THEN: Single package with correct bump type is extracted
      expect(result.size).toBe(1);
      expect(result.get('@vite-powerflow/create')).toBe('minor');
    });
    // ...existing code...
  });
});
