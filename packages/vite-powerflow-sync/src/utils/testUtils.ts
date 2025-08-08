/**
 * @fileoverview Test utilities for VS Code Starter Sync Extension
 * Provides centralized mock factories and setup utilities to eliminate code duplication.
 */

import type { Mock } from 'vitest';
import { vi } from 'vitest';
import * as vscode from 'vscode';

function createMockUri(): vscode.Uri {
  return {
    fsPath: '',
    path: '',
    scheme: '',
    authority: '',
    query: '',
    fragment: '',
    toString: () => '',
    toJSON: () => ({}),
    with: () => createMockUri(),
  } as unknown as vscode.Uri;
}

/**
 * Creates a mock VS Code OutputChannel
 * @returns Mock OutputChannel for testing
 */
export const createMockOutputChannel = (): vscode.OutputChannel => ({
  name: 'test-channel',
  appendLine: vi.fn(),
  show: vi.fn(),
  dispose: vi.fn(),
  append: vi.fn(),
  clear: vi.fn(),
  hide: vi.fn(),
  replace: vi.fn(),
});

/**
 * Creates a mock VS Code StatusBarItem
 * @returns Mock StatusBarItem for testing
 */
export const createMockStatusBarItem = () => ({
  id: 'test-statusbar',
  name: 'test-statusbar',
  text: '',
  tooltip: '',
  command: '',
  backgroundColor: undefined,
  dispose: vi.fn(),
  show: vi.fn(),
  hide: vi.fn(),
  alignment: 1, // StatusBarAlignment.Left
  priority: 0,
  color: undefined,
  accessibilityInformation: undefined,
});

/**
 * Creates a mock VS Code Disposable
 * @returns Mock disposable for command registration testing
 */
export const createMockCommand = (): vscode.Disposable => ({
  dispose: vi.fn(),
});

/**
 * Creates a mock VS Code ExtensionContext
 * @returns Mock context for extension activation testing
 */
export function createMockContext(): vscode.ExtensionContext {
  return {
    subscriptions: [],
    workspaceState: {
      get: vi.fn(),
      update: vi.fn(),
      keys: vi.fn(),
    },
    globalState: {
      get: vi.fn(),
      update: vi.fn(),
      keys: vi.fn(),
      setKeysForSync: vi.fn(),
    },
    extensionPath: '',
    asAbsolutePath: (relativePath: string) => relativePath,
    storagePath: '',
    globalStoragePath: '',
    logPath: '',
    extensionUri: createMockUri(),
    environmentVariableCollection: {
      persistent: true,
      replace: vi.fn(),
      append: vi.fn(),
      prepend: vi.fn(),
      get: vi.fn(),
      forEach: vi.fn(),
      clear: vi.fn(),
      getScoped: vi.fn(),
      description: '',
      delete: vi.fn(),
      [Symbol.iterator]: vi.fn(),
    },
    secrets: {
      store: vi.fn(),
      get: vi.fn(),
      delete: vi.fn(),
      onDidChange: vi.fn(),
    },
    logUri: createMockUri(),
    storageUri: createMockUri(),
    globalStorageUri: createMockUri(),
    extensionMode: 1,
    extension: {} as vscode.Extension<unknown>,
    languageModelAccessInformation: {
      onDidChange: vi.fn(),
      canSendRequest: () => false,
    },
  };
}

/**
 * Sets up VS Code API mocks with proper return values
 * @returns Object containing all created mock instances
 */
export const setupVSCodeMocks = () => {
  const mockOutputChannel = createMockOutputChannel();
  const mockStatusBarItem = createMockStatusBarItem();
  const mockCommand = createMockCommand();

  // Note: Using 'as unknown as' here is necessary for mocking VS Code APIs in tests
  (vscode.window.createOutputChannel as unknown as Mock).mockReturnValue(mockOutputChannel);
  (vscode.window.createStatusBarItem as unknown as Mock).mockReturnValue(mockStatusBarItem);
  (vscode.commands.registerCommand as unknown as Mock).mockReturnValue(mockCommand);

  return {
    mockOutputChannel,
    mockStatusBarItem,
    mockCommand,
  };
};

/**
 * Creates a complete extension test environment
 * @returns Complete mock environment for extension testing
 */
export const setupExtensionTestScenario = () => {
  const mocks = setupVSCodeMocks();
  const mockContext = createMockContext();

  return {
    ...mocks,
    mockContext,
  };
};

/**
 * Creates a mock check result object
 * @param status - The sync status: 'sync', 'warning', 'error', or 'pending'
 * @param message - Human-readable status message
 * @param commitCount - Number of unreleased commits (default: 0)
 * @param changeset - Optional changeset information
 * @param packageVersion - Optional package version string
 * @returns Mock CheckResult object
 */
export const createMockCheckResult = (
  status: 'sync' | 'warning' | 'error' | 'pending',
  message: string,
  commitCount = 0,
  changeset?: Record<string, unknown>,
  packageVersion?: string
) => ({
  status,
  message,
  commitCount,
  ...(changeset ? { changeset } : {}),
  ...(packageVersion ? { packageVersion } : {}),
});

/**
 * Creates a mock changeset status
 * @param fileName - Name of the changeset file
 * @param bumpType - Type of version bump: 'minor', 'patch', or 'major'
 * @returns Mock changeset status object
 */
export const createMockChangesetStatus = (
  fileName: string,
  bumpType: 'minor' | 'patch' | 'major'
) => ({
  status: 'pending' as const,
  changeset: {
    fileName,
    bumpType,
  },
});

/**
 * Sets up workspace testing scenario
 * @param mockGetWorkspaceRoot - Mock function for workspace root detection
 * @param mockCreateDebounced - Mock function for debounced function creation
 * @param workspacePath - Path to use as workspace root (default: '/workspace')
 * @returns Object containing the mock debounced function
 */
export const setupWorkspaceScenario = (
  mockGetWorkspaceRoot: ReturnType<typeof vi.fn>,
  mockCreateDebounced: ReturnType<typeof vi.fn>,
  workspacePath = '/workspace'
) => {
  mockGetWorkspaceRoot.mockReturnValue(workspacePath);
  const mockDebouncedFn = vi.fn();
  mockCreateDebounced.mockReturnValue(mockDebouncedFn);

  return { mockDebouncedFn };
};
