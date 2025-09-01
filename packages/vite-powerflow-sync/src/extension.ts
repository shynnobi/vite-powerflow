import * as vscode from 'vscode';

import { MONITORED_NPM_PACKAGES } from './config/monitoredPackages.js';
import { runAllSyncChecks } from './core/syncChecker.js';
import { formatSyncOutput } from './core/syncReporter.js';
import { CheckResult, LabeledCheckResult, SyncStatus } from './core/types.js';
import { detectWorkspaceRoot } from './core/workspaceDetector.js';
import { updateStatusBar } from './ui/statusBarController.js';
import { createRefreshStatusBar } from './ui/syncCommands.js';
import { createDebounced, createWatcher } from './utils/extensionUtils.js';
import { reportSyncOutput } from './utils/outputReporter.js';

let outputChannel: vscode.OutputChannel;
let statusBarItem: vscode.StatusBarItem;
let isChecking = false;

const COMMAND_ID = 'vitePowerflow.runSyncCheck';

export function activate(context: vscode.ExtensionContext) {
  outputChannel = vscode.window.createOutputChannel('Vite Powerflow Sync');
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

  try {
    const workspaceRoot = detectWorkspaceRoot();
    if (workspaceRoot) {
      const debouncedCheck = createDebounced((_trigger: string) => {
        void runSyncChecks();
      }, 1000);

      void debouncedCheck('Activation');

      // Create watchers based on the centralized configuration
      [
        ...MONITORED_NPM_PACKAGES.map(p => p.pkgPath),
        'packages/cli/template/package.json', // Special case for template
      ].forEach(pkgPath => {
        createWatcher(
          new vscode.RelativePattern(workspaceRoot, pkgPath),
          (_uri, _event) => {
            debouncedCheck(`${pkgPath} change`);
          },
          context
        );
      });

      // Standard git watchers
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
    } else {
      updateStatusBar(statusBarItem, 'error', 'Not in a Vite Powerflow workspace.');
    }
  } catch (error) {
    // Handle potential errors during activation, e.g., config loading
    const errorMessage = error instanceof Error ? error.message : String(error);
    updateStatusBar(statusBarItem, 'error', `Activation Error: ${errorMessage}`);
    outputChannel.appendLine(`Activation failed: ${errorMessage}`);
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
    const workspaceRoot = detectWorkspaceRoot();
    if (!workspaceRoot) {
      updateStatusBar(statusBarItem, 'error', 'Not in a Vite Powerflow workspace.');
      return;
    }

    const labeledResults: LabeledCheckResult[] = await runAllSyncChecks(
      workspaceRoot,
      outputChannel
    );
    const allResults: CheckResult[] = labeledResults.map(item => item.result);

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
    const outputLines = formatSyncOutput(labeledResults);
    reportSyncOutput(outputChannel, outputLines);
  } catch (error: unknown) {
    const errorLog = `❌ Error during sync checks: ${(error as Error).message || String(error)}`;
    outputChannel.appendLine(errorLog);
    updateStatusBar(statusBarItem, 'error', 'Error during sync checks.');
  } finally {
    isChecking = false;
  }
}
