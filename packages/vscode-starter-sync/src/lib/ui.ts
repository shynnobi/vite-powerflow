import * as vscode from 'vscode';

import { CheckResult, Status } from './types.js';

export function updateStatusBar(
  statusBarItem: vscode.StatusBarItem,
  status: Status,
  tooltip: string
) {
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

export async function handleSyncResults(
  starterResult: CheckResult,
  cliResult: CheckResult,
  outputChannel: vscode.OutputChannel
) {
  const totalUnreleasedCommits = starterResult.commitCount + cliResult.commitCount;

  if (totalUnreleasedCommits > 0) {
    const messages = [];
    if (starterResult.commitCount > 0) {
      messages.push(`'starter' app has ${starterResult.commitCount} unreleased change(s).`);
    }
    if (cliResult.commitCount > 0) {
      messages.push(`'CLI' package has ${cliResult.commitCount} unreleased change(s).`);
    }
    const fullMessage = `${messages.join(' ')} A changeset is required.`;

    const selection = await vscode.window.showWarningMessage(
      fullMessage,
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
  }
}
