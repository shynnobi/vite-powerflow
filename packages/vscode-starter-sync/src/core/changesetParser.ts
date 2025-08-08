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
  const match = CHANGESET_REGEX.exec(content);
  const frontmatter = new Map<string, string>();

  if (match?.[1]) {
    const frontmatterStr = match[1];
    frontmatterStr.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.includes(':')) {
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

/**
 * Extracts anchor and baseline metadata placed immediately after the frontmatter.
 * @param content - The content of the changeset file.
 * @returns An object containing anchor and baseline if found.
 */
export function extractMetadataAfterFrontmatter(content: string): {
  anchor?: string;
  baseline?: string;
} {
  const start = content.indexOf('---');
  if (start !== 0) return {};

  const end = content.indexOf('---', 3);
  if (end === -1) return {};

  // Extract the content after the frontmatter block
  const afterFrontmatter = content.substring(end + 3);
  const lines = afterFrontmatter.split('\n');

  let anchor: string | undefined;
  let baseline: string | undefined;

  // Only scan the first lines after the frontmatter for metadata
  for (const line of lines) {
    const trimmed = line.trim();

    // Stop scanning if we reach an empty line or markdown content
    if (trimmed === '' || trimmed.startsWith('#')) {
      break;
    }

    // Extract anchor metadata
    if (trimmed.startsWith('anchor:')) {
      anchor = trimmed.replace('anchor:', '').trim();
    }

    // Extract baseline metadata
    if (trimmed.startsWith('baseline:')) {
      baseline = trimmed.replace('baseline:', '').trim();
    }
  }

  return { anchor, baseline };
}
