import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as vscode from 'vscode';

import { createMockOutputChannel } from '../utils/testUtils.js';
import { checkCliSync, checkStarterSync } from './syncChecker.js';
import { CheckResult } from './types.js';

// Mock dependencies - adapted to new refactored structure
vi.mock('./changesetReader.js', () => ({
  readLatestChangeset: vi.fn(),
}));
vi.mock('./gitCommands.js', () => ({
  getCommitsSince: vi.fn(),
  getCurrentCommit: vi.fn(),
  getFilesChangedSince: vi.fn(),
}));
vi.mock('./gitStatus.js', () => ({
  getTemplateBaseline: vi.fn(),
  resolveRefToSha: vi.fn(),
}));
vi.mock('./packageReader.js', () => ({
  readLatestNpmVersion: vi.fn(),
  readPackageInfo: vi.fn(),
}));
vi.mock('./syncHandler.js', () => ({
  handleInSync: vi.fn(),
  handleUnreleasedCommits: vi.fn(),
}));
vi.mock('./errorHandler.js', () => ({
  handleSyncError: vi.fn(),
}));

describe('syncChecker', () => {
  let mockOutputChannel: vscode.OutputChannel;
  const workspaceRoot = '/workspace';

  beforeEach(() => {
    vi.clearAllMocks();
    mockOutputChannel = createMockOutputChannel();
  });

  describe('checkStarterSync', () => {
    it('should return pending status when changeset exists for starter package and no changes after anchor', async () => {
      // GIVEN: A changeset exists for the starter package and no files have changed after its anchor commit
      const { getTemplateBaseline } = await import('./gitStatus.js');
      const { getCurrentCommit, getCommitsSince, getFilesChangedSince } = await import(
        './gitCommands.js'
      );
      const { readLatestChangeset } = await import('./changesetReader.js');
      const { readPackageInfo } = await import('./packageReader.js');

      vi.mocked(getTemplateBaseline).mockResolvedValue('baseline-commit-hash');
      vi.mocked(getCurrentCommit).mockReturnValue('current-commit-hash');
      vi.mocked(getCommitsSince).mockReturnValue(['dummy-commit']); // presence of commits overall
      vi.mocked(getFilesChangedSince).mockReturnValue([]); // but none under apps/starter/ since baseline and anchor
      vi.mocked(readLatestChangeset).mockResolvedValue({
        fileName: 'test-changeset.md',
        bumpType: 'minor',
        lastCommitSha: 'anchor-sha',
      });
      vi.mocked(readPackageInfo).mockResolvedValue({
        name: '@vite-powerflow/starter',
        version: '1.0.0',
      });

      // WHEN: We check the starter synchronization status
      const result = await checkStarterSync(workspaceRoot, mockOutputChannel);

      // THEN: The status should be pending since a changeset exists but no additional changes were made
      expect(result).toEqual(
        expect.objectContaining({
          status: 'pending',
          packageVersion: '1.0.0',
        })
      );
      expect(vi.mocked(readLatestChangeset)).toHaveBeenCalled();
      expect(vi.mocked(getFilesChangedSince)).toHaveBeenCalledWith(
        workspaceRoot,
        'anchor-sha',
        'apps/starter/',
        mockOutputChannel
      );
    });

    it('should check git commits when no changeset exists (warning required)', async () => {
      // GIVEN: No changeset exists for the starter package and there are file changes under the starter path
      const { getTemplateBaseline } = await import('./gitStatus.js');
      const { getCurrentCommit, getCommitsSince, getFilesChangedSince } = await import(
        './gitCommands.js'
      );
      const { readLatestChangeset } = await import('./changesetReader.js');
      const { readPackageInfo } = await import('./packageReader.js');

      vi.mocked(readLatestChangeset).mockResolvedValue(null); // no changeset
      vi.mocked(getTemplateBaseline).mockResolvedValue('baseline-commit-hash');
      vi.mocked(getCurrentCommit).mockReturnValue('current-commit-hash');
      vi.mocked(getCommitsSince).mockReturnValue(['c1', 'c2']);
      vi.mocked(getFilesChangedSince).mockReturnValue(['apps/starter/src/App.tsx']); // changes under starter path
      vi.mocked(readPackageInfo).mockResolvedValue({
        name: '@vite-powerflow/starter',
        version: '1.0.0',
      });

      // WHEN: We check the starter synchronization status
      const result = await checkStarterSync(workspaceRoot, mockOutputChannel);

      // THEN: The status should be warning since there are uncommitted changes without a changeset
      expect(vi.mocked(getTemplateBaseline)).toHaveBeenCalledWith(workspaceRoot, mockOutputChannel);
      expect(vi.mocked(getCommitsSince)).toHaveBeenCalled();
      expect(result).toEqual(
        expect.objectContaining({
          status: 'warning',
          commitCount: 2,
          packageVersion: '1.0.0',
          baselineCommit: 'baseline-commit-hash',
          currentCommit: 'current-commit-hash',
        })
      );
    });

    it('should return error when baseline commit is not found', async () => {
      // GIVEN: No changeset exists and the baseline commit cannot be found in the CLI template
      const { getTemplateBaseline } = await import('./gitStatus.js');
      const { readLatestChangeset } = await import('./changesetReader.js');

      vi.mocked(readLatestChangeset).mockResolvedValue(null);
      vi.mocked(getTemplateBaseline).mockResolvedValue('unknown');

      // WHEN: We check the starter synchronization status
      const result = await checkStarterSync(workspaceRoot, mockOutputChannel);

      // THEN: An error status should be returned with an appropriate message
      expect(result.status).toBe('error');
      expect(result.message).toBe(
        'Template baseline commit not found in CLI template (package.json).'
      );
    });

    it('should handle sync status when no commits found', async () => {
      // GIVEN: No changeset exists and there are no new commits since the baseline
      const { getTemplateBaseline } = await import('./gitStatus.js');
      const { getCurrentCommit, getCommitsSince } = await import('./gitCommands.js');
      const { readLatestChangeset } = await import('./changesetReader.js');
      const { handleInSync } = await import('./syncHandler.js');

      vi.mocked(readLatestChangeset).mockResolvedValue(null);
      vi.mocked(getTemplateBaseline).mockResolvedValue('baseline-commit-hash');
      vi.mocked(getCurrentCommit).mockReturnValue('current-commit-hash');
      vi.mocked(getCommitsSince).mockReturnValue([]);
      const mockResult: CheckResult = {
        status: 'sync',
        message: 'In sync with the latest CLI template baseline.',
        commitCount: 0,
        packageVersion: '1.0.0',
        baselineCommit: 'baseline-commit-hash',
        currentCommit: 'current-commit-hash',
      };
      vi.mocked(handleInSync).mockResolvedValue(mockResult);

      // WHEN: We check the starter synchronization status
      const result = await checkStarterSync(workspaceRoot, mockOutputChannel);

      // THEN: An in-sync result should be returned indicating everything is up to date
      expect(result).toEqual(expect.objectContaining(mockResult));
    });

    it('should handle errors gracefully', async () => {
      // GIVEN: An error occurs when checking for changesets, but baseline and current commits can be resolved
      const { getTemplateBaseline } = await import('./gitStatus.js');
      const { getCurrentCommit, getCommitsSince } = await import('./gitCommands.js');
      const { readLatestChangeset } = await import('./changesetReader.js');

      const error = new Error('Test error');
      vi.mocked(readLatestChangeset).mockRejectedValue(error);
      // With new logic, we still resolve baseline/current and if no commits are found, we end up "sync"
      vi.mocked(getTemplateBaseline).mockResolvedValue('baseline-commit-hash');
      vi.mocked(getCurrentCommit).mockReturnValue('current-commit-hash');
      vi.mocked(getCommitsSince).mockReturnValue([]);

      // WHEN: We check the starter synchronization status despite the error
      const result = await checkStarterSync(workspaceRoot, mockOutputChannel);

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

  describe('checkCliSync', () => {
    it('should return pending when changeset exists for CLI and no changes after anchor', async () => {
      // GIVEN: A changeset exists for the CLI package and no files have changed after its anchor commit
      const { resolveRefToSha } = await import('./gitStatus.js');
      const { getCurrentCommit, getCommitsSince, getFilesChangedSince } = await import(
        './gitCommands.js'
      );
      const { readLatestChangeset } = await import('./changesetReader.js');
      const { readPackageInfo, readLatestNpmVersion } = await import('./packageReader.js');

      const packageInfo = { name: '@vite-powerflow/create', version: '1.0.0' };
      vi.mocked(readPackageInfo).mockResolvedValue(packageInfo);
      vi.mocked(readLatestNpmVersion).mockReturnValue('0.9.0');
      vi.mocked(resolveRefToSha).mockReturnValue('resolved-cli-sha');
      vi.mocked(getCurrentCommit).mockReturnValue('current-commit');
      // Simulate commits exist overall but none under CLI path after anchor
      vi.mocked(getCommitsSince).mockReturnValue(['c1']);
      vi.mocked(readLatestChangeset).mockResolvedValue({
        fileName: 'cli-changeset.md',
        bumpType: 'patch',
        lastCommitSha: 'cli-anchor',
      });
      vi.mocked(getFilesChangedSince).mockReturnValue([]); // no changes after anchor under CLI path

      // WHEN: We check the CLI synchronization status
      const result = await checkCliSync(workspaceRoot, mockOutputChannel);

      // THEN: The status should be pending since a changeset exists but no additional changes were made
      expect(result).toEqual(
        expect.objectContaining({
          status: 'pending',
          packageVersion: '1.0.0',
        })
      );
    });

    it('should handle package not published on npm', async () => {
      // GIVEN: The CLI package has not been published to npm yet
      const { readPackageInfo, readLatestNpmVersion } = await import('./packageReader.js');
      const { readLatestChangeset } = await import('./changesetReader.js');

      const packageInfo = {
        name: '@vite-powerflow/create',
        version: '1.0.0',
      };

      vi.mocked(readPackageInfo).mockResolvedValue(packageInfo);
      vi.mocked(readLatestChangeset).mockResolvedValue(null);
      vi.mocked(readLatestNpmVersion).mockReturnValue(null);

      // WHEN: We check the CLI synchronization status
      const result = await checkCliSync(workspaceRoot, mockOutputChannel);

      // THEN: The status should be sync since there's nothing to compare against yet
      expect(result).toEqual(
        expect.objectContaining({
          status: 'sync',
          message: 'Not published on npm yet.',
          packageVersion: '1.0.0',
        })
      );
    });

    it('should check commits against published npm version (warning required when no changeset)', async () => {
      // GIVEN: The CLI package is published on npm but has uncommitted changes and no changeset
      const { resolveRefToSha } = await import('./gitStatus.js');
      const { getCurrentCommit, getCommitsSince, getFilesChangedSince } = await import(
        './gitCommands.js'
      );
      const { readLatestChangeset } = await import('./changesetReader.js');
      const { readPackageInfo, readLatestNpmVersion } = await import('./packageReader.js');

      const packageInfo = { name: '@vite-powerflow/create', version: '1.0.0' };
      vi.mocked(readPackageInfo).mockResolvedValue(packageInfo);
      vi.mocked(readLatestNpmVersion).mockReturnValue('0.9.0');
      vi.mocked(resolveRefToSha).mockReturnValue('resolved-cli-sha'); // baselineCommit unified to SHA
      vi.mocked(readLatestChangeset).mockResolvedValue(null); // no changeset
      vi.mocked(getCurrentCommit).mockReturnValue('current-commit');
      vi.mocked(getCommitsSince).mockReturnValue(['commit1']);
      vi.mocked(getFilesChangedSince).mockReturnValue(['packages/cli/src/index.ts']);

      // WHEN: We check the CLI synchronization status
      const result = await checkCliSync(workspaceRoot, mockOutputChannel);

      // THEN: The status should be warning since there are uncommitted changes without a changeset
      expect(result).toEqual(
        expect.objectContaining({
          status: 'warning',
          baselineCommit: 'resolved-cli-sha',
          currentCommit: 'current-commit',
          packageVersion: '1.0.0',
          commitCount: 1,
        })
      );
      expect(vi.mocked(getCommitsSince)).toHaveBeenCalledWith(
        workspaceRoot,
        'resolved-cli-sha',
        'current-commit',
        'packages/cli/',
        mockOutputChannel
      );
    });

    it('should return error when CLI package.json not found', async () => {
      // GIVEN: The CLI package.json file cannot be found or read
      const { readPackageInfo } = await import('./packageReader.js');
      const { handleSyncError } = await import('./errorHandler.js');

      vi.mocked(readPackageInfo).mockResolvedValue(null);

      const mockErrorResult: CheckResult = {
        status: 'error',
        message: 'Error during sync check: CLI package.json not found.',
        commitCount: 0,
      };
      vi.mocked(handleSyncError).mockResolvedValue(mockErrorResult);

      // WHEN: We attempt to check the CLI synchronization status
      const result = await checkCliSync(workspaceRoot, mockOutputChannel);

      // THEN: An error status should be returned indicating the package.json was not found
      expect(result).toEqual(mockErrorResult);
    });

    it('should handle unexpected errors', async () => {
      // GIVEN: An unexpected error occurs during the CLI status check process
      const { readPackageInfo } = await import('./packageReader.js');
      const { handleSyncError } = await import('./errorHandler.js');

      const error = new Error('Unexpected error');
      vi.mocked(readPackageInfo).mockRejectedValue(error);

      const mockErrorResult: CheckResult = {
        status: 'error',
        message: 'Error during sync check: Unexpected error',
        commitCount: 0,
      };
      vi.mocked(handleSyncError).mockResolvedValue(mockErrorResult);

      // WHEN: We attempt to check the CLI synchronization status despite the error
      const result = await checkCliSync(workspaceRoot, mockOutputChannel);

      // THEN: An error status should be returned with details about the unexpected error
      expect(result).toEqual(mockErrorResult);
    });
  });
});
