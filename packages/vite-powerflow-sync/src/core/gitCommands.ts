import { execSync } from 'child_process';

export function getCurrentCommit(workspaceRoot: string, exec: typeof execSync = execSync): string {
  return exec('git rev-parse HEAD', {
    encoding: 'utf-8',
    cwd: workspaceRoot,
  }).trim();
}

export function getCommitsSince(
  workspaceRoot: string,
  baseRef: string,
  headRef: string,
  pathspec: string,
  outputChannel: { appendLine: (_value: string) => void }
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
  outputChannel: { appendLine: (_value: string) => void }
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
