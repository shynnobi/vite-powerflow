import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as vscode from 'vscode';

import { activate, deactivate } from './extension.js';
import { setupExtensionTestScenario, setupWorkspaceScenario } from './test-utils.js';

// Mock VS Code API
vi.mock('vscode', async () => {
  const actual = await vi.importActual('vscode');
  return {
    ...actual,
    StatusBarAlignment: {
      Left: 1,
      Right: 2,
    },
    RelativePattern: class {
      constructor(
        public _base: any,
        public _pattern: string
      ) {}
    },
    window: {
      createOutputChannel: vi.fn(),
      createStatusBarItem: vi.fn(),
    },
    commands: {
      registerCommand: vi.fn(),
    },
  };
});

// Mock dependencies
vi.mock('./core/sync/checker.js', () => ({
  checkCliStatus: vi.fn(),
  checkStarterStatus: vi.fn(),
}));
vi.mock('./core/ui/refresh.js', () => ({
  createRefreshStatusBar: vi.fn(),
}));
vi.mock('./core/ui/statusbar.js', () => ({
  handleSyncResults: vi.fn(),
  updateStatusBar: vi.fn(),
}));
vi.mock('./core/utils.js', () => ({
  createDebounced: vi.fn(),
  createWatcher: vi.fn(),
}));
vi.mock('./core/workspace.js', () => ({
  getWorkspaceRoot: vi.fn(),
}));

const mockCheckCliStatus = vi.mocked(await import('./core/sync/checker.js')).checkCliStatus;
const mockCheckStarterStatus = vi.mocked(await import('./core/sync/checker.js')).checkStarterStatus;
const mockCreateRefreshStatusBar = vi.mocked(
  await import('./core/ui/refresh.js')
).createRefreshStatusBar;
const mockHandleSyncResults = vi.mocked(await import('./core/ui/statusbar.js')).handleSyncResults;
const mockUpdateStatusBar = vi.mocked(await import('./core/ui/statusbar.js')).updateStatusBar;
const mockCreateDebounced = vi.mocked(await import('./core/utils.js')).createDebounced;
const mockCreateWatcher = vi.mocked(await import('./core/utils.js')).createWatcher;
const mockGetWorkspaceRoot = vi.mocked(await import('./core/workspace.js')).getWorkspaceRoot;

