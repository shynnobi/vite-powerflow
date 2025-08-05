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
        const changeset: Changeset = {
          fileName: file,
          bumpType,
        };
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
      const message = (error as unknown as Error).message || String(error);
      logMessage(outputChannel, `⚠️ Error reading changeset directory: ${message}`);
    }
    return null;
  }

  return null;
}
