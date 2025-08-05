import * as vscode from 'vscode';

import { CheckResult, SyncStatus } from '../../types.js';

/**
 * Updates the VS Code status bar with the current sync status and tooltip.
 * @param statusBarItem - The status bar item to update
 * @param status - The sync status ('sync', 'warning', 'error', 'pending')
 * @param tooltip - Tooltip text to display
 */
export function updateStatusBar(
  statusBarItem: vscode.StatusBarItem,
  status: SyncStatus,
  tooltip: string
) {
  let icon: string;
  let color: vscode.ThemeColor | undefined;

  switch (status) {
    case 'sync':
      icon = '$(check)';
      color = new vscode.ThemeColor('statusBarItem.prominentBackground');
      break;
    case 'pending':
      icon = '$(clock)';
      color = new vscode.ThemeColor('statusBarItem.debuggingBackground');
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

/**
 * Handles the result of sync checks and prompts the user for actions if needed.
 * Shows a warning message if unreleased changes are detected and offers to create a changeset.
 * @param starterResult - The result of the starter sync check
 * @param cliResult - The result of the CLI sync check
 * @param outputChannel - The VS Code output channel for logging
 */
export async function handleSyncResults(
  starterResult: CheckResult,
  cliResult: CheckResult,
  outputChannel: vscode.OutputChannel
) {
  const hasErrors = starterResult.status === 'error' || cliResult.status === 'error';
  const packagesWithUnreleasedChanges = [starterResult, cliResult].filter(r => r.commitCount > 0);
  const packagesWithPendingReleases = [starterResult, cliResult].filter(
    r => r.status === 'pending'
  );

  // Package status lines
  const statusLines: string[] = [];

  // Starter status
  if (starterResult.status === 'error') {
    statusLines.push(`[Starter]: Check failed - ${starterResult.message}`);
  } else if (starterResult.status === 'pending' && starterResult.changeset) {
    const versionInfo = starterResult.packageVersion ? ` (v${starterResult.packageVersion})` : '';
    statusLines.push(
      `[Starter]: Package has a pending ${starterResult.changeset.bumpType} release${versionInfo} (${starterResult.changeset.fileName})`
    );
  } else if (starterResult.commitCount > 0) {
    const versionInfo = starterResult.packageVersion ? ` (v${starterResult.packageVersion})` : '';
    statusLines.push(
      `[Starter]: Found ${starterResult.commitCount} unreleased commit(s)${versionInfo}.`
    );
  } else {
    const versionInfo = starterResult.packageVersion ? ` (v${starterResult.packageVersion})` : '';
    const commitInfo = starterResult.baselineCommit
      ? ` - baseline ${starterResult.baselineCommit.substring(0, 7)}`
      : '';
    statusLines.push(`[Starter]: Package in sync${versionInfo}${commitInfo}`);
  }

  // CLI status
  if (cliResult.status === 'error') {
    statusLines.push(`[CLI]: Check failed - ${cliResult.message}`);
  } else if (cliResult.status === 'pending' && cliResult.changeset) {
    const versionInfo = cliResult.packageVersion ? ` (v${cliResult.packageVersion})` : '';
    statusLines.push(
      `[CLI]: Package has a pending ${cliResult.changeset.bumpType} release${versionInfo} (${cliResult.changeset.fileName})`
    );
  } else if (cliResult.commitCount > 0) {
    const versionInfo = cliResult.packageVersion ? ` (v${cliResult.packageVersion})` : '';
    statusLines.push(`[CLI]: Found ${cliResult.commitCount} unreleased commit(s)${versionInfo}.`);
  } else {
    const versionInfo = cliResult.packageVersion ? ` (v${cliResult.packageVersion})` : '';
    const commitInfo = cliResult.baselineCommit
      ? ` - baseline ${cliResult.baselineCommit.substring(0, 7)}`
      : '';
    statusLines.push(`[CLI]: Package in sync${versionInfo}${commitInfo}`);
  }

  // Separator
  statusLines.push('———');

  // Final status message
  if (hasErrors) {
    statusLines.push('❌ Some checks failed - fix errors to get accurate status.');
  } else if (packagesWithPendingReleases.length > 0) {
    // If ANY package has a pending release, show pending status
    statusLines.push('⏳ Ready for release. Merge to main to publish automatically.');
  } else if (packagesWithUnreleasedChanges.length === 0) {
    statusLines.push('✅ Everything in sync.');
  } else {
    // Some packages need changesets
    const needChangesets: string[] = [];
    const inSync: string[] = [];

    if (starterResult.commitCount > 0 && starterResult.status !== 'pending') {
      needChangesets.push('Starter');
    } else if (starterResult.commitCount === 0) {
      inSync.push('Starter');
    }

    if (cliResult.commitCount > 0 && cliResult.status !== 'pending') {
      needChangesets.push('CLI');
    } else if (cliResult.commitCount === 0) {
      inSync.push('CLI');
    }

    let message = '⚠️ ';
    if (needChangesets.length > 0) {
      message += `${needChangesets.join(' and ')} package${needChangesets.length > 1 ? 's' : ''} require${needChangesets.length === 1 ? 's' : ''} a changeset.`;
    }
    if (inSync.length > 0) {
      message += ` ${inSync.join(' and ')} in sync.`;
    }
    statusLines.push(message);
  }

  // Output everything
  statusLines.forEach(line => {
    outputChannel.appendLine(line);
  });
}
