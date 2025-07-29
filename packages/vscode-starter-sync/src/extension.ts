import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

let outputChannel: vscode.OutputChannel;
let statusBarItem: vscode.StatusBarItem;

const COMMAND_ID = 'vitePowerflow.runSyncCheck';

export function activate(context: vscode.ExtensionContext) {
  outputChannel = vscode.window.createOutputChannel('Vite Powerflow');
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBarItem.command = COMMAND_ID;
  context.subscriptions.push(statusBarItem);

  // The command's role is now simply to show the output, not to trigger a new check.
  // The check is triggered automatically by watchers.
  const command = vscode.commands.registerCommand(COMMAND_ID, () => {
    outputChannel.show(true);
  });
  context.subscriptions.push(command);

  const workspaceRoot = getWorkspaceRoot();
  if (workspaceRoot) {
    // Initial check on activation.
    checkIfStarterIsOutOfSync();

    // Re-check on git HEAD change (e.g., commit, checkout).
    const gitHeadWatcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(workspaceRoot, '.git/HEAD')
    );
    gitHeadWatcher.onDidChange(() => {
      outputChannel.appendLine('Git HEAD changed, re-running sync check...');
      checkIfStarterIsOutOfSync();
    });
    context.subscriptions.push(gitHeadWatcher);

    // Also re-check when the template's package.json is modified.
    const templatePackageWatcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(workspaceRoot, 'packages/cli/template/package.json')
    );
    templatePackageWatcher.onDidChange(() => {
      outputChannel.appendLine('Template package.json changed, re-running sync check...');
      checkIfStarterIsOutOfSync();
    });
    context.subscriptions.push(templatePackageWatcher);
  } else {
    updateStatusBar('error', 'Not in a Vite Powerflow workspace.');
  }
}

export function deactivate() {
  statusBarItem.dispose();
  outputChannel.dispose();
}

async function checkIfStarterIsOutOfSync() {
  try {
    outputChannel.appendLine('---');
    outputChannel.appendLine(`[${new Date().toISOString()}] Running starter sync check...`);

    const workspaceRoot = getWorkspaceRoot();
    if (!workspaceRoot) {
      // This case is handled in activate(), but as a safeguard.
      updateStatusBar('error', 'Not in a Vite Powerflow workspace.');
      return;
    }

    const baselineCommit = getBaselineCommit(workspaceRoot);
    if (baselineCommit === 'unknown') {
      updateStatusBar('error', 'Baseline commit not found in template.');
      return;
    }
    const shortBaselineCommit = baselineCommit.substring(0, 7);
    outputChannel.appendLine(
      `📦 Checking against template's baseline (commit ${shortBaselineCommit})`
    );

    const currentCommit = getCurrentCommit(workspaceRoot);
    const shortCurrentCommit = currentCommit.substring(0, 7);
    outputChannel.appendLine(`📍 HEAD is at commit ${shortCurrentCommit}`);

    outputChannel.appendLine("🔎 Searching for 'apps/starter' changes...");
    const newStarterCommits = getStarterCommitsSinceBaseline(
      workspaceRoot,
      baselineCommit,
      currentCommit
    );

    if (newStarterCommits.length > 0) {
      const commitCount = newStarterCommits.length;
      outputChannel.appendLine(`🚨 Found ${commitCount} unreleased commits for 'apps/starter'.`);
      newStarterCommits.forEach(c => outputChannel.appendLine(`  - ${c}`));

      updateStatusBar('warning', `Starter has ${commitCount} unreleased change(s).`);

      const selection = await vscode.window.showWarningMessage(
        `The 'starter' app has ${commitCount} unreleased change(s). A changeset is required.`,
        'Create Changeset',
        'Show Details'
      );

      if (selection === 'Create Changeset') {
        const terminal = vscode.window.createTerminal({ name: 'Changeset' });
        terminal.sendText('pnpm changeset');
        terminal.show();
      } else if (selection === 'Show Details') {
        outputChannel.show(true);
      }
    } else {
      outputChannel.appendLine("✅ 'apps/starter' is in sync with the latest template.");
      updateStatusBar('sync', 'Starter is in sync.');
    }
  } catch (error: any) {
    outputChannel.appendLine(`❌ Error during sync check: ${error.message}`);
    updateStatusBar('error', 'Error during sync check.');
  }
}

type Status = 'sync' | 'warning' | 'error';

function updateStatusBar(status: Status, tooltip: string) {
  let icon: string;
  switch (status) {
    case 'sync':
      icon = '$(check)';
      break;
    case 'warning':
      icon = '$(warning)';
      break;
    case 'error':
      icon = '$(error)';
      break;
  }
  statusBarItem.text = `${icon} Vite Powerflow`;
  statusBarItem.tooltip = tooltip;
  statusBarItem.show();
}

function getWorkspaceRoot(): string | null {
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

function getCurrentCommit(workspaceRoot: string): string {
  return execSync('git rev-parse HEAD', {
    encoding: 'utf-8',
    cwd: workspaceRoot,
  }).trim();
}

function getStarterCommitsSinceBaseline(
  workspaceRoot: string,
  baselineCommit: string,
  currentCommit: string
): string[] {
  try {
    // First, check if the baseline commit exists in the local repository.
    // `git cat-file -e` exits with 0 if it exists, non-zero otherwise.
    execSync(`git cat-file -e ${baselineCommit}^{commit}`, {
      cwd: workspaceRoot,
      stdio: 'ignore', // Don't print output or error.
    });
  } catch (error) {
    outputChannel.appendLine(
      `⚠️ The baseline commit "${baselineCommit}" from the template was not found in your local git history. Try running "git fetch --all".`
    );
    // Throw an error to indicate this specific problem.
    throw new Error(`Baseline commit ${baselineCommit} not found.`);
  }

  try {
    const command = `git log ${baselineCommit}..${currentCommit} --oneline -- apps/starter/`;
    const commits = execSync(command, {
      encoding: 'utf-8',
      cwd: workspaceRoot,
    }).trim();

    if (!commits) return [];
    return commits.split('\n').filter(line => line.trim());
  } catch (error: any) {
    // This can happen if the baseline commit is not an ancestor of the current commit (e.g., on a diverged branch).
    // This is an expected scenario, not a critical error.
    outputChannel.appendLine(
      `ℹ️ Could not perform a direct log between ${baselineCommit} and ${currentCommit}. This may be normal if your branch has diverged. The check will fall back to a simple diff.`
    );
    // We can't list commits, but we can still detect changes.
    // A `git diff --quiet` will tell us if there are any differences.
    const diffCommand = `git diff --quiet ${baselineCommit}..${currentCommit} -- apps/starter/`;
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

function getBaselineCommit(workspaceRoot: string): string {
  try {
    const templatePackagePath = path.join(workspaceRoot, 'packages/cli/template/package.json');
    const content = fs.readFileSync(templatePackagePath, 'utf-8');
    const templatePackage = JSON.parse(content);

    if (templatePackage.starterSource && templatePackage.starterSource.commit) {
      return templatePackage.starterSource.commit;
    }

    outputChannel.appendLine('⚠️ No "starterSource.commit" found in template package.json');
    return 'unknown';
  } catch (error: any) {
    outputChannel.appendLine(`❌ Error reading template package.json: ${error.message}`);
    return 'unknown';
  }
}
