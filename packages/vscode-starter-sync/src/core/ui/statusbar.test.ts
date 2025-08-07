import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as vscode from 'vscode';

import { createMockOutputChannel, createMockStatusBarItem } from '../../test-utils.js';
import { handleSyncResults, updateStatusBar } from './statusbar.js';

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
    expect(item.text).toBe('$(check) Vite Powerflow: Sync');
    expect(item.tooltip).toBe('All good');
    expect(item.backgroundColor).toBeUndefined();
    expect(item.show).toHaveBeenCalled();
  });
  it('sets correct icon, color, and tooltip for warning', () => {
    const item = createMockStatusBarItem();
    updateStatusBar(item as any, 'warning', 'Be careful');
    expect(item.text).toBe('$(warning) Vite Powerflow: Warning');
    expect(item.tooltip).toBe('Be careful');
    expect(item.backgroundColor).toEqual({ id: 'statusBarItem.warningBackground' });
    expect(item.show).toHaveBeenCalled();
  });
  it('sets correct icon, color, and tooltip for error', () => {
    const item = createMockStatusBarItem();
    updateStatusBar(item as any, 'error', 'Something failed');
    expect(item.text).toBe('$(error) Vite Powerflow: Error');
    expect(item.tooltip).toBe('Something failed');
    expect(item.backgroundColor).toEqual({ id: 'statusBarItem.errorBackground' });
    expect(item.show).toHaveBeenCalled();
  });

  it('sets correct icon and tooltip for pending', () => {
    const item = createMockStatusBarItem();
    updateStatusBar(item as any, 'pending', 'Release pending');
    expect(item.text).toBe('$(rocket) Vite Powerflow: Pending');
    expect(item.tooltip).toBe('Release pending');
    expect(item.backgroundColor).toBeUndefined();
    expect(item.show).toHaveBeenCalled();
  });
});

describe('handleSyncResults', () => {
  let outputChannel: any;
  beforeEach(() => {
    outputChannel = createMockOutputChannel();
  });
  it('shows summary with unreleased changes requiring changeset', async () => {
    await handleSyncResults(
      { commitCount: 1, status: 'warning', message: '' },
      { commitCount: 0, status: 'sync', message: '' },
      outputChannel
    );

    expect(outputChannel.appendLine).toHaveBeenCalledWith('[Starter]: ');
    expect(outputChannel.appendLine).toHaveBeenCalledWith('[CLI]: Package in sync');
    expect(outputChannel.appendLine).toHaveBeenCalledWith('———');
  });

  it('shows summary with multiple unreleased changes', async () => {
    await handleSyncResults(
      { commitCount: 0, status: 'sync', message: '' },
      { commitCount: 2, status: 'warning', message: '' },
      outputChannel
    );

    expect(outputChannel.appendLine).toHaveBeenCalledWith('[Starter]: Package in sync');
    expect(outputChannel.appendLine).toHaveBeenCalledWith('[CLI]: ');
    expect(outputChannel.appendLine).toHaveBeenCalledWith('———');
  });

  it('shows summary when all packages are in sync', async () => {
    await handleSyncResults(
      { commitCount: 0, status: 'sync', message: '' },
      { commitCount: 0, status: 'sync', message: '' },
      outputChannel
    );

    expect(outputChannel.appendLine).toHaveBeenCalledWith('[Starter]: Package in sync');
    expect(outputChannel.appendLine).toHaveBeenCalledWith('[CLI]: Package in sync');
    expect(outputChannel.appendLine).toHaveBeenCalledWith('———');
  });

  it('shows pending release when changeset is available', async () => {
    await handleSyncResults(
      { commitCount: 0, status: 'sync', message: '' },
      {
        commitCount: 0,
        status: 'pending',
        message: '',
        changeset: { fileName: 'test-changeset.md', bumpType: 'minor' },
        packageVersion: '1.0.5',
      },
      outputChannel
    );

    expect(outputChannel.appendLine).toHaveBeenCalledWith('[Starter]: Package in sync');
    expect(outputChannel.appendLine).toHaveBeenCalledWith(
      '[CLI]: Package has a pending minor release (v1.0.5) (test-changeset.md)'
    );
    expect(outputChannel.appendLine).toHaveBeenCalledWith('———');
  });
});
