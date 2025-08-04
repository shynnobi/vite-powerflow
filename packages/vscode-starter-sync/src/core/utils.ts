import * as vscode from 'vscode';

/**
 * Creates a VS Code file system watcher for the given pattern and registers event handlers.
 * Adds the watcher to the extension context's subscriptions for cleanup.
 * @param pattern - The file pattern to watch
 * @param onChange - Callback for change, create, and delete events
 * @param context - The VS Code extension context
 */
export function createWatcher(
  pattern: vscode.RelativePattern,
  onChange: (uri: vscode.Uri, event: string) => void,
  context: vscode.ExtensionContext
) {
  const watcher = vscode.workspace.createFileSystemWatcher(pattern);
  watcher.onDidChange(uri => onChange(uri, 'changed'));
  watcher.onDidCreate(uri => onChange(uri, 'created'));
  watcher.onDidDelete(uri => onChange(uri, 'deleted'));
  context.subscriptions.push(watcher);
}

/**
 * Returns a debounced version of the given function, delaying execution by the specified time.
 * Only the last call within the delay will be executed.
 * @param fn - The function to debounce
 * @param delay - The debounce delay in milliseconds
 * @returns A debounced function
 */
export function createDebounced<T extends any[]>(fn: (...args: T) => void, delay: number) {
  let timer: NodeJS.Timeout;
  return (...args: T) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Logs a message to both output channel and buffer
 */
export function logMessage(outputChannel: vscode.OutputChannel, message: string): void {
  outputChannel.appendLine(message);
}

/**
 * Formats a baseline (commit SHA or tag) for display in logs
 */
export function formatBaseline(baseline: string): string {
  // If baseline looks like a commit SHA, truncate it; otherwise, display as-is (tag)
  return /^[a-f0-9]{7,40}$/i.test(baseline) ? baseline.substring(0, 7) : baseline;
}
