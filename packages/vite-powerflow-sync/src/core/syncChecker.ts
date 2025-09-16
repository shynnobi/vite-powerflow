import * as path from 'path';
import * as vscode from 'vscode';

import { handleSyncError } from './errorHandler';
import { getCurrentCommit } from './gitCommands';
import { resolveRefToSha } from './gitStatus';
import { readLatestNpmVersion, readPackageInfo } from './packageReader';
import { checkSyncStatus } from './syncEngine';
import { getAllMonitoredPackages } from './syncReporter';
import { CheckResult, LabeledCheckResult, SyncCheckConfig, SyncCheckError } from './types';

/**
 * Generic sync check for packages published on npm.
 * @param config - The package configuration from syncConfig.
 * @param workspaceRoot - Absolute path to workspace root.
 * @param outputChannel - VS Code output channel for logging.
 * @returns A CheckResult promise.
 */
async function checkNpmPackageSync(
  config: {
    label: any;
    pkgName: string;
    pkgPath: string;
    commitPath: string;
    baseline?: string;
  },
  workspaceRoot: string,
  outputChannel: vscode.OutputChannel
): Promise<CheckResult> {
  try {
    const packagePath = path.join(workspaceRoot, config.pkgPath);
    const pkg = await readPackageInfo(packagePath);

    if (!pkg) {
      throw new SyncCheckError(`${config.label} package.json not found.`);
    }

    const latestPublishedVersion = readLatestNpmVersion(pkg.name, outputChannel);

    // For private packages (like extension), use baseline from syncConfig
    let baselineSha: string;
    let messages: SyncCheckConfig['messages'];

    if (pkg.private === true) {
      // Use baseline from syncConfig for private packages
      baselineSha = config.baseline || 'unknown';
      messages = {
        notFound: `No baseline configured for ${config.label}.`,
        inSync: `${config.label} is up to date.`,
        unreleased: `unreleased ${config.label} changes found.`,
        errorPrefix: `${config.label} status check failed`,
      };
    } else {
      // For published packages, use npm version as baseline
      if (!latestPublishedVersion) {
        return {
          status: 'sync',
          message: 'Not published on npm yet.',
          commitCount: 0,
          packageVersion: pkg.version,
          currentCommit: getCurrentCommit(workspaceRoot),
        };
      }

      const npmTag = `${pkg.name}@${latestPublishedVersion}`;
      baselineSha = resolveRefToSha(workspaceRoot, npmTag, outputChannel) ?? npmTag;
      messages = {
        notFound: `No published ${config.label} tag found on npm.`,
        inSync: `All ${config.label} changes since ${npmTag} have been published.`,
        unreleased: `unreleased ${config.label} changes found.`,
        errorPrefix: `${config.label} status check failed`,
      };
    }

    const fullConfig: SyncCheckConfig = {
      label: config.label,
      baseline: () => Promise.resolve(baselineSha),
      commitPath: config.commitPath,
      targetPackage: config.pkgName,
      messages,
    };

    return await checkSyncStatus(fullConfig, workspaceRoot, outputChannel);
  } catch (error) {
    const syncError = error instanceof Error ? error : new Error(String(error));
    return handleSyncError(
      {
        label: config.label,
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

/**
 * Internal function to check starter sync status.
 */

/**
 * Runs all configured sync checks in parallel.
 * This is the main entry point for the sync logic.
 * @param workspaceRoot - Absolute path to workspace root.
 * @param outputChannel - VS Code output channel for logging.
 * @returns A promise that resolves to an array of all check results, each with its label.
 */
export async function runAllSyncChecks(
  workspaceRoot: string,
  outputChannel: vscode.OutputChannel
): Promise<LabeledCheckResult[]> {
  const monitoredPackages = await getAllMonitoredPackages(workspaceRoot, outputChannel);

  const allChecks = monitoredPackages.map(config =>
    checkNpmPackageSync(config, workspaceRoot, outputChannel).then(result => ({
      label: config.label,
      result,
    }))
  );

  return Promise.all(allChecks);
}
