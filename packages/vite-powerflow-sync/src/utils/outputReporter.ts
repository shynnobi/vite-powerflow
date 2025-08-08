import * as vscode from 'vscode';

/**
 * Writes a formatted sync report to the provided OutputChannel.
 */
export function reportSyncOutput(outputChannel: vscode.OutputChannel, lines: string[]): void {
  for (const line of lines) {
    outputChannel.appendLine(line);
  }
}
