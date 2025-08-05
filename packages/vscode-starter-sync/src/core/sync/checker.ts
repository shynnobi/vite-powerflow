import * as path from 'path';
import * as vscode from 'vscode';

import { CheckResult, PackageLabel, SyncCheckConfig, SyncCheckError } from '../../types.js';
import { getChangesetStatus } from '../changesets.js';
import { getCommitsSince, getCurrentCommit, getTemplateBaselineCommit } from '../git.js';
import { getLatestNpmVersion, getPackageInfo } from '../packages.js';
import { logMessage } from '../utils.js';
import { handleError } from './handlers.js';

/**
 * Checks the sync status of a package or app based on the provided configuration.
 * Determines if there are unreleased commits, missing changesets, or errors.
 *
 * @param config - The sync check configuration (label, baseline, commitPath, etc.)
 * @param workspaceRoot - The root path of the workspace
 * @param outputChannel - VS Code output channel for logging
 * @returns Promise resolving to a CheckResult describing the sync state
 */
export async function getSyncStatus(
  config: SyncCheckConfig,
  workspaceRoot: string,
  outputChannel: vscode.OutputChannel
): Promise<CheckResult> {
  // Check for an existing changeset first
  if (config.targetPackage) {
    const changesetStatus = await getChangesetStatus(
      workspaceRoot,
      config.targetPackage,
      outputChannel
    );
    if (changesetStatus) {
      let packageVersion: string | undefined;
      try {
        if (config.label === PackageLabel.Starter) {
          const templatePackagePath = path.join(
            workspaceRoot,
            'packages/cli/template/package.json'
          );
          const templatePkg = await getPackageInfo(templatePackagePath);
          packageVersion = templatePkg?.version;
        } else if (config.label === PackageLabel.Cli) {
          const cliPackagePath = path.join(workspaceRoot, 'packages/cli/package.json');
          const cliPkg = await getPackageInfo(cliPackagePath);
          packageVersion = cliPkg?.version;
        }
      } catch {}
      return {
        status: 'pending',
        message: `Changeset found: ${changesetStatus.changeset.fileName} (${changesetStatus.changeset.bumpType})`,
        commitCount: 0,
        changeset: changesetStatus.changeset,
        packageVersion,
      };
    }
  }

  // Get the baseline commit/tag
  const baseline = await config.baseline();
  if (!baseline || baseline === 'unknown') {
    return {
      status: 'error',
      message: config.messages.notFound,
      commitCount: 0,
    };
  }

  // Get the current commit and collect new commits since the baseline
  const currentCommit = getCurrentCommit(workspaceRoot);
  const newCommitsRaw = getCommitsSince(
    workspaceRoot,
    baseline,
    currentCommit,
    config.commitPath,
    outputChannel
  );
  // Parse commit lines: '<sha> <message>'
  const newCommits = newCommitsRaw.map(line => {
    const [sha, ...msgParts] = line.split(' ');
    return { sha: sha?.substring(0, 7) || '', message: msgParts.join(' ') };
  });

  let packageVersion: string | undefined;
  try {
    if (config.label === PackageLabel.Starter) {
      const templatePackagePath = path.join(workspaceRoot, 'packages/cli/template/package.json');
      const templatePkg = await getPackageInfo(templatePackagePath);
      packageVersion = templatePkg?.version;
    } else if (config.label === PackageLabel.Cli) {
      const cliPackagePath = path.join(workspaceRoot, 'packages/cli/package.json');
      const cliPkg = await getPackageInfo(cliPackagePath);
      packageVersion = cliPkg?.version;
    }
  } catch {}

  if (newCommits.length > 0) {
    if (config.targetPackage) {
      const changesetStatus = await getChangesetStatus(
        workspaceRoot,
        config.targetPackage,
        outputChannel
      );
      if (!changesetStatus) {
        return {
          status: 'warning',
          message: `Unreleased changes detected in ${config.label} without a changeset! Please add a changeset before release.`,
          commitCount: newCommits.length,
          packageVersion,
          baselineCommit: baseline,
          currentCommit,
          commits: newCommits,
        };
      }
    }
    return {
      status: 'pending',
      message: config.messages.unreleased,
      commitCount: newCommits.length,
      packageVersion,
      baselineCommit: baseline,
      currentCommit,
      commits: newCommits,
    };
  }
  return {
    status: 'sync',
    message: config.messages.inSync,
    commitCount: 0,
    packageVersion,
    baselineCommit: baseline,
    currentCommit,
  };
}

/**
 * Checks if the starter app is in sync with the CLI template baseline commit.
 *
 * @param workspaceRoot - The workspace root path
 * @param outputChannel - VS Code output channel for logging
 * @returns Promise resolving to CheckResult describing the sync state
 */
export async function checkStarterStatus(
  workspaceRoot: string,
  outputChannel: vscode.OutputChannel
): Promise<CheckResult> {
  const config: SyncCheckConfig = {
    label: PackageLabel.Starter,
    baseline: () => Promise.resolve(getTemplateBaselineCommit(workspaceRoot, outputChannel)),
    commitPath: 'apps/starter/',
    targetPackage: '@vite-powerflow/starter',
    messages: {
      notFound: 'Template baseline commit not found in CLI template (package.json).',
      inSync: 'In sync with the latest CLI template baseline.',
      unreleased: 'unreleased change(s).',
      errorPrefix: 'Error during sync check',
    },
  };

  try {
    return await getSyncStatus(config, workspaceRoot, outputChannel);
  } catch (error) {
    const syncError = error instanceof Error ? error : new Error(String(error));
    return handleError(config, syncError, outputChannel);
  }
}

/**
 * Checks if the CLI package is in sync with the latest published npm version.
 *
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

    const latestPublishedVersion = getLatestNpmVersion(cliPkg.name, outputChannel);

    if (!latestPublishedVersion) {
      const message = 'Not published on npm yet.';
      logMessage(outputChannel, `ℹ️ [CLI] ${message}`);
      return {
        status: 'sync',
        message,
        commitCount: 0,
        packageVersion: cliPkg.version,
        baselineCommit: undefined,
        currentCommit: getCurrentCommit(workspaceRoot),
      };
    }

    const cliNpmTag = `${cliPkg.name}@${latestPublishedVersion}`;

    const config: SyncCheckConfig = {
      label: PackageLabel.Cli,
      baseline: () => Promise.resolve(cliNpmTag),
      commitPath: 'packages/cli/',
      targetPackage: '@vite-powerflow/create',
      messages: {
        notFound: 'No published CLI tag found on npm.',
        inSync: `All CLI changes since ${cliNpmTag} have been published.`,
        unreleased: 'unreleased CLI changes found.',
        errorPrefix: 'CLI status check failed',
      },
    };

    return await getSyncStatus(config, workspaceRoot, outputChannel);
  } catch (error) {
    const syncError = error instanceof Error ? error : new Error(String(error));
    return handleError(
      {
        label: PackageLabel.Cli,
        baseline: () => Promise.resolve(''),
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
