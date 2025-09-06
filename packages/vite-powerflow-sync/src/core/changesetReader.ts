import { execSync } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';

import { extractMetadataAfterFrontmatter, parseChangesetFrontmatter } from './changesetParser';
import { Changeset, ChangesetStatus } from './types';

export async function readChangesetStatus(
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

        // Check if anchor is present (for compatibility)
        const { anchor: _anchor } = extractMetadataAfterFrontmatter(content);

        const changeset: Changeset = {
          fileName: file,
          bumpType: bumpType as 'minor' | 'patch' | 'major' | 'none',
        };
        return { status: 'pending', changeset };
      }
    }
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      'code' in error &&
      (error as { code?: string }).code !== 'ENOENT'
    ) {
      console.error(`Error reading changeset status: ${(error as Error).message}`);
      return null;
    }
  }

  return null;
}

export async function readLatestChangeset(
  workspaceRoot: string,
  targetPackage: string
): Promise<(Changeset & { lastCommitSha: string; anchor?: string; baseline?: string }) | null> {
  const changesetDir = path.join(workspaceRoot, '.changeset');

  try {
    const files = await fs.readdir(changesetDir);
    const mdFiles = files.filter(file => file.endsWith('.md') && file !== 'README.md');
    if (mdFiles.length === 0) return null;

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
            break;
          }
        }
        if (inFm) fmLines.push(ln);
      }
      const frontmatter = parseChangesetFrontmatter(content);

      if (!frontmatter.has(targetPackage)) {
        continue;
      }

      const bumpType = frontmatter.get(targetPackage)!;

      // Use the new function to extract anchor and baseline
      const { anchor: anchorFromMeta, baseline: baselineFromMeta } =
        extractMetadataAfterFrontmatter(content);

      let anchor: string | undefined = anchorFromMeta;
      const baseline: string | undefined = baselineFromMeta;

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
        } catch {}
      }

      const changeset: Changeset = {
        fileName: file,
        bumpType: bumpType as 'minor' | 'patch' | 'major' | 'none',
      };

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
        latest ??= { changeset, lastCommitSha: '', commitTime: 0, anchor, baseline };
      }
    }

    if (!latest) return null;

    const anchor = latest.anchor;
    const baseline = latest.baseline;

    return { ...latest.changeset, lastCommitSha: latest.lastCommitSha, anchor, baseline };
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      'code' in error &&
      (error as { code?: string }).code !== 'ENOENT'
    ) {
    }
    return null;
  }
}
