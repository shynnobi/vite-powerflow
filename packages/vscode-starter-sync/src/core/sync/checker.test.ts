import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as vscode from 'vscode';

import { createMockOutputChannel } from '../../test-utils.js';
import { CheckResult } from '../../types.js';
import { checkCliStatus, checkStarterStatus } from './checker.js';

// Mock dependencies
vi.mock('../changesets.js', () => ({
  getChangesetStatus: vi.fn(),
}));
vi.mock('../git.js', () => ({
  getCommitsSince: vi.fn(),
  getCurrentCommit: vi.fn(),
  getTemplateBaselineCommit: vi.fn(),
}));
vi.mock('../packages.js', () => ({
  getLatestNpmVersion: vi.fn(),
  getPackageInfo: vi.fn(),
}));
vi.mock('../utils.js', () => ({
  logMessage: vi.fn(),
}));
vi.mock('./handlers.js', () => ({
  formatBaselineLog: vi.fn(),
  handleError: vi.fn(),
  handleInSync: vi.fn(),
  handleUnreleasedCommits: vi.fn(),
}));

const mockGetChangesetStatus = vi.mocked(await import('../changesets.js')).getChangesetStatus;
const mockGetCommitsSince = vi.mocked(await import('../git.js')).getCommitsSince;
const mockGetCurrentCommit = vi.mocked(await import('../git.js')).getCurrentCommit;
const mockGetTemplateBaselineCommit = vi.mocked(
  await import('../git.js')
).getTemplateBaselineCommit;
const mockGetLatestNpmVersion = vi.mocked(await import('../packages.js')).getLatestNpmVersion;
const mockGetPackageInfo = vi.mocked(await import('../packages.js')).getPackageInfo;
const mockLogMessage = vi.mocked(await import('../utils.js')).logMessage;
const mockHandleError = vi.mocked(await import('./handlers.js')).handleError;
const mockHandleInSync = vi.mocked(await import('./handlers.js')).handleInSync;
const mockHandleUnreleasedCommits = vi.mocked(
  await import('./handlers.js')
).handleUnreleasedCommits;

