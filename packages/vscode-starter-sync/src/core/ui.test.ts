import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as vscode from 'vscode';

import { handleSyncResults, updateStatusBar } from './ui.js';

const createMockStatusBarItem = () => ({
  text: '',
  tooltip: '',
  backgroundColor: undefined,
  show: vi.fn(),
});

describe('ui', () => {
  it('should export functions', () => {
    expect(typeof updateStatusBar).toBe('function');
    expect(typeof handleSyncResults).toBe('function');
  });
});

describe('updateStatusBar', () => {
  beforeEach(() => {
    // Mock ThemeColor constructor
    (vscode as any).ThemeColor = vi.fn().mockImplementation((id: string) => ({ id }));
  });
  it('sets correct icon, color, and tooltip for sync', () => {
    const item = createMockStatusBarItem();
    updateStatusBar(item as any, 'sync', 'All good');
    expect(item.text).toContain('check');
    expect(item.tooltip).toBe('All good');
    expect(item.backgroundColor).toEqual({ id: 'statusBarItem.prominentBackground' });
    expect(item.show).toHaveBeenCalled();
  });
  it('sets correct icon, color, and tooltip for warning', () => {
    const item = createMockStatusBarItem();
    updateStatusBar(item as any, 'warning', 'Be careful');
    expect(item.text).toContain('warning');
    expect(item.tooltip).toBe('Be careful');
    expect(item.backgroundColor).toEqual({ id: 'statusBarItem.warningBackground' });
    expect(item.show).toHaveBeenCalled();
  });
  it('sets correct icon, color, and tooltip for error', () => {
    const item = createMockStatusBarItem();
    updateStatusBar(item as any, 'error', 'Something failed');
    expect(item.text).toContain('error');
    expect(item.tooltip).toBe('Something failed');
    expect(item.backgroundColor).toEqual({ id: 'statusBarItem.errorBackground' });
    expect(item.show).toHaveBeenCalled();
  });
});

describe('handleSyncResults', () => {
  let showWarningMessage: any;
  let createTerminal: any;
  let outputChannel: any;
  beforeEach(() => {
    // Mock vscode.window and its methods
    (vscode as any).window = {
      showWarningMessage: vi.fn(),
      createTerminal: vi.fn().mockReturnValue({ sendText: vi.fn(), show: vi.fn() }),
    };
    showWarningMessage = (vscode as any).window.showWarningMessage;
    createTerminal = (vscode as any).window.createTerminal;
    outputChannel = {
      show: vi.fn(),
      appendLine: vi.fn(),
    };
  });
  it('shows warning and opens terminal if user selects Create Changeset', async () => {
    showWarningMessage.mockResolvedValue('Create Changeset');
    await handleSyncResults(
      { commitCount: 1, status: 'warning', message: '' },
      { commitCount: 0, status: 'sync', message: '' },
      outputChannel
    );
    expect(showWarningMessage).toHaveBeenCalledWith(
      expect.stringContaining('unreleased change'),
      'Create Changeset',
      'Show Details'
    );
    expect(createTerminal).toHaveBeenCalled();
  });
  it('shows warning and shows outputChannel if user selects Show Details', async () => {
    showWarningMessage.mockResolvedValue('Show Details');
    await handleSyncResults(
      { commitCount: 0, status: 'sync', message: '' },
      { commitCount: 2, status: 'warning', message: '' },
      outputChannel
    );
    expect(showWarningMessage).toHaveBeenCalledWith(
      expect.stringContaining('unreleased change'),
      'Create Changeset',
      'Show Details'
    );
    expect(outputChannel.show).toHaveBeenCalledWith(true);
  });
  it('does nothing if user dismisses the warning', async () => {
    showWarningMessage.mockResolvedValue(undefined);
    await handleSyncResults(
      { commitCount: 1, status: 'warning', message: '' },
      { commitCount: 1, status: 'warning', message: '' },
      outputChannel
    );
    expect(outputChannel.show).not.toHaveBeenCalled();
    expect(createTerminal).not.toHaveBeenCalled();
  });
});
