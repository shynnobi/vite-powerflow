import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

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
