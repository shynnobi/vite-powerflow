import * as vscode from 'vscode';

export function createRefreshStatusBar(context: vscode.ExtensionContext, onRefresh: () => void) {
  const refreshItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 98);
  refreshItem.text = '$(refresh)';
  refreshItem.tooltip = 'Refresh Vite Powerflow sync status';
  refreshItem.command = 'vitePowerflow.refreshSyncCheck';
  refreshItem.show();
  context.subscriptions.push(refreshItem);

  const refreshCommand = vscode.commands.registerCommand('vitePowerflow.refreshSyncCheck', () => {
    onRefresh();
  });
  context.subscriptions.push(refreshCommand);
}
