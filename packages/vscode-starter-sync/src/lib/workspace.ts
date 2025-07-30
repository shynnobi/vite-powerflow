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

export async function getPackageInfo(
  packagePath: string
): Promise<{ name: string; version: string } | null> {
  try {
    const pkgContent = await fs.promises.readFile(packagePath, 'utf-8');
    const pkg = JSON.parse(pkgContent);
    if (pkg.name && pkg.version) {
      return { name: pkg.name, version: pkg.version };
    }
    return null;
  } catch (error) {
    return null;
  }
}
