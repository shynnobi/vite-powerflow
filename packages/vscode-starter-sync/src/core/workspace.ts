import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

/**
 * Returns the root path of the current workspace if it matches the expected monorepo structure.
 * Checks for pnpm-workspace.yaml and apps/starter to confirm.
 * @returns The workspace root path as a string, or null if not found or invalid
 */
export function getWorkspaceRoot(): string | null {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) return null;

  const root = workspaceFolder.uri.fsPath;
  // A simple check to confirm we are in the correct monorepo.
  if (
    fs.existsSync(path.join(root, 'pnpm-workspace.yaml')) &&
    fs.existsSync(path.join(root, 'apps/starter'))
  ) {
    return root;
  }
  return null;
}