describe('extension', () => {
  let mockContext: vscode.ExtensionContext;
  let mockOutputChannel: vscode.OutputChannel;
  let mockStatusBarItem: vscode.StatusBarItem;
  let mockCommand: vscode.Disposable;

  beforeEach(() => {
    vi.clearAllMocks();

    const testScenario = setupExtensionTestScenario();
    mockOutputChannel = testScenario.mockOutputChannel;
    mockStatusBarItem = testScenario.mockStatusBarItem;
    mockCommand = testScenario.mockCommand;
    mockContext = testScenario.mockContext;
  });

  describe('activate', () => {
    it('should create output channel and status bar item', () => {
      // GIVEN: A valid workspace exists
      setupWorkspaceScenario(mockGetWorkspaceRoot, mockCreateDebounced);

      // WHEN: Extension is activated
      activate(mockContext);

      // THEN: VS Code resources are created with correct configuration
      expect(vscode.window.createOutputChannel).toHaveBeenCalledWith('Vite Powerflow');
      expect(vscode.window.createStatusBarItem).toHaveBeenCalledWith(
        vscode.StatusBarAlignment.Left,
        100
      );
      expect(mockStatusBarItem.command).toBe('vitePowerflow.runSyncCheck');
      expect(mockStatusBarItem.tooltip).toBe('Show sync status and re-run check');
    });

    it('should register refresh status bar', () => {
      // GIVEN: A valid workspace exists
      setupWorkspaceScenario(mockGetWorkspaceRoot, mockCreateDebounced);

      // WHEN: Extension is activated
      activate(mockContext);

      // THEN: Refresh status bar is registered with context and callback
      expect(mockCreateRefreshStatusBar).toHaveBeenCalledWith(mockContext, expect.any(Function));
    });

    it('should register commands correctly', () => {
      // GIVEN: A valid workspace exists
      setupWorkspaceScenario(mockGetWorkspaceRoot, mockCreateDebounced);

      // WHEN: Extension is activated
      activate(mockContext);

      // THEN: Main sync check command is registered
      expect(vscode.commands.registerCommand).toHaveBeenCalledWith(
        'vitePowerflow.runSyncCheck',
        expect.any(Function)
      );

      // AND: Refresh status bar is created (which internally registers refresh command)
      expect(mockCreateRefreshStatusBar).toHaveBeenCalledWith(mockContext, expect.any(Function));
    });

    it('should show output channel when command is executed', () => {
      // GIVEN: Extension is activated with valid workspace
      setupWorkspaceScenario(mockGetWorkspaceRoot, mockCreateDebounced);
      activate(mockContext);

      // WHEN: Sync check command is executed
      const commandCallback = (vscode.commands.registerCommand as any).mock.calls[0][1];
      commandCallback();

      // THEN: Output channel is shown to user
      expect(mockOutputChannel.show).toHaveBeenCalledWith(true);
    });

    it('should setup file watchers when workspace root exists', () => {
      // GIVEN: A valid workspace exists
      const { mockDebouncedFn } = setupWorkspaceScenario(mockGetWorkspaceRoot, mockCreateDebounced);

      // WHEN: Extension is activated
      activate(mockContext);

      // THEN: Debounced sync check is created and called
      expect(mockCreateDebounced).toHaveBeenCalledWith(expect.any(Function), 1000);
      expect(mockDebouncedFn).toHaveBeenCalledWith('Activation');

      // AND: File watchers are created for all monitored paths
      expect(mockCreateWatcher).toHaveBeenCalledTimes(4);
      const watcherCalls = mockCreateWatcher.mock.calls;
      watcherCalls.forEach(call => {
        expect(call[0]).toBeInstanceOf(vscode.RelativePattern);
        expect(call[1]).toBeTypeOf('function');
        expect(call[2]).toBe(mockContext);
      });
    });

    it('should show error status when not in workspace', () => {
      // GIVEN: No valid workspace is found
      mockGetWorkspaceRoot.mockReturnValue(null);

      // WHEN: Extension is activated
      activate(mockContext);

      // THEN: Error status is displayed and no watchers are created
      expect(mockUpdateStatusBar).toHaveBeenCalledWith(
        mockStatusBarItem,
        'error',
        'Not in a Vite Powerflow workspace.'
      );
      expect(mockCreateWatcher).not.toHaveBeenCalled();
    });

    it('should add items to context subscriptions', () => {
      // GIVEN: A valid workspace exists
      mockGetWorkspaceRoot.mockReturnValue('/workspace');
      const mockDebouncedFn = vi.fn();
      mockCreateDebounced.mockReturnValue(mockDebouncedFn);

      // WHEN: Extension is activated
      activate(mockContext);

      // THEN: All disposable items are added to context subscriptions
      expect(mockContext.subscriptions).toContain(mockStatusBarItem);
      expect(mockContext.subscriptions).toContain(mockCommand);
    });
  });

  describe('deactivate', () => {
    it('should dispose resources', () => {
      // GIVEN: Extension is activated with valid workspace
      mockGetWorkspaceRoot.mockReturnValue('/workspace');
      const mockDebouncedFn = vi.fn();
      mockCreateDebounced.mockReturnValue(mockDebouncedFn);
      activate(mockContext);

      // WHEN: Extension is deactivated
      deactivate();

      // THEN: All resources are properly disposed
      expect(mockStatusBarItem.dispose).toHaveBeenCalled();
      expect(mockOutputChannel.dispose).toHaveBeenCalled();
    });
  });

  describe('sync check integration', () => {
    it('should handle successful sync checks with different statuses', async () => {
      // GIVEN: Starter is in sync but CLI has changes
      mockGetWorkspaceRoot.mockReturnValue('/workspace');
      const starterResult = {
        status: 'sync' as const,
        message: 'Starter in sync',
        commitCount: 0,
      };
      const cliResult = {
        status: 'warning' as const,
        message: 'CLI has changes',
        commitCount: 1,
      };
      mockCheckStarterStatus.mockResolvedValue(starterResult);
      mockCheckCliStatus.mockResolvedValue(cliResult);
      activate(mockContext);

      // WHEN: Sync check is triggered via refresh
      const refreshFunction = mockCreateRefreshStatusBar.mock.calls[0][1];
      await refreshFunction();

      // THEN: Both packages are checked
      expect(mockCheckStarterStatus).toHaveBeenCalledWith('/workspace', mockOutputChannel);
      expect(mockCheckCliStatus).toHaveBeenCalledWith('/workspace', mockOutputChannel);

      // AND: Status bar shows warning (highest priority) with combined tooltip
      expect(mockUpdateStatusBar).toHaveBeenCalledWith(
        mockStatusBarItem,
        'warning',
        'Starter: Starter in sync | CLI: CLI has changes'
      );

      // AND: Results are handled for display
      expect(mockHandleSyncResults).toHaveBeenCalledWith(
        starterResult,
        cliResult,
        mockOutputChannel
      );
    });

    it('should prioritize error status', async () => {
      // GIVEN: Starter has error while CLI is in sync
      mockGetWorkspaceRoot.mockReturnValue('/workspace');
      const starterResult = {
        status: 'error' as const,
        message: 'Starter error',
        commitCount: 0,
      };
      const cliResult = {
        status: 'sync' as const,
        message: 'CLI sync',
        commitCount: 0,
      };
      mockCheckStarterStatus.mockResolvedValue(starterResult);
      mockCheckCliStatus.mockResolvedValue(cliResult);
      activate(mockContext);

      // WHEN: Sync check is performed
      const refreshFunction = mockCreateRefreshStatusBar.mock.calls[0][1];
      await refreshFunction();

      // THEN: Error status is prioritized over sync status
      expect(mockUpdateStatusBar).toHaveBeenCalledWith(
        mockStatusBarItem,
        'error',
        'Starter: Starter error | CLI: CLI sync'
      );
    });

    it('should handle pending status when all packages with changes have changesets', async () => {
      // GIVEN: Both packages have pending changesets
      mockGetWorkspaceRoot.mockReturnValue('/workspace');
      const starterResult = {
        status: 'pending' as const,
        message: 'Starter pending',
        commitCount: 0,
      };
      const cliResult = {
        status: 'pending' as const,
        message: 'CLI pending',
        commitCount: 0,
      };
      mockCheckStarterStatus.mockResolvedValue(starterResult);
      mockCheckCliStatus.mockResolvedValue(cliResult);
      activate(mockContext);

      // WHEN: Sync check is performed
      const refreshFunction = mockCreateRefreshStatusBar.mock.calls[0][1];
      await refreshFunction();

      // THEN: Overall status is pending (all packages ready for release)
      expect(mockUpdateStatusBar).toHaveBeenCalledWith(
        mockStatusBarItem,
        'pending',
        'Starter: Starter pending | CLI: CLI pending'
      );
    });

    it('should handle sync check errors gracefully', async () => {
      // GIVEN: Extension is activated but sync check will fail
      mockGetWorkspaceRoot.mockReturnValue('/workspace');
      mockCheckStarterStatus.mockRejectedValue(new Error('Check failed'));
      activate(mockContext);

      // WHEN: Sync check is performed and fails
      const refreshFunction = mockCreateRefreshStatusBar.mock.calls[0][1];
      await refreshFunction();

      // THEN: Error is logged to output channel
      expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(
        '❌ Error during sync checks: Check failed'
      );

      // AND: Status bar shows error state
      expect(mockUpdateStatusBar).toHaveBeenCalledWith(
        mockStatusBarItem,
        'error',
        'Error during sync checks.'
      );
    });
  });
});
