import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export function getCurrentCommit(workspaceRoot: string, exec: typeof execSync = execSync): string {
  return exec('git rev-parse HEAD', {
    encoding: 'utf-8',
    cwd: workspaceRoot,
  }).trim();
}

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

export function getTemplateBaselineCommit(
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

export function getCommitsSince(
  workspaceRoot: string,
  baseRef: string,
  headRef: string,
  pathspec: string,
  outputChannel: { appendLine: (value: string) => void }
): string[] {
  try {
    execSync(`git cat-file -e ${baseRef}^{commit}`, {
      cwd: workspaceRoot,
      stdio: 'ignore',
    });
  } catch {
    outputChannel.appendLine(
      `⚠️ The base ref "${baseRef}" was not found in your local git history. Try running "git fetch --all --tags".`
    );
    throw new Error(`Base ref ${baseRef} not found.`);
  }

  try {
    const command = `git log ${baseRef}..${headRef} --oneline -- ${pathspec}`;
    const commits = execSync(command, {
      encoding: 'utf-8',
      cwd: workspaceRoot,
    }).trim();

    if (!commits) return [];
    return commits.split('\n').filter(line => line.trim());
  } catch {
    outputChannel.appendLine(
      `ℹ️ Could not perform a direct log between ${baseRef} and ${headRef}. This may be normal if your branch has diverged. The check will fall back to a simple diff.`
    );
    const diffCommand = `git diff --quiet ${baseRef}..${headRef} -- ${pathspec}`;
    try {
      execSync(diffCommand, { cwd: workspaceRoot, stdio: 'ignore' });
      return [];
    } catch {
      return ['Changes detected (unable to list individual commits due to diverged history)'];
    }
  }
}

export function getFilesChangedSince(
  workspaceRoot: string,
  sinceRef: string,
  pathspec: string,
  outputChannel: { appendLine: (value: string) => void }
): string[] {
  try {
    execSync(`git cat-file -e ${sinceRef}^{commit}`, {
      cwd: workspaceRoot,
      stdio: 'ignore',
    });
  } catch {
    outputChannel.appendLine(
      `ℹ️ Base ref "${sinceRef}" not found when computing changed files; skipping detailed diff.`
    );
    return [];
  }

  try {
    const cmd = `git diff --name-only ${sinceRef}...HEAD -- ${pathspec}`;
    const out = execSync(cmd, { encoding: 'utf-8', cwd: workspaceRoot }).trim();
    if (!out) return [];
    return out.split('\n').filter(Boolean);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    outputChannel.appendLine(`ℹ️ Failed to list files changed since ${sinceRef}: ${msg}`);
    return [];
  }
}
