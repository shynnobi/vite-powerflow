import { execSync } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as vscode from 'vscode';

import { Changeset, ChangesetStatus } from '../types.js';
import { parseChangesetFrontmatter } from './changeset-parser.js';
import { logMessage } from './utils.js';

const CHANGESET_DIR = '.changeset';

/**
 * Finds and parses changeset files relevant to a specific package.
 * @param workspaceRoot - The root of the workspace.
 * @param targetPackage - The name of the package to check for.
 * @param outputChannel - The VS Code output channel for logging.
 * @returns A ChangesetStatus object or null if no changesets are found.
 */
export async function getChangesetStatus(
  workspaceRoot: string,
  targetPackage: string,
  outputChannel: vscode.OutputChannel
): Promise<ChangesetStatus | null> {
  const changesetDir = path.join(workspaceRoot, CHANGESET_DIR);

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
        let lastCommitSha = '';
        try {
          const anchorLine = content.split('\n').find(l => /^anchor\s*:/.test(l.trim()));
          if (anchorLine) {
            const m = anchorLine.trim().match(/^anchor\s*:\s*(.+)$/);
            if (m) lastCommitSha = m[1].trim().replace(/^['"](.*)['"]$/, '$1');
          }
        } catch {
          // ignore parsing errors
        }

        const changeset: Changeset = {
          fileName: file,
          bumpType,
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
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      logMessage(outputChannel, `⚠️ Error reading changeset directory: ${message}`);
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
  targetPackage: string,
  outputChannel: vscode.OutputChannel
): Promise<(Changeset & { lastCommitSha: string }) | null> {
  const changesetDir = path.join(workspaceRoot, CHANGESET_DIR);

  try {
    const files = await fs.readdir(changesetDir);
    const mdFiles = files.filter(file => file.endsWith('.md') && file !== 'README.md');
    if (mdFiles.length === 0) return null;

    // Track the newest by commit date using git log -n 1
    let latest: { changeset: Changeset; lastCommitSha: string; commitTime: number } | null = null;

    for (const file of mdFiles) {
      const filePath = path.join(changesetDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const frontmatter = parseChangesetFrontmatter(content);

      if (!frontmatter.has(targetPackage)) continue;

      const bumpType = frontmatter.get(targetPackage)!;
      const changeset: Changeset = { fileName: file, bumpType };

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
          latest = { changeset, lastCommitSha: sha, commitTime: ts };
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        logMessage(outputChannel, `⚠️ Failed to get last commit for ${file}: ${message}`);
        // If git log fails, still return the first matching changeset without SHA
        if (!latest) {
          latest = { changeset, lastCommitSha: '', commitTime: 0 };
        }
      }
    }

    if (!latest) return null;
    return { ...latest.changeset, lastCommitSha: latest.lastCommitSha };
  } catch (error: unknown) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      (error as { code?: string }).code !== 'ENOENT'
    ) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      logMessage(outputChannel, `⚠️ Error reading changeset directory: ${message}`);
    }
    return null;
  }
}