describe('checker', () => {
  let mockOutputChannel: vscode.OutputChannel;
  const workspaceRoot = '/workspace';

  beforeEach(() => {
    vi.clearAllMocks();
    mockOutputChannel = createMockOutputChannel();
  });

  describe('checkStarterStatus', () => {
    it('should return pending status when changeset exists for starter package', async () => {
      // GIVEN: A changeset exists for the starter package
      const changesetStatus = {
        status: 'pending' as const,
        changeset: {
          fileName: 'test-changeset.md',
          bumpType: 'minor' as const,
        },
      };
      mockGetChangesetStatus.mockResolvedValue(changesetStatus);
      mockGetPackageInfo.mockResolvedValue({
        name: '@vite-powerflow/starter',
        version: '1.0.0',
      });

      // WHEN: Checking starter status
      const result = await checkStarterStatus(workspaceRoot, mockOutputChannel);

      // THEN: Status is pending with changeset information
      expect(result).toEqual({
        status: 'pending',
        message: 'Changeset found: test-changeset.md (minor)',
        commitCount: 0,
        changeset: changesetStatus.changeset,
        packageVersion: '1.0.0',
      });

      // AND: Changeset detection was called with correct parameters
      expect(mockGetChangesetStatus).toHaveBeenCalledWith(
        workspaceRoot,
        '@vite-powerflow/starter',
        mockOutputChannel
      );
    });

    it('should check git commits when no changeset exists', async () => {
      // GIVEN: No changeset exists but git commits are present
      mockGetChangesetStatus.mockResolvedValue(null);
      mockGetTemplateBaselineCommit.mockResolvedValue('baseline-commit-hash');
      mockGetCurrentCommit.mockReturnValue('current-commit-hash');
      mockGetCommitsSince.mockReturnValue(['commit1', 'commit2']);
      const mockResult: CheckResult = {
        status: 'warning',
        message:
          'Unreleased changes detected in Starter without a changeset! Please add a changeset before release.',
        commitCount: 2,
        packageVersion: '1.0.0',
        baselineCommit: 'baseline-commit-hash',
        currentCommit: 'current-commit-hash',
      };
      mockHandleUnreleasedCommits.mockResolvedValue(mockResult);

      // WHEN: Checking starter status
      const result = await checkStarterStatus(workspaceRoot, mockOutputChannel);

      // THEN: Git-based checking is performed
      expect(mockGetTemplateBaselineCommit).toHaveBeenCalledWith(workspaceRoot, mockOutputChannel);
      expect(mockGetCommitsSince).toHaveBeenCalledWith(
        workspaceRoot,
        'baseline-commit-hash',
        'current-commit-hash',
        'apps/starter/',
        mockOutputChannel
      );

      // AND: Unreleased commits result is returned
      expect(result).toEqual(expect.objectContaining(mockResult));
    });

    it('should return error when baseline commit is not found', async () => {
      // GIVEN: No changeset exists and baseline commit cannot be found
      mockGetChangesetStatus.mockResolvedValue(null);
      mockGetTemplateBaselineCommit.mockResolvedValue('unknown');

      // WHEN: Checking starter status
      const result = await checkStarterStatus(workspaceRoot, mockOutputChannel);

      // THEN: Error status is returned with appropriate message
      expect(result.status).toBe('error');
      expect(result.message).toBe(
        'Template baseline commit not found in CLI template (package.json).'
      );
    });

    it('should handle sync status when no commits found', async () => {
      // GIVEN: No changeset exists and no new commits since baseline
      mockGetChangesetStatus.mockResolvedValue(null);
      mockGetTemplateBaselineCommit.mockResolvedValue('baseline-commit-hash');
      mockGetCurrentCommit.mockReturnValue('current-commit-hash');
      mockGetCommitsSince.mockReturnValue([]);
      const mockResult: CheckResult = {
        status: 'sync',
        message: 'In sync with the latest CLI template baseline.',
        commitCount: 0,
        packageVersion: '1.0.0',
        baselineCommit: 'baseline-commit-hash',
        currentCommit: 'current-commit-hash',
      };
      mockHandleInSync.mockResolvedValue(mockResult);

      // WHEN: Checking starter status
      const result = await checkStarterStatus(workspaceRoot, mockOutputChannel);

      // THEN: In sync result is returned
      expect(result).toEqual(expect.objectContaining(mockResult));
    });

    it('should handle errors gracefully', async () => {
      // GIVEN: An error occurs during changeset detection
      const error = new Error('Test error');
      mockGetChangesetStatus.mockRejectedValue(error);
      const mockErrorResult: CheckResult = {
        status: 'error',
        message: 'Error during sync check: Test error',
        commitCount: 0,
      };
      mockHandleError.mockResolvedValue(mockErrorResult);

      // WHEN: Checking starter status
      const result = await checkStarterStatus(workspaceRoot, mockOutputChannel);

      // THEN: Error is handled gracefully
      expect(result).toEqual(mockErrorResult);
      expect(mockHandleError).toHaveBeenCalledWith(
        expect.objectContaining({
          label: 'Starter',
        }),
        error,
        mockOutputChannel
      );
    });
  });

  describe('checkCliStatus', () => {
    it('should return pending status when changeset exists for CLI package', async () => {
      const packageInfo = {
        name: '@vite-powerflow/create',
        version: '1.0.0',
      };

      const changesetStatus = {
        status: 'pending' as const,
        changeset: {
          fileName: 'cli-changeset.md',
          bumpType: 'patch' as const,
        },
      };

      mockGetPackageInfo.mockResolvedValue(packageInfo);
      mockGetChangesetStatus.mockResolvedValue(changesetStatus);
      mockGetLatestNpmVersion.mockReturnValue('0.9.0'); // Ensure npm version exists

      const result = await checkCliStatus(workspaceRoot, mockOutputChannel);

      expect(result).toEqual({
        status: 'pending',
        message: 'Changeset found: cli-changeset.md (patch)',
        commitCount: 0,
        changeset: changesetStatus.changeset,
        packageVersion: '1.0.0',
      });
    });

    it('should handle package not published on npm', async () => {
      const packageInfo = {
        name: '@vite-powerflow/create',
        version: '1.0.0',
      };

      mockGetPackageInfo.mockResolvedValue(packageInfo);
      mockGetChangesetStatus.mockResolvedValue(null);
      mockGetLatestNpmVersion.mockReturnValue(null);

      const result = await checkCliStatus(workspaceRoot, mockOutputChannel);

      expect(result).toEqual({
        status: 'sync',
        message: 'Not published on npm yet.',
        commitCount: 0,
        packageVersion: '1.0.0',
        baselineCommit: undefined,
        currentCommit: 'current-commit-hash',
      });

      expect(mockLogMessage).toHaveBeenCalledWith(
        mockOutputChannel,
        'ℹ️ [CLI] Not published on npm yet.'
      );
    });

    it('should check commits against published npm version', async () => {
      const packageInfo = {
        name: '@vite-powerflow/create',
        version: '1.0.0',
      };

      mockGetPackageInfo.mockResolvedValue(packageInfo);
      mockGetChangesetStatus.mockResolvedValue(null);
      mockGetLatestNpmVersion.mockReturnValue('0.9.0');
      mockGetCurrentCommit.mockReturnValue('current-commit');
      mockGetCommitsSince.mockReturnValue(['commit1']);

      const mockResult: CheckResult = {
        status: 'warning',
        message:
          'Unreleased changes detected in CLI without a changeset! Please add a changeset before release.',
        commitCount: 1,
        packageVersion: '1.0.0',
        baselineCommit: '@vite-powerflow/create@0.9.0',
        currentCommit: 'current-commit',
      };
      mockHandleUnreleasedCommits.mockResolvedValue(mockResult);

      const result = await checkCliStatus(workspaceRoot, mockOutputChannel);

      expect(result).toEqual(expect.objectContaining(mockResult));
      expect(mockGetCommitsSince).toHaveBeenCalledWith(
        workspaceRoot,
        '@vite-powerflow/create@0.9.0',
        'current-commit',
        'packages/cli/',
        mockOutputChannel
      );
    });

    it('should return error when CLI package.json not found', async () => {
      mockGetPackageInfo.mockResolvedValue(null);

      const mockErrorResult: CheckResult = {
        status: 'error',
        message: 'Error during sync check: CLI package.json not found.',
        commitCount: 0,
      };
      mockHandleError.mockResolvedValue(mockErrorResult);

      const result = await checkCliStatus(workspaceRoot, mockOutputChannel);

      expect(result).toEqual(mockErrorResult);
    });

    it('should handle unexpected errors', async () => {
      const error = new Error('Unexpected error');
      mockGetPackageInfo.mockRejectedValue(error);

      const mockErrorResult: CheckResult = {
        status: 'error',
        message: 'Error during sync check: Unexpected error',
        commitCount: 0,
      };
      mockHandleError.mockResolvedValue(mockErrorResult);

      const result = await checkCliStatus(workspaceRoot, mockOutputChannel);

      expect(result).toEqual(mockErrorResult);
    });
  });
});
