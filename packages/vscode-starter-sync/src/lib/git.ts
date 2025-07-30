import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export function getCurrentCommit(workspaceRoot: string): string {
  return execSync('git rev-parse HEAD', {
    encoding: 'utf-8',
    cwd: workspaceRoot,
  }).trim();
}

export function getTemplateBaselineCommit(
  workspaceRoot: string,
  outputChannel: { appendLine: (value: string) => void }
): string {
  try {
    const templatePackagePath = path.join(workspaceRoot, 'packages/cli/template/package.json');
    const content = fs.readFileSync(templatePackagePath, 'utf-8');
    const templatePackage = JSON.parse(content);

    if (templatePackage.starterSource && templatePackage.starterSource.commit) {
      return templatePackage.starterSource.commit;
    }

    outputChannel.appendLine('⚠️ No "starterSource.commit" found in CLI template package.json');
    return 'unknown';
  } catch (error: any) {
    outputChannel.appendLine(`❌ Error reading CLI template package.json: ${error.message}`);
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
    // First, check if the base ref (commit or tag) exists in the local repository.
    execSync(`git cat-file -e ${baseRef}^{commit}`, {
      cwd: workspaceRoot,
      stdio: 'ignore', // Don't print output or error.
    });
  } catch (error) {
    outputChannel.appendLine(
      `⚠️ The base ref "${baseRef}" was not found in your local git history. Try running "git fetch --all --tags".`
    );
    // Throw an error to indicate this specific problem.
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
  } catch (error: any) {
    // This can happen if the base ref is not an ancestor of the current ref (e.g., on a diverged branch).
    // This is an expected scenario, not a critical error.
    outputChannel.appendLine(
      `ℹ️ Could not perform a direct log between ${baseRef} and ${headRef}. This may be normal if your branch has diverged. The check will fall back to a simple diff.`
    );
    // We can't list commits, but we can still detect changes.
    // A `git diff --quiet` will tell us if there are any differences.
    const diffCommand = `git diff --quiet ${baseRef}..${headRef} -- ${pathspec}`;
    try {
      execSync(diffCommand, { cwd: workspaceRoot, stdio: 'ignore' });
      // Exit code is 0, meaning no differences were found.
      return [];
    } catch (diffError) {
      // Exit code is 1, meaning there are differences.
      return ['Changes detected (unable to list individual commits due to diverged history)'];
    }
  }
}
