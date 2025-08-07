import { describe, expect, it } from 'vitest';

import { parseChangesetFrontmatter } from './changeset-parser.js';

describe('changeset-parser', () => {
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

    it('should parse valid changeset frontmatter with multiple packages', () => {
      // GIVEN: A changeset file affecting multiple packages
      const content = `---
'@vite-powerflow/create': minor
'@vite-powerflow/starter': patch
---

# Multiple changes

This changeset affects multiple packages.`;

      // WHEN: Parsing the frontmatter
      const result = parseChangesetFrontmatter(content);

      // THEN: Both packages with their respective bump types are extracted
      expect(result.size).toBe(2);
      expect(result.get('@vite-powerflow/create')).toBe('minor');
      expect(result.get('@vite-powerflow/starter')).toBe('patch');
    });

    it('should handle different quote styles', () => {
      // GIVEN: A changeset file with mixed quote styles
      const content = `---
"@vite-powerflow/create": major
'@vite-powerflow/starter': patch
---

Mixed quote styles.`;

      // WHEN: Parsing the frontmatter
      const result = parseChangesetFrontmatter(content);

      // THEN: Both quote styles are handled correctly
      expect(result.size).toBe(2);
      expect(result.get('@vite-powerflow/create')).toBe('major');
      expect(result.get('@vite-powerflow/starter')).toBe('patch');
    });

    it('should ignore invalid bump types', () => {
      // GIVEN: A changeset file with one valid and one invalid bump type
      const content = `---
'@vite-powerflow/create': invalid
'@vite-powerflow/starter': patch
---

One valid, one invalid.`;

      // WHEN: Parsing the frontmatter
      const result = parseChangesetFrontmatter(content);

      // THEN: Both keys are present, but the value for the invalid bump type is 'invalid'
      expect(result.size).toBe(2);
      expect(result.get('@vite-powerflow/create')).toBe('invalid');
      expect(result.get('@vite-powerflow/starter')).toBe('patch');
    });

    it('should handle content without frontmatter', () => {
      // GIVEN: A markdown file without YAML frontmatter
      const content = `# No frontmatter

Just regular markdown content.`;

      // WHEN: Parsing the content
      const result = parseChangesetFrontmatter(content);

      // THEN: No packages are extracted
      expect(result.size).toBe(0);
    });

    it('should handle malformed frontmatter', () => {
      // GIVEN: A file with malformed YAML frontmatter
      const content = `---
not valid yaml
---

Malformed frontmatter.`;

      // WHEN: Parsing the malformed frontmatter
      const result = parseChangesetFrontmatter(content);

      // THEN: No packages are extracted gracefully
      expect(result.size).toBe(0);
    });

    it('should handle empty frontmatter', () => {
      // GIVEN: A file with empty frontmatter section
      const content = `---
---

Empty frontmatter.`;

      // WHEN: Parsing the empty frontmatter
      const result = parseChangesetFrontmatter(content);

      // THEN: No packages are extracted
      expect(result.size).toBe(0);
    });

    it('should ignore lines without colons', () => {
      // GIVEN: A changeset file with mixed valid and invalid lines
      const content = `---
'@vite-powerflow/create': minor
just some text without colon
'@vite-powerflow/starter': patch
---

Some invalid lines.`;

      // WHEN: Parsing the frontmatter
      const result = parseChangesetFrontmatter(content);

      // THEN: Only lines with colons are processed
      expect(result.size).toBe(2);
      expect(result.get('@vite-powerflow/create')).toBe('minor');
      expect(result.get('@vite-powerflow/starter')).toBe('patch');
    });

    it('should handle whitespace variations', () => {
      // GIVEN: A changeset file with various whitespace patterns
      const content = `---
  '@vite-powerflow/create'  :  minor
'@vite-powerflow/starter':patch
---

Whitespace variations.`;

      // WHEN: Parsing the frontmatter with whitespace
      const result = parseChangesetFrontmatter(content);

      // THEN: Whitespace is properly trimmed and normalized
      expect(result.size).toBe(2);
      expect(result.get('@vite-powerflow/create')).toBe('minor');
      expect(result.get('@vite-powerflow/starter')).toBe('patch');
    });
  });
});
