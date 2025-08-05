import * as path from 'path';
import * as vscode from 'vscode';

import { CheckResult, SyncCheckConfig } from '../../types.js';
import { getChangesetStatus } from '../changesets.js';
import { getCommitsSince, getCurrentCommit, getTemplateBaselineCommit } from '../git.js';
import { getLatestNpmVersion, getPackageInfo } from '../packages.js';
import { logMessage } from '../utils.js';
import { handleError, handleInSync, handleUnreleasedCommits } from './handlers.js';

/**
 * Custom error class for sync check operations
 */
class SyncCheckError extends Error {
  constructor(
    message: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'SyncCheckError';
  }
}

/**
 * Checks the sync status of a workspace folder against a given baseline
 * @param config - The sync check configuration
 * @param outputChannel - VS Code output channel for logging
 * @param workspaceRoot - The workspace root path
 * @returns Promise resolving to CheckResult describing the sync state
 */
async function checkSyncStatus(
  config: SyncCheckConfig,
  outputChannel: vscode.OutputChannel,
  workspaceRoot: string
): Promise<CheckResult> {
  try {
    // Check for an existing changeset first
    if (config.targetPackage) {
      const changesetStatus = await getChangesetStatus(
        workspaceRoot,
        config.targetPackage,
        outputChannel
      );
      if (changesetStatus) {
        // Get package version for changeset results too
        let packageVersion: string | undefined;
        try {
          if (config.label === 'Starter') {
            const templatePackagePath = path.join(
              workspaceRoot,
              'packages/cli/template/package.json'
            );
            const templatePkg = await getPackageInfo(templatePackagePath);
            packageVersion = templatePkg?.version;
          } else if (config.label === 'CLI') {
            const cliPackagePath = path.join(workspaceRoot, 'packages/cli/package.json');
            const cliPkg = await getPackageInfo(cliPackagePath);
            packageVersion = cliPkg?.version;
          }
        } catch {
          // Ignore version retrieval errors
        }

        return {
          status: 'pending',
          message: `Changeset found: ${changesetStatus.changeset.fileName} (${changesetStatus.changeset.bumpType})`,
          commitCount: 0, // Not relevant when a changeset is pending
          changeset: changesetStatus.changeset,
          packageVersion,
        };
      }
    }

    // Get the baseline commit/tag
    const baseline = await Promise.resolve(config.baseline());

    // If baseline is missing or unknown, return error result
    if (!baseline || baseline === 'unknown') {
      return {
        status: 'error',
        message: config.messages.notFound,
        commitCount: 0,
      };
    }

    // Get the current commit and collect new commits since the baseline
    const currentCommit = getCurrentCommit(workspaceRoot);
    const newCommits = getCommitsSince(
      workspaceRoot,
      baseline,
      currentCommit,
      config.commitPath,
      outputChannel
    );

    // Get package version if possible
    let packageVersion: string | undefined;
    try {
      if (config.label === 'Starter') {
        const templatePackagePath = path.join(workspaceRoot, 'packages/cli/template/package.json');
        const templatePkg = await getPackageInfo(templatePackagePath);
        packageVersion = templatePkg?.version;
      } else if (config.label === 'CLI') {
        const cliPackagePath = path.join(workspaceRoot, 'packages/cli/package.json');
        const cliPkg = await getPackageInfo(cliPackagePath);
        packageVersion = cliPkg?.version;
      }
    } catch {
      // Ignore version retrieval errors
    }

    // Prepare additional info for handlers
    const additionalInfo = {
      packageVersion,
      baselineCommit: baseline,
      currentCommit,
    };

    // Handle results based on commit count
    return newCommits.length > 0
      ? handleUnreleasedCommits(config, newCommits, outputChannel, additionalInfo)
      : handleInSync(config, outputChannel, additionalInfo);
  } catch (error) {
    const syncError = error instanceof Error ? error : new Error(String(error));
    return handleError(config, syncError, outputChannel);
  }
}

/**
 * Checks if the starter app is in sync with the CLI template baseline commit
 * @param workspaceRoot - The workspace root path
 * @param outputChannel - VS Code output channel for logging
 * @returns Promise resolving to CheckResult describing the sync state
 */
export async function checkStarterStatus(
  workspaceRoot: string,
  outputChannel: vscode.OutputChannel
): Promise<CheckResult> {
  const config: SyncCheckConfig = {
    label: 'Starter',
    baseline: () => getTemplateBaselineCommit(workspaceRoot, outputChannel),
    commitPath: 'apps/starter/',
    targetPackage: '@vite-powerflow/starter',
    messages: {
      notFound: 'Template baseline commit not found in CLI template (package.json).',
      inSync: 'In sync with the latest CLI template baseline.',
      unreleased: 'unreleased change(s).',
      errorPrefix: 'Error during sync check',
    },
  };

  return checkSyncStatus(config, outputChannel, workspaceRoot);
}

/**
 * Checks if the CLI package is in sync with the latest published npm version
 * @param workspaceRoot - The workspace root path
 * @param outputChannel - VS Code output channel for logging
 * @returns Promise resolving to CheckResult describing the sync state
 */
export async function checkCliStatus(
  workspaceRoot: string,
  outputChannel: vscode.OutputChannel
): Promise<CheckResult> {
  try {
    const cliPackagePath = path.join(workspaceRoot, 'packages/cli/package.json');
    const cliPkg = await getPackageInfo(cliPackagePath);

    if (!cliPkg) {
      throw new SyncCheckError('CLI package.json not found.');
    }

    const latestPublishedVersion = await getLatestNpmVersion(cliPkg.name, outputChannel);

    if (!latestPublishedVersion) {
      const message = 'Not published on npm yet.';
      logMessage(outputChannel, `ℹ️ [CLI] ${message}`);
      return { status: 'sync', message, commitCount: 0 };
    }

    const cliNpmTag = `${cliPkg.name}@${latestPublishedVersion}`;

    const config: SyncCheckConfig = {
      label: 'CLI',
      baseline: () => cliNpmTag,
      commitPath: 'packages/cli/',
      targetPackage: '@vite-powerflow/create',
      messages: {
        notFound: 'No published CLI tag found on npm.',
        inSync: `All CLI changes since ${cliNpmTag} have been published.`,
        unreleased: 'unreleased CLI changes found.',
        errorPrefix: 'CLI status check failed',
      },
    };

    return checkSyncStatus(config, outputChannel, workspaceRoot);
  } catch (error) {
    const syncError = error instanceof Error ? error : new Error(String(error));
    return handleError(
      {
        label: 'CLI',
        baseline: () => '',
        commitPath: '',
        messages: {
          notFound: '',
          inSync: '',
          unreleased: '',
          errorPrefix: 'Error during sync check',
        },
      },
      syncError,
      outputChannel
    );
  }
}
