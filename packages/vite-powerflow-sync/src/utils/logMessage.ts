import * as vscode from 'vscode';

/**
 * Logs a message to both output channel and buffer
 */
export function logMessage(outputChannel: vscode.OutputChannel, message: string): void {
  outputChannel.appendLine(message);
}
