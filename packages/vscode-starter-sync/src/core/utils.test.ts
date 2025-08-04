import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as vscode from 'vscode';

import { createDebounced, createWatcher } from './utils.js';

describe('createDebounced', () => {
  it('should debounce calls and only call the function once after delay', async () => {
    const fn = vi.fn();
    const debounced = createDebounced(fn, 50);
    debounced('a');
    debounced('b');
    debounced('c');
    expect(fn).not.toHaveBeenCalled();
    await new Promise(res => setTimeout(res, 70));
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('c');
  });
});

describe('createWatcher', () => {
  let originalWorkspace: any;
  beforeEach(() => {
    // Save and mock vscode.workspace
    originalWorkspace = { ...vscode.workspace };
    (vscode as any).workspace = { ...vscode.workspace };
    (vscode.workspace as any).createFileSystemWatcher = vi.fn();
  });
  afterEach(() => {
    // Restore vscode.workspace
    (vscode as any).workspace = originalWorkspace;
  });

  it('should register watcher and call onChange for each event', () => {
    const context = { subscriptions: [] } as unknown as vscode.ExtensionContext;
    const pattern = {} as vscode.RelativePattern;
    const watcherMock = {
      onDidChange: vi.fn(),
      onDidCreate: vi.fn(),
      onDidDelete: vi.fn(),
    };
    (vscode.workspace.createFileSystemWatcher as any).mockReturnValue(watcherMock);
    const onChange = vi.fn();
    createWatcher(pattern, onChange, context);
    expect(watcherMock.onDidChange).toHaveBeenCalled();
    expect(watcherMock.onDidCreate).toHaveBeenCalled();
    expect(watcherMock.onDidDelete).toHaveBeenCalled();
    expect(context.subscriptions).toContain(watcherMock);
  });
});
