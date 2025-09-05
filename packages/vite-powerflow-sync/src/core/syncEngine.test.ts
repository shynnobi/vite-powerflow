import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as vscode from 'vscode';

import { createMockOutputChannel } from '../utils/testUtils';
import { checkSyncStatus } from './syncEngine';
import { CheckResult, SyncCheckConfig } from './types';

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

const starterConfig = {
  label: 'Starter',
  targetPackage: '@vite-powerflow/starter',
  commitPath: 'apps/starter/',
  baseline: vi.fn().mockResolvedValue('baseline-commit-hash'),
  messages: {
    notFound: 'Template baseline commit not found in CLI template (package.json).',
    inSync: 'In sync with the latest CLI template baseline.',
    unreleased: 'unreleased change(s).',
    errorPrefix: 'Error during sync check',
  },
} as unknown as SyncCheckConfig;

describe('syncEngine', () => {
  let mockOutputChannel: vscode.OutputChannel;
  const workspaceRoot = '/workspace';

  beforeEach(() => {
    vi.clearAllMocks();
    mockOutputChannel = createMockOutputChannel();
  });

  describe('checkSyncStatus for Starter', () => {
    it('should return pending status when changeset exists for starter package and no changes after anchor', async () => {
      // GIVEN: A changeset exists for the starter package and no files have changed after its anchor commit
      const { getCurrentCommit, getCommitsSince, getFilesChangedSince } = await import(
        './gitCommands.js'
      );
      const { readLatestChangeset } = await import('./changesetReader.js');
      const { readPackageInfo } = await import('./packageReader.js');

      (starterConfig.baseline as any).mockResolvedValue('baseline-commit-hash');
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
      const result = await checkSyncStatus(starterConfig, workspaceRoot, mockOutputChannel);

      // THEN: The status should be pending since a changeset exists but no additional changes were made
      expect(result.status).toBe('pending');
      expect(result.packageVersion).toBe('1.0.0');
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
      const { getCurrentCommit, getCommitsSince, getFilesChangedSince } = await import(
        './gitCommands.js'
      );
      const { readLatestChangeset } = await import('./changesetReader.js');
      const { readPackageInfo } = await import('./packageReader.js');

      vi.mocked(readLatestChangeset).mockResolvedValue(null); // no changeset
      (starterConfig.baseline as any).mockResolvedValue('baseline-commit-hash');
      vi.mocked(getCurrentCommit).mockReturnValue('current-commit-hash');
      vi.mocked(getCommitsSince).mockReturnValue(['c1', 'c2']);
      vi.mocked(getFilesChangedSince).mockReturnValue(['apps/starter/src/App.tsx']); // changes under starter path
      vi.mocked(readPackageInfo).mockResolvedValue({
        name: '@vite-powerflow/starter',
        version: '1.0.0',
      });

      // WHEN: We check the starter synchronization status
      const result = await checkSyncStatus(starterConfig, workspaceRoot, mockOutputChannel);

      // THEN: The status should be warning since there are uncommitted changes without a changeset
      expect(starterConfig.baseline).toHaveBeenCalled();
      expect(vi.mocked(getCommitsSince)).toHaveBeenCalled();
      expect(result.status).toBe('warning');
      expect(result.commitCount).toBe(2);
      expect(result.packageVersion).toBe('1.0.0');
      expect(result.baselineCommit).toBe('baseline-commit-hash');
      expect(result.currentCommit).toBe('current-commit-hash');
    });

    it('should return error when baseline commit is not found', async () => {
      // GIVEN: No changeset exists and the baseline commit cannot be found in the CLI template
      const { readLatestChangeset } = await import('./changesetReader.js');

      vi.mocked(readLatestChangeset).mockResolvedValue(null);
      (starterConfig.baseline as any).mockResolvedValue('unknown');

      // WHEN: We check the starter synchronization status
      const result = await checkSyncStatus(starterConfig, workspaceRoot, mockOutputChannel);

      // THEN: An error status should be returned with an appropriate message
      expect(result.status).toBe('error');
      expect(result.message).toBe(
        'Template baseline commit not found in CLI template (package.json).'
      );
    });

    it('should handle sync status when no commits found', async () => {
      // GIVEN: No changeset exists and there are no new commits since the baseline
      const { getCurrentCommit, getCommitsSince } = await import('./gitCommands.js');
      const { readLatestChangeset } = await import('./changesetReader.js');
      const { handleInSync } = await import('./syncHandler.js');

      vi.mocked(readLatestChangeset).mockResolvedValue(null);
      (starterConfig.baseline as any).mockResolvedValue('baseline-commit-hash');
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
      const result = await checkSyncStatus(starterConfig, workspaceRoot, mockOutputChannel);

      // THEN: An in-sync result should be returned indicating everything is up to date
      expect(result).toEqual(expect.objectContaining(mockResult));
    });

    it('should handle errors gracefully', async () => {
      // GIVEN: An error occurs when checking for changesets, but baseline and current commits can be resolved
      const { getCurrentCommit, getCommitsSince } = await import('./gitCommands.js');
      const { readLatestChangeset } = await import('./changesetReader.js');

      const error = new Error('Test error');
      vi.mocked(readLatestChangeset).mockRejectedValue(error);
      // With new logic, we still resolve baseline/current and if no commits are found, we end up "sync"
      (starterConfig.baseline as any).mockResolvedValue('baseline-commit-hash');
      vi.mocked(getCurrentCommit).mockReturnValue('current-commit-hash');
      vi.mocked(getCommitsSince).mockReturnValue([]);

      // WHEN: We check the starter synchronization status despite the error
      const result = await checkSyncStatus(starterConfig, workspaceRoot, mockOutputChannel);

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

  // Note: CLI package tests are covered by integration tests elsewhere.
  // The checkSyncStatus function is primarily designed for the starter package flow.
  // CLI packages use checkNpmPackageSync which wraps checkSyncStatus with additional logic.
});
