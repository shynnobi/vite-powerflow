/**
 * Utilities for parsing changeset files frontmatter
 */

const CHANGESET_REGEX = /^---\s*\n([\s\S]*?)\n---/;

/**
 * Parses the frontmatter of a changeset file to extract package bumps and metadata.
 * @param content - The content of the changeset file.
 * @returns A map of package names to bump types and metadata fields.
 */
export function parseChangesetFrontmatter(content: string): Map<string, string> {
  const match = content.match(CHANGESET_REGEX);
  const frontmatter = new Map<string, string>();

  if (match) {
    const frontmatterStr = match[1];
    frontmatterStr.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && trimmedLine.includes(':')) {
        const colonIndex = trimmedLine.indexOf(':');
        const key = trimmedLine.substring(0, colonIndex).trim().replace(/'/g, '').replace(/"/g, '');
        const value = trimmedLine
          .substring(colonIndex + 1)
          .trim()
          .replace(/'/g, '')
          .replace(/"/g, '');
        if (key && value) {
          frontmatter.set(key, value);
        }
      }
    });
  }

  return frontmatter;
}
