import { execSync } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';

import { Changeset, ChangesetStatus } from '../types.js';
import { parseChangesetFrontmatter } from './changeset-parser.js';

/**
 * Finds and parses changeset files relevant to a specific package.
 * @param workspaceRoot - The root of the workspace.
 * @param targetPackage - The name of the package to check for.
 * @returns A ChangesetStatus object or null if no changesets are found.
 */
export async function getChangesetStatus(
  workspaceRoot: string,
  targetPackage: string
): Promise<ChangesetStatus | null> {
  const changesetDir = path.join(workspaceRoot, '.changeset');

  try {
    const files = await fs.readdir(changesetDir);

    const mdFiles = files.filter(file => file.endsWith('.md') && file !== 'README.md');

    if (mdFiles.length === 0) {
      return null;
    }

    for (const file of mdFiles) {
      const filePath = path.join(changesetDir, file);
      const content = await fs.readFile(filePath, 'utf-8');

      const frontmatter = parseChangesetFrontmatter(content);

      if (frontmatter.has(targetPackage)) {
        const bumpType = frontmatter.get(targetPackage)!;

        // Prefer explicit 'anchor' from frontmatter if present, else fallback to git log
        try {
          const anchorLine = content.split('\n').find(l => /^anchor\s*:/.test(l.trim()));
          if (anchorLine) {
            // const m = anchorLine.trim().match(/^anchor\s*:\s*(.+)$/); // unused, removed
          }
        } catch {
          // ignore parsing errors
        }

        const changeset: Changeset = {
          fileName: file,
          bumpType: bumpType as 'minor' | 'patch' | 'major',
        };
        // We keep returning the legacy shape here; getLatestChangesetForPackage already returns the sha
        return { status: 'pending', changeset };
      }
    }
  } catch (error: unknown) {
    // If the directory doesn't exist, it's not an error, just no changesets.
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      (error as { code?: string }).code !== 'ENOENT'
    ) {
      // Log only critical errors
    }
    return null;
  }

  return null;
}

/**
 * Returns the most recent changeset affecting the target package, including the
 * last commit SHA that modified the changeset markdown file. This helps detect
 * whether new package changes occurred after the changeset was authored/edited.
 */
export async function getLatestChangesetForPackage(
  workspaceRoot: string,
  targetPackage: string
): Promise<(Changeset & { lastCommitSha: string; anchor?: string; baseline?: string }) | null> {
  const changesetDir = path.join(workspaceRoot, '.changeset');

  try {
    const files = await fs.readdir(changesetDir);
    const mdFiles = files.filter(file => file.endsWith('.md') && file !== 'README.md');
    if (mdFiles.length === 0) return null;

    // Track the newest by commit date using git log -n 1
    let latest: {
      changeset: Changeset;
      lastCommitSha: string;
      commitTime: number;
      anchor?: string;
      baseline?: string;
    } | null = null;

    for (const file of mdFiles) {
      const filePath = path.join(changesetDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      // IMPORTANT: Only parse YAML frontmatter block (between leading --- and next ---).
      // Many changeset files contain prose after frontmatter; keys there must be ignored.
      const lines = content.split('\n');
      let inFm = false;
      let fmLines: string[] = [];
      for (const ln of lines) {
        const t = ln.trim();
        if (t === '---') {
          if (!inFm) {
            inFm = true;
            continue;
          } else {
            // closing fence reached
            break;
          }
        }
        if (inFm) fmLines.push(ln);
      }
      // fmText parsed but not used
      const frontmatter = parseChangesetFrontmatter(content); // Pass full content instead of fmText

      if (!frontmatter.has(targetPackage)) {
        continue;
      }

      const bumpType = frontmatter.get(targetPackage)!;

      // Extract optional metadata from frontmatter (strictly from YAML block)
      const anchorMeta = frontmatter.get('anchor');
      const baselineMeta = frontmatter.get('baseline');

      // Accept either a 40-char SHA or a short 7+ hex as anchor; normalize short to full SHA via git rev-parse if possible
      let anchor: string | undefined =
        typeof anchorMeta === 'string' && anchorMeta.trim().length > 0
          ? anchorMeta.trim()
          : undefined;
      const baseline: string | undefined =
        typeof baselineMeta === 'string' && baselineMeta.trim().length > 0
          ? baselineMeta.trim()
          : undefined;

      // If anchor looks like a short SHA (7-39 hex) try to resolve it to full SHA for consistent diffs
      if (anchor && /^[0-9a-f]{7,39}$/i.test(anchor)) {
        try {
          const full = execSync(`git rev-parse ${anchor}`, {
            encoding: 'utf-8',
            cwd: workspaceRoot,
            stdio: 'pipe',
          })
            .trim()
            .replace(/\r?\n/g, '');
          if (/^[0-9a-f]{40}$/i.test(full)) anchor = full;
        } catch {
          // keep original short anchor if resolution fails
        }
      }

      const changeset: Changeset = {
        fileName: file,
        bumpType: bumpType as 'minor' | 'patch' | 'major',
      };

      // Obtain last commit sha and author date (unix) for this file
      // %H = commit hash, %ct = committer date, unix timestamp
      try {
        const pretty = execSync(
          `git log -n 1 --pretty=%H:%ct -- ${path.relative(workspaceRoot, filePath)}`,
          {
            encoding: 'utf-8',
            cwd: workspaceRoot,
            stdio: 'pipe',
          }
        ).trim();

        const [sha, tsStr] = pretty.split(':');
        const ts = Number(tsStr ?? '0');

        if (!latest || ts > latest.commitTime) {
          latest = { changeset, lastCommitSha: sha, commitTime: ts, anchor, baseline };
        }
      } catch {
        // Log only critical errors
        // If git log fails, still return the first matching changeset without SHA
        if (!latest) {
          latest = { changeset, lastCommitSha: '', commitTime: 0, anchor, baseline };
        }
      }
    }

    if (!latest) return null;

    // Extract metadata and return
    const anchor = latest.anchor;
    const baseline = latest.baseline;

    return { ...latest.changeset, lastCommitSha: latest.lastCommitSha, anchor, baseline };
  } catch (error: unknown) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      (error as { code?: string }).code !== 'ENOENT'
    ) {
      // Log only critical errors
    }
    return null;
  }
}
