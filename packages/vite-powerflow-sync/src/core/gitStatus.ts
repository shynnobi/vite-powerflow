import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export function resolveRefToSha(
  workspaceRoot: string,
  ref: string,
  outputChannel: { appendLine: (value: string) => void }
): string | undefined {
  const tryResolve = (): string | undefined => {
    try {
      const sha = execSync(`git rev-list -n 1 ${ref}`, {
        encoding: 'utf-8',
        cwd: workspaceRoot,
        stdio: 'pipe',
      }).trim();
      return sha || undefined;
    } catch {
      return undefined;
    }
  };

  let sha = tryResolve();
  if (sha) return sha;

  try {
    execSync('git fetch --tags', { cwd: workspaceRoot, stdio: 'ignore' });
  } catch {
    outputChannel.appendLine('ℹ️ Failed to fetch tags while resolving ref to SHA.');
  }

  sha = tryResolve();
  if (!sha) {
    outputChannel.appendLine(`ℹ️ Could not resolve ref "${ref}" to a SHA. Will fallback to ref.`);
  }
  return sha;
}

export function getTemplateBaseline(
  workspaceRoot: string,
  outputChannel: { appendLine: (value: string) => void }
): string {
  try {
    const templatePackagePath = path.join(workspaceRoot, 'packages/cli/template/package.json');
    const content = fs.readFileSync(templatePackagePath, 'utf-8');
    const templatePackage = JSON.parse(content) as {
      starterSource?: { commit?: string };
    };

    if (templatePackage.starterSource?.commit) {
      return templatePackage.starterSource.commit;
    }

    outputChannel.appendLine('⚠️ No "starterSource.commit" found in CLI template package.json');
    return 'unknown';
  } catch (error: unknown) {
    const message = (error as Error).message || String(error);
    outputChannel.appendLine(`❌ Error reading CLI template package.json: ${message}`);
    return 'unknown';
  }
}

export function getExtensionBaseline(
  workspaceRoot: string,
  outputChannel: { appendLine: (value: string) => void }
): string {
  try {
    // Read baseline from extension package.json
    const extensionPackagePath = path.join(
      workspaceRoot,
      'packages/vite-powerflow-sync/package.json'
    );
    const content = fs.readFileSync(extensionPackagePath, 'utf-8');
    const extensionPackage = JSON.parse(content) as {
      syncBaseline?: { commit?: string };
      extensionBaseline?: string; // fallback for backward compatibility
    };

    // Try new syncBaseline first
    if (extensionPackage.syncBaseline?.commit) {
      // outputChannel.appendLine(
      //   `ℹ️ Using syncBaseline from extension package.json: ${extensionPackage.syncBaseline.commit}`
      // );
      return extensionPackage.syncBaseline.commit;
    }

    // Fallback to old extensionBaseline for backward compatibility
    if (extensionPackage.extensionBaseline) {
      outputChannel.appendLine(
        `ℹ️ Using legacy extensionBaseline: ${extensionPackage.extensionBaseline}`
      );
      return extensionPackage.extensionBaseline;
    }

    outputChannel.appendLine('⚠️ No baseline found in extension package.json');
    return 'unknown';
  } catch (error: unknown) {
    const message = (error as Error).message || String(error);
    outputChannel.appendLine(`❌ Error reading extension package.json: ${message}`);
    return 'unknown';
  }
}
