import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as vscode from 'vscode';

import { createMockCommand, createMockContext, createMockStatusBarItem } from '../../test-utils.js';
import { createRefreshStatusBar } from './refresh.js';

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

describe('refresh', () => {
  let mockContext: vscode.ExtensionContext;
  let mockStatusBarItem: vscode.StatusBarItem;
  let mockCommand: vscode.Disposable;

  beforeEach(() => {
    vi.clearAllMocks();

    mockStatusBarItem = createMockStatusBarItem();
    mockCommand = createMockCommand();
    mockContext = createMockContext();

    // Mock VS Code API
    (vscode.window.createStatusBarItem as any).mockReturnValue(mockStatusBarItem);
    (vscode.commands.registerCommand as any).mockReturnValue(mockCommand);
  });

  describe('createRefreshStatusBar', () => {
    it('should create and configure refresh status bar item', () => {
      // GIVEN: A valid extension context and refresh callback
      const onRefresh = vi.fn();

      // WHEN: Creating the refresh status bar
      createRefreshStatusBar(mockContext, onRefresh);

      // THEN: Status bar item is created with correct configuration
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
      // GIVEN: A valid extension context and refresh callback
      const onRefresh = vi.fn();

      // WHEN: Creating the refresh status bar
      createRefreshStatusBar(mockContext, onRefresh);

      // THEN: Refresh command is registered with VS Code
      expect(vscode.commands.registerCommand).toHaveBeenCalledWith(
        'vitePowerflow.refreshSyncCheck',
        expect.any(Function)
      );
    });

    it('should add items to context subscriptions', () => {
      // GIVEN: A valid extension context and refresh callback
      const onRefresh = vi.fn();

      // WHEN: Creating the refresh status bar
      createRefreshStatusBar(mockContext, onRefresh);

      // THEN: Both status bar item and command are added to subscriptions
      expect(mockContext.subscriptions).toContain(mockStatusBarItem);
      expect(mockContext.subscriptions).toContain(mockCommand);
      expect(mockContext.subscriptions).toHaveLength(2);
    });

    it('should call onRefresh when command is executed', () => {
      // GIVEN: A refresh status bar is created with callback
      const onRefresh = vi.fn();
      createRefreshStatusBar(mockContext, onRefresh);

      // WHEN: The refresh command is executed
      const commandCallback = (vscode.commands.registerCommand as any).mock.calls[0][1];
      commandCallback();

      // THEN: The provided onRefresh callback is invoked
      expect(onRefresh).toHaveBeenCalledOnce();
    });
  });
});
