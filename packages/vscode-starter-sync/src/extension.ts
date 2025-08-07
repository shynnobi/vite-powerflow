import * as vscode from 'vscode';

import { formatSyncOutput } from './core/formatting.js';
import { checkCliStatus, checkStarterStatus } from './core/sync/checker.js';
import { createRefreshStatusBar } from './core/ui/refresh.js';
import { updateStatusBar } from './core/ui/statusbar.js';
import { createDebounced, createWatcher } from './core/utils.js';
import { getWorkspaceRoot } from './core/workspace.js';
import { PackageLabel, SyncStatus } from './types.js';

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

  createRefreshStatusBar(context, () => {
    return runSyncChecks(true);
  });

  const runSyncCheckCommand = vscode.commands.registerCommand(COMMAND_ID, () => {
    // Ensure we always show the output channel when running the command
    outputChannel.show();
  });

  context.subscriptions.push(runSyncCheckCommand);

  const workspaceRoot = getWorkspaceRoot();
  if (workspaceRoot) {
    const debouncedCheck = createDebounced((_trigger: string) => {
      void runSyncChecks();
    }, 1000);

    void debouncedCheck('Activation');

    createWatcher(
      new vscode.RelativePattern(workspaceRoot, '.git/HEAD'),
      (_uri, _event) => {
        debouncedCheck('HEAD change');
      },
      context
    );
    createWatcher(
      new vscode.RelativePattern(workspaceRoot, '.git/refs/heads/**'),
      (_uri, event) => {
        debouncedCheck(event === 'created' ? 'Branch creation' : 'Branch commit');
      },
      context
    );
    createWatcher(
      new vscode.RelativePattern(workspaceRoot, 'packages/cli/package.json'),
      (_uri, _event) => {
        debouncedCheck('CLI package.json change');
      },
      context
    );
    createWatcher(
      new vscode.RelativePattern(workspaceRoot, 'packages/cli/template/package.json'),
      (_uri, _event) => {
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

  try {
    const workspaceRoot = getWorkspaceRoot();
    if (!workspaceRoot) {
      updateStatusBar(statusBarItem, 'error', 'Not in a Vite Powerflow workspace.');
      return;
    }

    const starterResult = await checkStarterStatus(workspaceRoot, outputChannel);
    const cliResult = await checkCliStatus(workspaceRoot, outputChannel);

    const allResults = [starterResult, cliResult];

    // Determine final status with proper logic:
    // - error: if any package has an error
    // - pending: if ALL packages with unreleased changes have changesets
    // - warning: if ANY package has unreleased changes without a changeset
    // - sync: if all packages are in sync

    let finalStatus: SyncStatus;
    if (allResults.some(r => r.status === 'error')) {
      finalStatus = 'error';
    } else {
      // Check if we have any packages with unreleased changes
      const packagesWithChanges = allResults.filter(
        r => r.commitCount > 0 || r.status === 'pending'
      );

      if (packagesWithChanges.length === 0) {
        // No changes at all
        finalStatus = 'sync';
      } else {
        // We have changes, check if ALL have changesets
        const allHaveChangesets = packagesWithChanges.every(r => r.status === 'pending');
        finalStatus = allHaveChangesets ? 'pending' : 'warning';
      }
    }

    // Simple tooltip - detailed info is in output channel
    updateStatusBar(statusBarItem, finalStatus, 'Click to view sync status');

    // Format and display sync output using centralized formatting
    const syncResults = [
      { label: PackageLabel.Starter, result: starterResult },
      { label: PackageLabel.Cli, result: cliResult },
    ];

    const outputLines = formatSyncOutput(syncResults);
    outputLines.forEach(line => outputChannel.appendLine(line));
  } catch (error: unknown) {
    const errorLog = `❌ Error during sync checks: ${(error as Error).message || String(error)}`;
    outputChannel.appendLine(errorLog);
    updateStatusBar(statusBarItem, 'error', 'Error during sync checks.');
  } finally {
    isChecking = false;
  }
}
