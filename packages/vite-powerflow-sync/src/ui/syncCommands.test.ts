import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as vscode from 'vscode';

import { createMockCommand, createMockContext, createMockStatusBarItem } from '../utils/testUtils';
import { createRefreshStatusBar } from './syncCommands';

// Mock VS Code API
vi.mock('vscode', async () => {
  const actual = await vi.importActual('vscode');
  return {
    ...actual,
    StatusBarAlignment: {
      Left: 1,
      Right: 2,
    },
    window: {
      createStatusBarItem: vi.fn(),
    },
    commands: {
      registerCommand: vi.fn(),
    },
  };
});

describe('syncCommands', () => {
  let mockContext: vscode.ExtensionContext;
  let mockStatusBarItem: vscode.StatusBarItem;
  let mockCommand: vscode.Disposable;

  beforeEach(() => {
    vi.clearAllMocks();

    mockStatusBarItem = createMockStatusBarItem() as any;
    mockCommand = createMockCommand();
    mockContext = createMockContext();

    // Mock VS Code API
    (vscode.window.createStatusBarItem as any).mockReturnValue(mockStatusBarItem);
    (vscode.commands.registerCommand as any).mockReturnValue(mockCommand);
  });

  describe('createRefreshStatusBar', () => {
    it('should create and configure refresh status bar item', () => {
      const onRefresh = vi.fn();

      createRefreshStatusBar(mockContext, onRefresh);

      expect(vscode.window.createStatusBarItem).toHaveBeenCalledWith(
        vscode.StatusBarAlignment.Left,
        98
      );
      expect(mockStatusBarItem.text).toBe('$(refresh)');
      expect(mockStatusBarItem.tooltip).toBe('Refresh Vite Powerflow sync status');
      expect(mockStatusBarItem.command).toBe('vitePowerflow.refreshSyncCheck');
      expect(mockStatusBarItem.show).toHaveBeenCalled();
    });

    it('should register refresh command', () => {
      const onRefresh = vi.fn();
      createRefreshStatusBar(mockContext, onRefresh);
      expect(vscode.commands.registerCommand).toHaveBeenCalledWith(
        'vitePowerflow.refreshSyncCheck',
        expect.any(Function)
      );
    });

    it('should add items to context subscriptions', () => {
      const onRefresh = vi.fn();
      createRefreshStatusBar(mockContext, onRefresh);
      expect(mockContext.subscriptions).toContain(mockStatusBarItem);
      expect(mockContext.subscriptions).toContain(mockCommand);
      expect(mockContext.subscriptions).toHaveLength(2);
    });

    it('should call onRefresh when command is executed', () => {
      const onRefresh = vi.fn();
      createRefreshStatusBar(mockContext, onRefresh);
      const commandCallback = (vscode.commands.registerCommand as any).mock.calls[0][1];
      commandCallback();
      expect(onRefresh).toHaveBeenCalledOnce();
    });
  });
});
