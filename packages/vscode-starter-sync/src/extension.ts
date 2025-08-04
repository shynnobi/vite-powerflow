import * as vscode from 'vscode';

import { checkCliStatus, checkStarterStatus } from './core/sync/checker.js';
import { createRefreshStatusBar } from './core/ui/refresh.js';
import { handleSyncResults, updateStatusBar } from './core/ui/statusbar.js';
import { createDebounced, createWatcher } from './core/utils.js';
import { getWorkspaceRoot } from './core/workspace.js';

let outputChannel: vscode.OutputChannel;
let statusBarItem: vscode.StatusBarItem;
let isChecking = false;

const COMMAND_ID = 'vitePowerflow.runSyncCheck';

export function activate(context: vscode.ExtensionContext) {
  outputChannel = vscode.window.createOutputChannel('Vite Powerflow');
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBarItem.command = COMMAND_ID;
  statusBarItem.tooltip = 'Show sync status and re-run check';
  context.subscriptions.push(statusBarItem);

  createRefreshStatusBar(context, () => runSyncChecks(true));

  const runSyncCheckCommand = vscode.commands.registerCommand(COMMAND_ID, () => {
    // Just show the output channel, don't run a new sync
    // The refresh button is there for running new syncs
    outputChannel.show(true);
  });

  context.subscriptions.push(runSyncCheckCommand);

  const workspaceRoot = getWorkspaceRoot();
  if (workspaceRoot) {
    const debouncedCheck = createDebounced((trigger: string) => {
      outputChannel.appendLine(`[${trigger}] Triggering sync check...`);
      runSyncChecks();
    }, 1000);

    debouncedCheck('Activation');

    createWatcher(
      new vscode.RelativePattern(workspaceRoot, '.git/HEAD'),
      (uri, event) => {
        outputChannel.appendLine(`🔍 Git HEAD ${event}: ${uri.fsPath}`);
        debouncedCheck('HEAD change');
      },
      context
    );
    createWatcher(
      new vscode.RelativePattern(workspaceRoot, '.git/refs/heads/**'),
      (uri, event) => {
        outputChannel.appendLine(`🔍 Git refs ${event}: ${uri.fsPath}`);
        debouncedCheck(event === 'created' ? 'Branch creation' : 'Branch commit');
      },
      context
    );
    createWatcher(
      new vscode.RelativePattern(workspaceRoot, 'packages/cli/package.json'),
      (uri, event) => {
        outputChannel.appendLine(`🔍 CLI package.json ${event}: ${uri.fsPath}`);
        debouncedCheck('CLI package.json change');
      },
      context
    );
    createWatcher(
      new vscode.RelativePattern(workspaceRoot, 'packages/cli/template/package.json'),
      (uri, event) => {
        outputChannel.appendLine(`🔍 Template package.json ${event}: ${uri.fsPath}`);
        debouncedCheck('Template package.json change');
      },
      context
    );
  } else {
    updateStatusBar(statusBarItem, 'error', 'Not in a Vite Powerflow workspace.');
  }
}

export function deactivate() {
  statusBarItem.dispose();
  outputChannel.dispose();
}

async function runSyncChecks(forceRun = false) {
  if (isChecking && !forceRun) {
    outputChannel.appendLine('Sync check already running, skipping duplicate trigger.');
    return;
  }
  isChecking = true;
  const logLine = `[${new Date().toLocaleTimeString()}] Running sync checks...`;
  outputChannel.appendLine('---');
  outputChannel.appendLine(logLine);

  try {
    const workspaceRoot = getWorkspaceRoot();
    if (!workspaceRoot) {
      updateStatusBar(statusBarItem, 'error', 'Not in a Vite Powerflow workspace.');
      return;
    }

    const starterResult = await checkStarterStatus(workspaceRoot, outputChannel);
    const cliResult = await checkCliStatus(workspaceRoot, outputChannel);

    outputChannel.show(true);

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
    updateStatusBar(statusBarItem, 'error', 'Error during sync checks.');
  } finally {
    isChecking = false;
  }
}
