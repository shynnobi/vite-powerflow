import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as vscode from 'vscode';

import { handleSyncResults, updateStatusBar } from './statusbar.js';

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

  it('sets correct icon, color, and tooltip for pending', () => {
    const item = createMockStatusBarItem();
    updateStatusBar(item as any, 'pending', 'Release pending');
    expect(item.text).toContain('clock');
    expect(item.tooltip).toBe('Release pending');
    expect(item.backgroundColor).toEqual({ id: 'statusBarItem.debuggingBackground' });
    expect(item.show).toHaveBeenCalled();
  });
});

describe('handleSyncResults', () => {
  let outputChannel: any;
  beforeEach(() => {
    outputChannel = {
      show: vi.fn(),
      appendLine: vi.fn(),
    };
  });
  it('shows summary with unreleased changes requiring changeset', async () => {
    await handleSyncResults(
      { commitCount: 1, status: 'warning', message: '' },
      { commitCount: 0, status: 'sync', message: '' },
      outputChannel
    );

    expect(outputChannel.appendLine).toHaveBeenCalledWith(
      '[Starter]: Found 1 unreleased commit(s).'
    );
    expect(outputChannel.appendLine).toHaveBeenCalledWith('[CLI]: Package in sync');
    expect(outputChannel.appendLine).toHaveBeenCalledWith('———');
    expect(outputChannel.appendLine).toHaveBeenCalledWith(
      '⚠️ Starter package requires a changeset. CLI in sync.'
    );
  });

  it('shows summary with multiple unreleased changes', async () => {
    await handleSyncResults(
      { commitCount: 0, status: 'sync', message: '' },
      { commitCount: 2, status: 'warning', message: '' },
      outputChannel
    );

    expect(outputChannel.appendLine).toHaveBeenCalledWith('[Starter]: Package in sync');
    expect(outputChannel.appendLine).toHaveBeenCalledWith('[CLI]: Found 2 unreleased commit(s).');
    expect(outputChannel.appendLine).toHaveBeenCalledWith('———');
    expect(outputChannel.appendLine).toHaveBeenCalledWith(
      '⚠️ CLI package requires a changeset. Starter in sync.'
    );
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
    expect(outputChannel.appendLine).toHaveBeenCalledWith('✅ Everything in sync.');
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
    expect(outputChannel.appendLine).toHaveBeenCalledWith(
      '⏳ Ready for release. Merge to main to publish automatically.'
    );
  });
});
