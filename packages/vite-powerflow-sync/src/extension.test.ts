import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as vscode from 'vscode';

import { runAllSyncChecks } from './core/syncChecker';
import { formatSyncOutput, getAllMonitoredPackages } from './core/syncReporter';
import { detectWorkspaceRoot } from './core/workspaceDetector';
import { updateStatusBar } from './ui/statusBarController';
import { createRefreshStatusBar } from './ui/syncCommands';
import { createDebounced, createWatcher } from './utils/extensionUtils';
import { setupExtensionTestScenario, setupWorkspaceScenario } from './utils/testUtils';
import { activate, deactivate } from './extension';

// Mock VS Code API
vi.mock('vscode', async () => {
  const actual = await vi.importActual('vscode');
  return {
    ...actual,
    ThemeColor: class {
      constructor(public id: string) {}
    },
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
vi.mock('./core/syncChecker.js', () => ({
  runAllSyncChecks: vi.fn(),
}));
vi.mock('./ui/syncCommands.js', () => ({
  createRefreshStatusBar: vi.fn(),
}));
vi.mock('./ui/statusBarController.js', () => ({
  updateStatusBar: vi.fn(),
}));
vi.mock('./utils/extensionUtils.js', () => ({
  createDebounced: vi.fn(),
  createWatcher: vi.fn(),
}));
vi.mock('./core/workspaceDetector.js', () => ({
  detectWorkspaceRoot: vi.fn(),
}));
vi.mock('./core/syncReporter.js', () => ({
  getAllMonitoredPackages: vi.fn(),
  formatSyncOutput: vi.fn(),
}));

const mockRunAllSyncChecks = vi.mocked(runAllSyncChecks);
const mockCreateRefreshStatusBar = vi.mocked(createRefreshStatusBar);
const mockUpdateStatusBar = vi.mocked(updateStatusBar);
const mockCreateDebounced = vi.mocked(createDebounced);
const mockCreateWatcher = vi.mocked(createWatcher);
const mockDetectWorkspaceRoot = vi.mocked(detectWorkspaceRoot);
const mockGetAllMonitoredPackages = vi.mocked(getAllMonitoredPackages);
const mockFormatSyncOutput = vi.mocked(formatSyncOutput);

describe('extension', () => {
  let mockContext: vscode.ExtensionContext;
  let mockOutputChannel: vscode.OutputChannel;
  let mockStatusBarItem: vscode.StatusBarItem;
  let mockCommand: vscode.Disposable;

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock Date globally for deterministic output (for snapshot stability)
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-08-07T16:00:00Z'));

    const testScenario = setupExtensionTestScenario();
    mockOutputChannel = testScenario.mockOutputChannel;
    mockStatusBarItem = testScenario.mockStatusBarItem;
    mockCommand = testScenario.mockCommand;
    mockContext = testScenario.mockContext;
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  describe('activate', () => {
    it('should create output channel and status bar item', async () => {
      // GIVEN: A valid workspace exists
      setupWorkspaceScenario(mockDetectWorkspaceRoot, mockCreateDebounced);

      // WHEN: Extension is activated
      await activate(mockContext);

      // THEN: VS Code resources are created with correct configuration
      expect(vscode.window.createOutputChannel).toHaveBeenCalledWith('Vite Powerflow Sync');
      expect(vscode.window.createStatusBarItem).toHaveBeenCalledWith(
        vscode.StatusBarAlignment.Left,
        100
      );
      expect(mockStatusBarItem.command).toBe('vitePowerflow.runSyncCheck');
      expect(mockStatusBarItem.tooltip).toBe('Show sync status and re-run check');
    });

    it('should register refresh status bar', async () => {
      // GIVEN: A valid workspace exists
      setupWorkspaceScenario(mockDetectWorkspaceRoot, mockCreateDebounced);

      // WHEN: Extension is activated
      await activate(mockContext);

      // THEN: Refresh status bar is registered with context and callback
      expect(mockCreateRefreshStatusBar).toHaveBeenCalledWith(mockContext, expect.any(Function));
    });

    it('should register commands correctly', async () => {
      // GIVEN: A valid workspace exists
      setupWorkspaceScenario(mockDetectWorkspaceRoot, mockCreateDebounced);

      // WHEN: Extension is activated
      await activate(mockContext);

      // THEN: Main sync check command is registered
      expect(vscode.commands.registerCommand).toHaveBeenCalledWith(
        'vitePowerflow.runSyncCheck',
        expect.any(Function)
      );

      // AND: Refresh status bar is created (which internally registers refresh command)
      expect(mockCreateRefreshStatusBar).toHaveBeenCalledWith(mockContext, expect.any(Function));
    });

    it('should show output channel when command is executed', async () => {
      // GIVEN: Extension is activated with valid workspace
      setupWorkspaceScenario(mockDetectWorkspaceRoot, mockCreateDebounced);
      await activate(mockContext);

      // WHEN: Sync check command is executed
      const commandCallback = (vscode.commands.registerCommand as any).mock.calls[0][1];
      commandCallback();

      // THEN: Output channel is shown to user (peu importe l'argument)
      expect(mockOutputChannel.show).toHaveBeenCalled();
    });

    it('should setup file watchers when workspace root exists', async () => {
      // GIVEN: A valid workspace exists
      const { mockDebouncedFn } = setupWorkspaceScenario(
        mockDetectWorkspaceRoot,
        mockCreateDebounced
      );

      // Mock monitored packages to return some test packages
      mockGetAllMonitoredPackages.mockResolvedValue([
        {
          label: 'Starter',
          pkgName: '@vite-powerflow/starter',
          pkgPath: 'apps/starter/package.json',
          commitPath: 'apps/starter/',
          type: 'unpublished',
          baseline: 'abc123',
        },
        {
          label: 'CLI',
          pkgName: '@vite-powerflow/create',
          pkgPath: 'packages/cli/package.json',
          commitPath: 'packages/cli/',
          type: 'npm',
          baseline: 'def456',
        },
      ]);

      // WHEN: Extension is activated
      await activate(mockContext);

      // THEN: Debounced sync check is created and called
      expect(mockCreateDebounced).toHaveBeenCalledWith(expect.any(Function), 1000);
      expect(mockDebouncedFn).toHaveBeenCalledWith('Activation');

      // AND: File watchers are created for all monitored paths
      expect(mockCreateWatcher).toHaveBeenCalled();
      const watcherCalls = mockCreateWatcher.mock.calls;
      watcherCalls.forEach(call => {
        expect(call[0]).toBeInstanceOf(vscode.RelativePattern);
        expect(call[1]).toBeTypeOf('function');
        expect(call[2]).toBe(mockContext);
      });
    });

    it('should show error status when not in workspace', async () => {
      // GIVEN: No valid workspace is found
      mockDetectWorkspaceRoot.mockReturnValue(null);

      // WHEN: Extension is activated
      await activate(mockContext);

      // THEN: Error status is displayed and no watchers are created
      expect(mockUpdateStatusBar).toHaveBeenCalledWith(
        mockStatusBarItem,
        'error',
        'Not in a Vite Powerflow workspace.'
      );
      expect(mockCreateWatcher).not.toHaveBeenCalled();
    });

    it('should add items to context subscriptions', async () => {
      // GIVEN: A valid workspace exists
      mockDetectWorkspaceRoot.mockReturnValue('/workspace');
      const mockDebouncedFn = vi.fn();
      mockCreateDebounced.mockReturnValue(mockDebouncedFn);

      // WHEN: Extension is activated
      await activate(mockContext);

      // THEN: All disposable items are added to context subscriptions
      expect(mockContext.subscriptions).toContain(mockStatusBarItem);
      expect(mockContext.subscriptions).toContain(mockCommand);
    });
  });

  describe('deactivate', () => {
    it('should dispose resources', async () => {
      // GIVEN: Extension is activated with valid workspace
      mockDetectWorkspaceRoot.mockReturnValue('/workspace');
      const mockDebouncedFn = vi.fn();
      mockCreateDebounced.mockReturnValue(mockDebouncedFn);
      await activate(mockContext);

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
      mockDetectWorkspaceRoot.mockReturnValue('/workspace');
      const results = [
        {
          label: 'Starter',
          result: {
            status: 'sync' as const,
            message: 'Starter in sync',
            commitCount: 0,
          },
        },
        {
          label: 'CLI',
          result: {
            status: 'warning' as const,
            message: 'CLI has changes',
            commitCount: 1,
          },
        },
      ];
      mockRunAllSyncChecks.mockResolvedValue(results);
      await activate(mockContext);

      // WHEN: Sync check is triggered via refresh
      const refreshFunction = mockCreateRefreshStatusBar.mock.calls[0][1];
      await refreshFunction();

      // THEN: All packages are checked
      expect(mockRunAllSyncChecks).toHaveBeenCalledWith('/workspace', mockOutputChannel);
      // AND: Status bar shows generic sync message with the highest priority status (warning > sync)
      expect(mockUpdateStatusBar).toHaveBeenCalledWith(
        mockStatusBarItem,
        'warning',
        'Click to view sync status'
      );
    });

    it('should prioritize error status', async () => {
      // GIVEN: Starter has error while CLI is in sync
      mockDetectWorkspaceRoot.mockReturnValue('/workspace');
      const results = [
        {
          label: 'Starter',
          result: {
            status: 'error' as const,
            message: 'Starter error',
            commitCount: 0,
          },
        },
        {
          label: 'CLI',
          result: {
            status: 'sync' as const,
            message: 'CLI sync',
            commitCount: 0,
          },
        },
      ];
      mockRunAllSyncChecks.mockResolvedValue(results);
      await activate(mockContext);

      // WHEN: Sync check is performed
      const refreshFunction = mockCreateRefreshStatusBar.mock.calls[0][1];
      await refreshFunction();

      // THEN: Error status is prioritized over sync status
      expect(mockUpdateStatusBar).toHaveBeenCalledWith(
        mockStatusBarItem,
        'error',
        'Click to view sync status'
      );
    });

    it('should handle pending status when all packages with changes have changesets', async () => {
      // GIVEN: Both packages have pending changesets
      mockDetectWorkspaceRoot.mockReturnValue('/workspace');
      const results = [
        {
          label: 'Starter',
          result: {
            status: 'pending' as const,
            message: 'Starter pending',
            commitCount: 0,
          },
        },
        {
          label: 'CLI',
          result: {
            status: 'pending' as const,
            message: 'CLI pending',
            commitCount: 0,
          },
        },
      ];
      mockRunAllSyncChecks.mockResolvedValue(results);
      await activate(mockContext);

      // WHEN: Sync check is performed
      const refreshFunction = mockCreateRefreshStatusBar.mock.calls[0][1];
      await refreshFunction();

      // THEN: Overall status is pending (all packages ready for release)
      expect(mockUpdateStatusBar).toHaveBeenCalledWith(
        mockStatusBarItem,
        'pending',
        'Click to view sync status'
      );
    });

    it('should handle sync check errors gracefully', async () => {
      // GIVEN: Extension is activated but sync check will fail
      mockDetectWorkspaceRoot.mockReturnValue('/workspace');
      mockRunAllSyncChecks.mockRejectedValue(new Error('Check failed'));
      await activate(mockContext);

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
