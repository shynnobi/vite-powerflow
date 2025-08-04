/**
 * Utilities for parsing changeset files frontmatter
 */

const CHANGESET_REGEX = /^---\s*\n([\s\S]*?)\n---/;

/**
 * Parses the frontmatter of a changeset file to extract package bumps.
 * @param content - The content of the changeset file.
 * @returns A map of package names to bump types (e.g., 'minor', 'patch').
 */
export function parseChangesetFrontmatter(
  content: string
): Map<string, 'minor' | 'patch' | 'major'> {
  const match = content.match(CHANGESET_REGEX);
  const frontmatter = new Map<string, 'minor' | 'patch' | 'major'>();

  if (match) {
    const frontmatterStr = match[1];
    frontmatterStr.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && trimmedLine.includes(':')) {
        const [pkg, bump] = trimmedLine
          .split(':')
          .map(s => s.trim().replace(/'/g, '').replace(/"/g, ''));
        if (pkg && (bump === 'minor' || bump === 'patch' || bump === 'major')) {
          frontmatter.set(pkg, bump);
        }
      }
    });
  }

  return frontmatter;
}
