import * as vscode from 'vscode';

export function showInfo(message: string): Thenable<string | undefined> {
  return vscode.window.showInformationMessage(message);
}

export function showWarning(message: string): Thenable<string | undefined> {
  return vscode.window.showWarningMessage(message);
}

export function showError(message: string): Thenable<string | undefined> {
  return vscode.window.showErrorMessage(message);
}
