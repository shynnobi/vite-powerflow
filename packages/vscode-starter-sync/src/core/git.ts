import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Returns the current git commit hash (HEAD) for the given workspace root.
 * @param workspaceRoot - The root directory of the git workspace
 * @param exec - (optional) Function to execute shell commands (for testability)
 * @returns The current commit hash as a string
 */
export function getCurrentCommit(workspaceRoot: string, exec: typeof execSync = execSync): string {
  return exec('git rev-parse HEAD', {
    encoding: 'utf-8',
    cwd: workspaceRoot,
  }).trim();
}

/**
 * Resolve a git ref (tag/branch) to a commit SHA.
 * - Tries `git rev-list -n 1 <ref>`
 * - If not found, attempts `git fetch --tags` once, then retries
 * - Returns undefined if it cannot be resolved
 */
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

  // Attempt to fetch tags then retry once
  try {
    outputChannel.appendLine(`ℹ️ Resolving ref "${ref}" failed. Trying "git fetch --tags"…`);
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

/**
 * Reads the CLI template's package.json and returns the baseline commit hash for the starter.
 * Logs a warning and returns 'unknown' if not found or on error.
 * @param workspaceRoot - The root directory of the workspace
 * @param outputChannel - Output channel for logging messages
 * @returns The baseline commit hash, or 'unknown' if not found
 */
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

/**
 * Returns a list of commit messages between baseRef and headRef for a given pathspec.
 * If the base ref does not exist, logs a warning and throws an error.
 * If the history is diverged, falls back to a diff check and returns a generic message if changes are detected.
 * @param workspaceRoot - The root directory of the workspace
 * @param baseRef - The base commit or tag to compare from
 * @param headRef - The head commit or tag to compare to
 * @param pathspec - The path to restrict the log/diff to
 * @param outputChannel - Output channel for logging messages
 * @returns An array of commit messages, or a generic message if diverged
 */
export function getCommitsSince(
  workspaceRoot: string,
  baseRef: string,
  headRef: string,
  pathspec: string,
  outputChannel: { appendLine: (value: string) => void }
): string[] {
  try {
    // Check if the base ref (commit or tag) exists in the local repository.
    execSync(`git cat-file -e ${baseRef}^{commit}`, {
      cwd: workspaceRoot,
      stdio: 'ignore', // Suppress output and errors.
    });
  } catch {
    // If the base ref does not exist, log a warning and throw an error.
    outputChannel.appendLine(
      `⚠️ The base ref "${baseRef}" was not found in your local git history. Try running "git fetch --all --tags".`
    );
    throw new Error(`Base ref ${baseRef} not found.`);
  }

  try {
    // Try to get the list of commits between baseRef and headRef for the given pathspec.
    const command = `git log ${baseRef}..${headRef} --oneline -- ${pathspec}`;
    const commits = execSync(command, {
      encoding: 'utf-8',
      cwd: workspaceRoot,
    }).trim();

    // If there are no commits, return an empty array.
    if (!commits) return [];
    // Otherwise, split the output into individual commit lines.
    return commits.split('\n').filter(line => line.trim());
  } catch {
    // If the history is diverged (baseRef is not an ancestor), this is not a critical error.
    outputChannel.appendLine(
      `ℹ️ Could not perform a direct log between ${baseRef} and ${headRef}. This may be normal if your branch has diverged. The check will fall back to a simple diff.`
    );
    // Fallback: use git diff to check if there are any changes at all.
    const diffCommand = `git diff --quiet ${baseRef}..${headRef} -- ${pathspec}`;
    try {
      execSync(diffCommand, { cwd: workspaceRoot, stdio: 'ignore' });
      // Exit code 0: no differences found.
      return [];
    } catch {
      // Exit code 1: differences found, but we can't list individual commits.
      return ['Changes detected (unable to list individual commits due to diverged history)'];
    }
  }
}

/**
 * Returns list of files changed since a given ref/sha restricted to pathspec.
 * Uses git diff --name-only <ref>...HEAD to include changes on both sides of history.
 */
export function getFilesChangedSince(
  workspaceRoot: string,
  sinceRef: string,
  pathspec: string,
  outputChannel: { appendLine: (value: string) => void }
): string[] {
  try {
    // Validate sinceRef exists; if not, log and return empty for safety
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
