import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

let outputChannel: vscode.OutputChannel;
let statusBarItem: vscode.StatusBarItem;
let lastCheckResult: string = '';
let outputBuffer: string[] = []; // Buffer to store output lines

const COMMAND_ID = 'vitePowerflow.runSyncCheck';
const SHOW_LAST_RESULT_COMMAND_ID = 'vitePowerflow.showLastResult';

export function activate(context: vscode.ExtensionContext) {
  outputChannel = vscode.window.createOutputChannel('Vite Powerflow');
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBarItem.command = COMMAND_ID;
  context.subscriptions.push(statusBarItem);

  // Register commands
  const runSyncCheckCommand = vscode.commands.registerCommand(COMMAND_ID, () => {
    if (lastCheckResult) {
      outputChannel.clear();
      outputChannel.append(lastCheckResult);
      outputChannel.show(true);
    } else {
      vscode.window.showInformationMessage(
        'No previous sync check result available. Waiting for watchers to trigger a check.'
      );
    }
  });

  context.subscriptions.push(runSyncCheckCommand);

  const workspaceRoot = getWorkspaceRoot();
  if (workspaceRoot) {
    let debounceTimer: NodeJS.Timeout;
    const debouncedCheck = (trigger: string) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        outputChannel.appendLine(`[${trigger}] Triggering sync check...`);
        outputBuffer.push(`[${trigger}] Triggering sync check...`);
        checkIfStarterIsOutOfSync();
      }, 200); // Debounce to avoid multiple rapid checks
    };

    // Initial check on activation.
    debouncedCheck('Activation');

    // Watcher for branch changes (checkouts).
    const gitHeadWatcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(workspaceRoot, '.git/HEAD')
    );
    gitHeadWatcher.onDidChange(() => debouncedCheck('HEAD change'));
    context.subscriptions.push(gitHeadWatcher);

    // Watcher for new commits on any local branch.
    const gitRefsWatcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(workspaceRoot, '.git/refs/heads/**')
    );
    gitRefsWatcher.onDidChange(() => debouncedCheck('Branch commit'));
    gitRefsWatcher.onDidCreate(() => debouncedCheck('Branch creation'));
    context.subscriptions.push(gitRefsWatcher);

    // Also re-check when the template's package.json is modified.
    const templatePackageWatcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(workspaceRoot, 'packages/cli/template/package.json')
    );
    templatePackageWatcher.onDidChange(() => debouncedCheck('Template package.json change'));
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
    const logLine = `[${new Date().toISOString()}] Running starter sync check...`;
    outputChannel.appendLine('---');
    outputChannel.appendLine(logLine);
    outputBuffer.push('---', logLine);

    const workspaceRoot = getWorkspaceRoot();
    if (!workspaceRoot) {
      // This case is handled in activate(), but as a safeguard.
      updateStatusBar('error', 'Not in a Vite Powerflow workspace.');
      return;
    }

    const templateBaselineCommit = getTemplateBaselineCommit(workspaceRoot);
    if (templateBaselineCommit === 'unknown') {
      updateStatusBar('error', 'Template baseline commit not found in CLI template.');
      return;
    }
    const shortTemplateBaselineCommit = templateBaselineCommit.substring(0, 7);
    const templateLog = `📦 Checking against CLI template baseline commit (commit ${shortTemplateBaselineCommit})`;
    outputChannel.appendLine(templateLog);
    outputBuffer.push(templateLog);

    const currentCommit = getCurrentCommit(workspaceRoot);
    const shortCurrentCommit = currentCommit.substring(0, 7);
    const headLog = `📍 HEAD is at commit ${shortCurrentCommit}`;
    outputChannel.appendLine(headLog);
    outputBuffer.push(headLog);

    outputChannel.appendLine("🔎 Searching for 'apps/starter' changes...");
    outputBuffer.push("🔎 Searching for 'apps/starter' changes...");
    const newStarterCommits = getStarterCommitsSinceTemplateBaseline(
      workspaceRoot,
      templateBaselineCommit,
      currentCommit
    );

    if (newStarterCommits.length > 0) {
      const commitCount = newStarterCommits.length;
      const warningLog = `🚨 Found ${commitCount} unreleased commits for 'apps/starter'.`;
      outputChannel.appendLine(warningLog);
      outputBuffer.push(warningLog);
      newStarterCommits.forEach(c => {
        outputChannel.appendLine(`  - ${c}`);
        outputBuffer.push(`  - ${c}`);
      });

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
      const successLog =
        "✅ 'apps/starter' is in sync with the latest CLI template baseline commit.";
      outputChannel.appendLine(successLog);
      outputBuffer.push(successLog);
      updateStatusBar('sync', 'Starter is in sync.');
    }

    // Save the last result
    lastCheckResult = outputBuffer.join('\n');
  } catch (error: any) {
    const errorLog = `❌ Error during sync check: ${error.message}`;
    outputChannel.appendLine(errorLog);
    outputBuffer.push(errorLog);
    updateStatusBar('error', 'Error during sync check.');
  }
}

type Status = 'sync' | 'warning' | 'error';

function updateStatusBar(status: Status, tooltip: string) {
  let icon: string;
  let color: vscode.ThemeColor | undefined;

  switch (status) {
    case 'sync':
      icon = '$(check)';
      color = new vscode.ThemeColor('statusBarItem.prominentBackground');
      break;
    case 'warning':
      icon = '$(warning)';
      color = new vscode.ThemeColor('statusBarItem.warningBackground');
      break;
    case 'error':
      icon = '$(error)';
      color = new vscode.ThemeColor('statusBarItem.errorBackground');
      break;
  }
  statusBarItem.text = `${icon} Vite Powerflow`;
  statusBarItem.tooltip = tooltip;
  statusBarItem.backgroundColor = color;
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

function getTemplateBaselineCommit(workspaceRoot: string): string {
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

function getStarterCommitsSinceTemplateBaseline(
  workspaceRoot: string,
  templateBaselineCommit: string,
  currentCommit: string
): string[] {
  try {
    // First, check if the template baseline commit exists in the local repository.
    // `git cat-file -e` exits with 0 if it exists, non-zero otherwise.
    execSync(`git cat-file -e ${templateBaselineCommit}^{commit}`, {
      cwd: workspaceRoot,
      stdio: 'ignore', // Don't print output or error.
    });
  } catch (error) {
    outputChannel.appendLine(
      `⚠️ The CLI template baseline commit "${templateBaselineCommit}" was not found in your local git history. Try running "git fetch --all".`
    );
    // Throw an error to indicate this specific problem.
    throw new Error(`CLI template baseline commit ${templateBaselineCommit} not found.`);
  }

  try {
    const command = `git log ${templateBaselineCommit}..${currentCommit} --oneline -- apps/starter/`;
    const commits = execSync(command, {
      encoding: 'utf-8',
      cwd: workspaceRoot,
    }).trim();

    if (!commits) return [];
    return commits.split('\n').filter(line => line.trim());
  } catch (error: any) {
    // This can happen if the template baseline commit is not an ancestor of the current commit (e.g., on a diverged branch).
    // This is an expected scenario, not a critical error.
    outputChannel.appendLine(
      `ℹ️ Could not perform a direct log between ${templateBaselineCommit} and ${currentCommit}. This may be normal if your branch has diverged. The check will fall back to a simple diff.`
    );
    // We can't list commits, but we can still detect changes.
    // A `git diff --quiet` will tell us if there are any differences.
    const diffCommand = `git diff --quiet ${templateBaselineCommit}..${currentCommit} -- apps/starter/`;
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
