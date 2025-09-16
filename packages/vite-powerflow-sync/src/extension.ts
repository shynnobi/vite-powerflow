import * as vscode from 'vscode';

import { runAllSyncChecks } from './core/syncChecker';
import { formatSyncOutput, getAllMonitoredPackages } from './core/syncReporter';
import { CheckResult, LabeledCheckResult, SyncStatus } from './core/types';
import { detectWorkspaceRoot } from './core/workspaceDetector';
import { updateStatusBar } from './ui/statusBarController';
import { createRefreshStatusBar } from './ui/syncCommands';
import { createDebounced, createWatcher } from './utils/extensionUtils';
import { reportSyncOutput } from './utils/outputReporter';

let outputChannel: vscode.OutputChannel;
let statusBarItem: vscode.StatusBarItem;
let isChecking = false;
let debugMode = false;

const COMMAND_ID = 'vitePowerflow.runSyncCheck';

export async function activate(context: vscode.ExtensionContext) {
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

  const toggleDebugCommand = vscode.commands.registerCommand(
    'vitePowerflow.toggleDebugMode',
    () => {
      debugMode = !debugMode;
      const message = debugMode ? 'Debug mode enabled' : 'Debug mode disabled';
      vscode.window.showInformationMessage(`Vite Powerflow: ${message}`);
      outputChannel.appendLine(`🔧 ${message}`);
    }
  );

  context.subscriptions.push(runSyncCheckCommand, toggleDebugCommand);

  try {
    const workspaceRoot = detectWorkspaceRoot();
    if (workspaceRoot) {
      const debouncedCheck = createDebounced((_trigger: string) => {
        void runSyncChecks();
      }, 1000);

      void debouncedCheck('Activation');

      // Create watchers based on the syncConfig from package.json files
      const monitoredPackages = await getAllMonitoredPackages(workspaceRoot, outputChannel);
      const packagePaths = monitoredPackages.map(p => p.pkgPath);

      packagePaths.forEach(pkgPath => {
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
        (_uri, _event) => {
          debouncedCheck(_event === 'created' ? 'Branch creation' : 'Branch commit');
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
        r => r.commitCount > 0 || r.status === 'pending' || r.status === 'dependency-pending'
      );

      if (packagesWithChanges.length === 0) {
        // No changes at all
        finalStatus = 'sync';
      } else {
        // We have changes, check if ALL have changesets or will be updated by dependency
        const allHaveChangesets = packagesWithChanges.every(
          r => r.status === 'pending' || r.status === 'dependency-pending'
        );
        finalStatus = allHaveChangesets ? 'pending' : 'warning';
      }
    }

    // Simple tooltip - detailed info is in output channel
    updateStatusBar(statusBarItem, finalStatus, 'Click to view sync status');

    // Format and display sync output using centralized formatting
    const outputLines = await formatSyncOutput(labeledResults, workspaceRoot);
    reportSyncOutput(outputChannel, outputLines);
  } catch (error: unknown) {
    const errorLog = `❌ Error during sync checks: ${(error as Error).message || String(error)}`;
    outputChannel.appendLine(errorLog);
    updateStatusBar(statusBarItem, 'error', 'Error during sync checks.');
  } finally {
    isChecking = false;
  }
}
