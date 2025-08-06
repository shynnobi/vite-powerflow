import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as vscode from 'vscode';

import { createMockOutputChannel } from '../../test-utils.js';
import { CheckResult } from '../../types.js';
import { checkCliStatus, checkStarterStatus } from './checker.js';

// Mock dependencies
vi.mock('../changesets.js', () => ({
  getChangesetStatus: vi.fn(),
  getLatestChangesetForPackage: vi.fn(),
}));
vi.mock('../git.js', () => ({
  getCommitsSince: vi.fn(),
  getCurrentCommit: vi.fn(),
  getTemplateBaselineCommit: vi.fn(),
  getFilesChangedSince: vi.fn(),
  resolveRefToSha: vi.fn(),
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
const mockGetLatestChangesetForPackage = vi.mocked(
  await import('../changesets.js')
).getLatestChangesetForPackage;
const mockGetCommitsSince = vi.mocked(await import('../git.js')).getCommitsSince;
const mockGetCurrentCommit = vi.mocked(await import('../git.js')).getCurrentCommit;
const mockGetTemplateBaselineCommit = vi.mocked(
  await import('../git.js')
).getTemplateBaselineCommit;
const mockGetFilesChangedSince = vi.mocked(await import('../git.js')).getFilesChangedSince;
const mockResolveRefToSha = vi.mocked(await import('../git.js')).resolveRefToSha;
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
    it('should return pending status when changeset exists for starter package and no changes after anchor', async () => {
      // GIVEN: A changeset exists and no files changed after its anchor
      mockGetTemplateBaselineCommit.mockResolvedValue('baseline-commit-hash');
      mockGetCurrentCommit.mockReturnValue('current-commit-hash');
      mockGetCommitsSince.mockReturnValue(['dummy-commit']); // presence of commits overall
      mockGetFilesChangedSince.mockReturnValue([]); // but none under apps/starter/ since baseline and anchor
      mockGetLatestChangesetForPackage.mockResolvedValue({
        fileName: 'test-changeset.md',
        bumpType: 'minor',
        lastCommitSha: 'anchor-sha',
      });
      mockGetPackageInfo.mockResolvedValue({
        name: '@vite-powerflow/starter',
        version: '1.0.0',
      });

      // WHEN
      const result = await checkStarterStatus(workspaceRoot, mockOutputChannel);

      // THEN
      // Tolerate the generic pending message and additional fields from getSyncStatus
      expect(result).toEqual(
        expect.objectContaining({
          status: 'pending',
          packageVersion: '1.0.0',
        })
      );
      expect(mockGetLatestChangesetForPackage).toHaveBeenCalled();
      expect(mockGetFilesChangedSince).toHaveBeenCalledWith(
        workspaceRoot,
        'anchor-sha',
        'apps/starter/',
        mockOutputChannel
      );
    });

    it('should check git commits when no changeset exists (warning required)', async () => {
      // GIVEN
      mockGetLatestChangesetForPackage.mockResolvedValue(null); // no changeset
      mockGetTemplateBaselineCommit.mockResolvedValue('baseline-commit-hash');
      mockGetCurrentCommit.mockReturnValue('current-commit-hash');
      mockGetCommitsSince.mockReturnValue(['c1', 'c2']);
      mockGetFilesChangedSince.mockReturnValue(['apps/starter/src/App.tsx']); // changes under starter path
      mockGetPackageInfo.mockResolvedValue({ name: '@vite-powerflow/starter', version: '1.0.0' });

      // WHEN
      const result = await checkStarterStatus(workspaceRoot, mockOutputChannel);

      // THEN
      expect(mockGetTemplateBaselineCommit).toHaveBeenCalledWith(workspaceRoot, mockOutputChannel);
      expect(mockGetCommitsSince).toHaveBeenCalled();
      expect(result).toEqual(
        expect.objectContaining({
          status: 'warning',
          message: 'Changeset required for Starter: no changeset found for these changes.',
          commitCount: 2,
          packageVersion: '1.0.0',
          baselineCommit: 'baseline-commit-hash',
          currentCommit: 'current-commit-hash',
        })
      );
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
      // GIVEN
      const error = new Error('Test error');
      mockGetLatestChangesetForPackage.mockRejectedValue(error);
      // With new logic, we still resolve baseline/current and if no commits are found, we end up "sync"
      mockGetTemplateBaselineCommit.mockResolvedValue('baseline-commit-hash');
      mockGetCurrentCommit.mockReturnValue('current-commit-hash');
      mockGetCommitsSince.mockReturnValue([]);

      // WHEN
      const result = await checkStarterStatus(workspaceRoot, mockOutputChannel);

      // THEN: expect a sync-shaped result (no commits after baseline)
      expect(result).toEqual(
        expect.objectContaining({
          status: 'sync',
          message: 'In sync with the latest CLI template baseline.',
          baselineCommit: 'baseline-commit-hash',
          currentCommit: 'current-commit-hash',
        })
      );
    });
  });

  describe('checkCliStatus', () => {
    it('should return pending when changeset exists for CLI and no changes after anchor', async () => {
      const packageInfo = { name: '@vite-powerflow/create', version: '1.0.0' };
      mockGetPackageInfo.mockResolvedValue(packageInfo);
      mockGetLatestNpmVersion.mockReturnValue('0.9.0');
      mockResolveRefToSha.mockReturnValue('resolved-cli-sha');
      mockGetCurrentCommit.mockReturnValue('current-commit');
      // Simulate commits exist overall but none under CLI path after anchor
      mockGetCommitsSince.mockReturnValue(['c1']);
      mockGetLatestChangesetForPackage.mockResolvedValue({
        fileName: 'cli-changeset.md',
        bumpType: 'patch',
        lastCommitSha: 'cli-anchor',
      });
      mockGetFilesChangedSince.mockReturnValue([]); // no changes after anchor under CLI path

      const result = await checkCliStatus(workspaceRoot, mockOutputChannel);

      // With commits since baseline but none under commitPath after anchor,
      // getSyncStatus currently returns a generic pending ("unreleased") state.
      expect(result).toEqual(
        expect.objectContaining({
          status: 'pending',
          packageVersion: '1.0.0',
        })
      );
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
        currentCommit: 'current-commit',
      });

      expect(mockLogMessage).toHaveBeenCalledWith(
        mockOutputChannel,
        'ℹ️ [CLI] Not published on npm yet.'
      );
    });

    it('should check commits against published npm version (warning required when no changeset)', async () => {
      const packageInfo = { name: '@vite-powerflow/create', version: '1.0.0' };
      mockGetPackageInfo.mockResolvedValue(packageInfo);
      mockGetLatestNpmVersion.mockReturnValue('0.9.0');
      mockResolveRefToSha.mockReturnValue('resolved-cli-sha'); // baselineCommit unified to SHA
      mockGetLatestChangesetForPackage.mockResolvedValue(null); // no changeset
      mockGetCurrentCommit.mockReturnValue('current-commit');
      mockGetCommitsSince.mockReturnValue(['commit1']);
      mockGetFilesChangedSince.mockReturnValue(['packages/cli/src/index.ts']);

      const result = await checkCliStatus(workspaceRoot, mockOutputChannel);

      expect(result).toEqual(
        expect.objectContaining({
          status: 'warning',
          message: 'Changeset required for CLI: no changeset found for these changes.',
          baselineCommit: 'resolved-cli-sha',
          currentCommit: 'current-commit',
          packageVersion: '1.0.0',
        })
      );
      expect(mockGetCommitsSince).toHaveBeenCalledWith(
        workspaceRoot,
        'resolved-cli-sha',
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
