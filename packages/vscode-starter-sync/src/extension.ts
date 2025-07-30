import * as vscode from 'vscode';

import { checkCliStatus, checkStarterStatus } from './lib/checks';
import { handleSyncResults, updateStatusBar } from './lib/ui';
import { getWorkspaceRoot } from './lib/workspace';

let outputChannel: vscode.OutputChannel;
let statusBarItem: vscode.StatusBarItem;
let lastCheckResult: string = '';
let outputBuffer: string[] = [];

const COMMAND_ID = 'vitePowerflow.runSyncCheck';

export function activate(context: vscode.ExtensionContext) {
  outputChannel = vscode.window.createOutputChannel('Vite Powerflow');
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBarItem.command = COMMAND_ID;
  context.subscriptions.push(statusBarItem);

  const runSyncCheckCommand = vscode.commands.registerCommand(COMMAND_ID, () => {
    if (lastCheckResult) {
      outputChannel.clear();
      outputChannel.append(lastCheckResult);
      outputChannel.show(true);
    } else {
      vscode.window.showInformationMessage('No previous sync check result. Running a new one...');
      runSyncChecks();
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
        runSyncChecks();
      }, 200);
    };

    debouncedCheck('Activation');

    const gitHeadWatcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(workspaceRoot, '.git/HEAD')
    );
    gitHeadWatcher.onDidChange(() => debouncedCheck('HEAD change'));
    context.subscriptions.push(gitHeadWatcher);

    const gitRefsWatcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(workspaceRoot, '.git/refs/heads/**')
    );
    gitRefsWatcher.onDidChange(() => debouncedCheck('Branch commit'));
    gitRefsWatcher.onDidCreate(() => debouncedCheck('Branch creation'));
    context.subscriptions.push(gitRefsWatcher);

    const cliPackageWatcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(workspaceRoot, 'packages/cli/package.json')
    );
    cliPackageWatcher.onDidChange(() => debouncedCheck('CLI package.json change'));
    context.subscriptions.push(cliPackageWatcher);

    const templatePackageWatcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(workspaceRoot, 'packages/cli/template/package.json')
    );
    templatePackageWatcher.onDidChange(() => debouncedCheck('Template package.json change'));
    context.subscriptions.push(templatePackageWatcher);
  } else {
    updateStatusBar(statusBarItem, 'error', 'Not in a Vite Powerflow workspace.');
  }
}

export function deactivate() {
  statusBarItem.dispose();
  outputChannel.dispose();
}

async function runSyncChecks() {
  const startTime = Date.now();
  outputBuffer = [];
  const logLine = `[${new Date().toISOString()}] Running sync checks...`;
  outputChannel.appendLine('---');
  outputChannel.appendLine(logLine);
  outputBuffer.push('---', logLine);

  try {
    const workspaceRoot = getWorkspaceRoot();
    if (!workspaceRoot) {
      updateStatusBar(statusBarItem, 'error', 'Not in a Vite Powerflow workspace.');
      return;
    }

    const [starterResult, cliResult] = await Promise.all([
      checkStarterStatus(workspaceRoot, outputChannel, outputBuffer),
      checkCliStatus(workspaceRoot, outputChannel, outputBuffer),
    ]);

    const allResults = [starterResult, cliResult];
    const finalStatus = allResults.some(r => r.status === 'error')
      ? 'error'
      : allResults.some(r => r.status === 'warning')
        ? 'warning'
        : 'sync';

    const tooltip = `Starter: ${starterResult.message} | CLI: ${cliResult.message}`;
    updateStatusBar(statusBarItem, finalStatus, tooltip);

    await handleSyncResults(starterResult, cliResult, outputChannel);
  } catch (error: any) {
    const errorLog = `❌ Error during sync checks: ${error.message}`;
    outputChannel.appendLine(errorLog);
    outputBuffer.push(errorLog);
    updateStatusBar(statusBarItem, 'error', 'Error during sync checks.');
  } finally {
    const duration = (Date.now() - startTime) / 1000;
    outputChannel.appendLine(`✅ Checks completed in ${duration.toFixed(2)}s.`);
    outputBuffer.push(`✅ Checks completed in ${duration.toFixed(2)}s.`);
    lastCheckResult = outputBuffer.join('\n');
  }
}
