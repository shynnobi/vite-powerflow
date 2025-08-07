import * as vscode from 'vscode';

import { CheckResult, SyncStatus } from '../core/syncTypes.js';

export function getGlobalStatus(statuses: SyncStatus[]): SyncStatus {
  if (statuses.includes('error')) return 'error';
  if (statuses.includes('warning')) return 'warning';
  if (statuses.includes('pending')) return 'pending';
  return 'sync';
}

export function updateStatusBar(
  statusBarItem: vscode.StatusBarItem,
  status: SyncStatus,
  tooltip: string
) {
  let icon: string;
  let color: vscode.ThemeColor | undefined;
  let stateLabel: SyncStatus;

  switch (status) {
    case 'sync':
      icon = '$(check)';
      color = undefined;
      stateLabel = 'sync';
      break;
    case 'pending':
      icon = '$(rocket)';
      color = undefined;
      stateLabel = 'pending';
      break;
    case 'warning':
      icon = '$(warning)';
      color = new vscode.ThemeColor('statusBarItem.warningBackground');
      stateLabel = 'warning';
      break;
    case 'error':
      icon = '$(error)';
      color = new vscode.ThemeColor('statusBarItem.errorBackground');
      stateLabel = 'error';
      break;
  }
  const formattedLabel = stateLabel.charAt(0).toUpperCase() + stateLabel.slice(1).toLowerCase();
  statusBarItem.text = `${icon} Vite Powerflow: ${formattedLabel}`;
  statusBarItem.tooltip = tooltip;
  statusBarItem.backgroundColor = color;
  statusBarItem.show();
}

export function handleSyncResults(
  starterResult: CheckResult,
  cliResult: CheckResult,
  outputChannel: vscode.OutputChannel
) {
  const statuses: SyncStatus[] = [starterResult.status, cliResult.status];
  const globalStatus = getGlobalStatus(statuses);
  const packagesWithUnreleasedChanges = [starterResult, cliResult].filter(r => r.commitCount > 0);
  const packagesWithPendingReleases = [starterResult, cliResult].filter(
    r => r.status === 'pending'
  );

  const statusLines: string[] = [];

  if (starterResult.status === 'error') {
    statusLines.push(`[Starter]: Check failed - ${starterResult.message}`);
  } else if (starterResult.status === 'warning') {
    const versionInfo = starterResult.packageVersion ? ` (v${starterResult.packageVersion})` : '';
    statusLines.push(`[Starter]: ${starterResult.message}${versionInfo}`);
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

  if (cliResult.status === 'error') {
    statusLines.push(`[CLI]: Check failed - ${cliResult.message}`);
  } else if (cliResult.status === 'warning') {
    const versionInfo = cliResult.packageVersion ? ` (v${cliResult.packageVersion})` : '';
    statusLines.push(`[CLI]: ${cliResult.message}${versionInfo}`);
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

  statusLines.push('———');

  statusLines.forEach(line => {
    outputChannel.appendLine(line);
  });
}
