import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
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

// Group mocks by module for better organization
import * as changesetModule from '../changesets.js';
import * as gitModule from '../git.js';
import * as packageModule from '../packages.js';
import * as handlerModule from './handlers.js';

const changesetMocks = vi.mocked(changesetModule);
const gitMocks = vi.mocked(gitModule);
const packageMocks = vi.mocked(packageModule);
const handlerMocks = vi.mocked(handlerModule);

// Destructure for easier access
const {
  getChangesetStatus: mockGetChangesetStatus,
  getLatestChangesetForPackage: mockGetLatestChangesetForPackage,
} = changesetMocks;

const {
  getCommitsSince: mockGetCommitsSince,
  getCurrentCommit: mockGetCurrentCommit,
  getTemplateBaselineCommit: mockGetTemplateBaselineCommit,
  getFilesChangedSince: mockGetFilesChangedSince,
  resolveRefToSha: mockResolveRefToSha,
} = gitMocks;

const { getLatestNpmVersion: mockGetLatestNpmVersion, getPackageInfo: mockGetPackageInfo } =
  packageMocks;

const { handleError: mockHandleError, handleInSync: mockHandleInSync } = handlerMocks;

describe('checker', () => {
  let mockOutputChannel: vscode.OutputChannel;
  const workspaceRoot = '/workspace';

  beforeEach(() => {
    vi.clearAllMocks();
    mockOutputChannel = createMockOutputChannel();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-08-07T16:00:00Z'));
  });
  afterAll(() => {
    vi.useRealTimers();
  });

  describe('checkStarterStatus', () => {
    it('should return pending status when changeset exists for starter package and no changes after anchor', async () => {
      // GIVEN: A changeset exists for the starter package and no files have changed after its anchor commit
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

      // WHEN: We check the starter synchronization status
      const result = await checkStarterStatus(workspaceRoot, mockOutputChannel);

      // THEN: The status should be pending since a changeset exists but no additional changes were made
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
      // GIVEN: No changeset exists for the starter package and there are file changes under the starter path
      mockGetLatestChangesetForPackage.mockResolvedValue(null); // no changeset
      mockGetTemplateBaselineCommit.mockResolvedValue('baseline-commit-hash');
      mockGetCurrentCommit.mockReturnValue('current-commit-hash');
      mockGetCommitsSince.mockReturnValue(['c1', 'c2']);
      mockGetFilesChangedSince.mockReturnValue(['apps/starter/src/App.tsx']); // changes under starter path
      mockGetPackageInfo.mockResolvedValue({ name: '@vite-powerflow/starter', version: '1.0.0' });

      // WHEN: We check the starter synchronization status
      const result = await checkStarterStatus(workspaceRoot, mockOutputChannel);

      // THEN: The status should be warning since there are uncommitted changes without a changeset
      expect(mockGetTemplateBaselineCommit).toHaveBeenCalledWith(workspaceRoot, mockOutputChannel);
      expect(mockGetCommitsSince).toHaveBeenCalled();
      expect(result).toEqual(
        expect.objectContaining({
          status: 'warning',
          message: '',
          commitCount: 2,
          packageVersion: '1.0.0',
          baselineCommit: 'baseline-commit-hash',
          currentCommit: 'current-commit-hash',
          commits: [
            { sha: 'c1', message: '' },
            { sha: 'c2', message: '' },
          ],
        })
      );
    });

    it('should return error when baseline commit is not found', async () => {
      // GIVEN: No changeset exists and the baseline commit cannot be found in the CLI template
      mockGetChangesetStatus.mockResolvedValue(null);
      mockGetTemplateBaselineCommit.mockResolvedValue('unknown');

      // WHEN: We check the starter synchronization status
      const result = await checkStarterStatus(workspaceRoot, mockOutputChannel);

      // THEN: An error status should be returned with an appropriate message
      expect(result.status).toBe('error');
      expect(result.message).toBe(
        'Template baseline commit not found in CLI template (package.json).'
      );
    });

    it('should handle sync status when no commits found', async () => {
      // GIVEN: No changeset exists and there are no new commits since the baseline
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

      // WHEN: We check the starter synchronization status
      const result = await checkStarterStatus(workspaceRoot, mockOutputChannel);

      // THEN: An in-sync result should be returned indicating everything is up to date
      expect(result).toEqual(expect.objectContaining(mockResult));
    });

    it('should handle errors gracefully', async () => {
      // GIVEN: An error occurs when checking for changesets, but baseline and current commits can be resolved
      const error = new Error('Test error');
      mockGetLatestChangesetForPackage.mockRejectedValue(error);
      // With new logic, we still resolve baseline/current and if no commits are found, we end up "sync"
      mockGetTemplateBaselineCommit.mockResolvedValue('baseline-commit-hash');
      mockGetCurrentCommit.mockReturnValue('current-commit-hash');
      mockGetCommitsSince.mockReturnValue([]);

      // WHEN: We check the starter synchronization status despite the error
      const result = await checkStarterStatus(workspaceRoot, mockOutputChannel);

      // THEN: The system should gracefully handle the error and return a sync result if no commits are found
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
      // GIVEN: A changeset exists for the CLI package and no files have changed after its anchor commit
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

      // WHEN: We check the CLI synchronization status
      const result = await checkCliStatus(workspaceRoot, mockOutputChannel);

      // THEN: The status should be pending since a changeset exists but no additional changes were made
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
      // GIVEN: The CLI package has not been published to npm yet
      const packageInfo = {
        name: '@vite-powerflow/create',
        version: '1.0.0',
      };

      mockGetPackageInfo.mockResolvedValue(packageInfo);
      mockGetChangesetStatus.mockResolvedValue(null);
      mockGetLatestNpmVersion.mockReturnValue(null);

      // WHEN: We check the CLI synchronization status
      const result = await checkCliStatus(workspaceRoot, mockOutputChannel);

      // THEN: The status should be sync since there's nothing to compare against yet
      expect(result).toEqual({
        status: 'sync',
        message: 'Not published on npm yet.',
        commitCount: 0,
        packageVersion: '1.0.0',
        baselineCommit: undefined,
        currentCommit: 'current-commit',
      });
    });

    it('should check commits against published npm version (warning required when no changeset)', async () => {
      // GIVEN: The CLI package is published on npm but has uncommitted changes and no changeset
      const packageInfo = { name: '@vite-powerflow/create', version: '1.0.0' };
      mockGetPackageInfo.mockResolvedValue(packageInfo);
      mockGetLatestNpmVersion.mockReturnValue('0.9.0');
      mockResolveRefToSha.mockReturnValue('resolved-cli-sha'); // baselineCommit unified to SHA
      mockGetLatestChangesetForPackage.mockResolvedValue(null); // no changeset
      mockGetCurrentCommit.mockReturnValue('current-commit');
      mockGetCommitsSince.mockReturnValue(['commit1']);
      mockGetFilesChangedSince.mockReturnValue(['packages/cli/src/index.ts']);

      // WHEN: We check the CLI synchronization status
      const result = await checkCliStatus(workspaceRoot, mockOutputChannel);

      // THEN: The status should be warning since there are uncommitted changes without a changeset
      expect(result).toEqual(
        expect.objectContaining({
          status: 'warning',
          message: '',
          baselineCommit: 'resolved-cli-sha',
          currentCommit: 'current-commit',
          packageVersion: '1.0.0',
          commitCount: 1,
          commits: [
            {
              message: '',
              sha: 'commit1',
            },
          ],
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
      // GIVEN: The CLI package.json file cannot be found or read
      mockGetPackageInfo.mockResolvedValue(null);

      const mockErrorResult: CheckResult = {
        status: 'error',
        message: 'Error during sync check: CLI package.json not found.',
        commitCount: 0,
      };
      mockHandleError.mockResolvedValue(mockErrorResult);

      // WHEN: We attempt to check the CLI synchronization status
      const result = await checkCliStatus(workspaceRoot, mockOutputChannel);

      // THEN: An error status should be returned indicating the package.json was not found
      expect(result).toEqual(mockErrorResult);
    });

    it('should handle unexpected errors', async () => {
      // GIVEN: An unexpected error occurs during the CLI status check process
      const error = new Error('Unexpected error');
      mockGetPackageInfo.mockRejectedValue(error);

      const mockErrorResult: CheckResult = {
        status: 'error',
        message: 'Error during sync check: Unexpected error',
        commitCount: 0,
      };
      mockHandleError.mockResolvedValue(mockErrorResult);

      // WHEN: We attempt to check the CLI synchronization status despite the error
      const result = await checkCliStatus(workspaceRoot, mockOutputChannel);

      // THEN: An error status should be returned with details about the unexpected error
      expect(result).toEqual(mockErrorResult);
    });
  });
});
