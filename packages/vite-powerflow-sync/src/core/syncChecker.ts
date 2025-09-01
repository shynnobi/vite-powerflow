import * as path from 'path';
import * as vscode from 'vscode';

import { MONITORED_NPM_PACKAGES, SPECIAL_PACKAGE_CONFIGS } from '../config/monitoredPackages.js';
import { handleSyncError } from './errorHandler.js';
import { getCurrentCommit } from './gitCommands.js';
import { resolveRefToSha } from './gitStatus.js';
import { readLatestNpmVersion, readPackageInfo } from './packageReader.js';
import { checkSyncStatus } from './syncEngine.js';
import { CheckResult, LabeledCheckResult, SyncCheckConfig, SyncCheckError } from './types.js';

/**
 * Generic sync check for packages published on npm.
 * @param config - The package-specific configuration from monitoredPackages.ts.
 * @param workspaceRoot - Absolute path to workspace root.
 * @param outputChannel - VS Code output channel for logging.
 * @returns A CheckResult promise.
 */
async function checkNpmPackageSync(
  config: (typeof MONITORED_NPM_PACKAGES)[number],
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
    const baselineSha = resolveRefToSha(workspaceRoot, npmTag, outputChannel) ?? npmTag;

    const fullConfig: SyncCheckConfig = {
      label: config.label,
      baseline: () => Promise.resolve(baselineSha),
      commitPath: config.commitPath,
      targetPackage: config.pkgName,
      messages: {
        notFound: `No published ${config.label} tag found on npm.`,
        inSync: `All ${config.label} changes since ${npmTag} have been published.`,
        unreleased: `unreleased ${config.label} changes found.`,
        errorPrefix: `${config.label} status check failed`,
      },
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
async function checkStarter(
  workspaceRoot: string,
  outputChannel: vscode.OutputChannel
): Promise<CheckResult> {
  const config: SyncCheckConfig = {
    ...SPECIAL_PACKAGE_CONFIGS.starter,
    baseline: () =>
      Promise.resolve(SPECIAL_PACKAGE_CONFIGS.starter.baseline(workspaceRoot, outputChannel)),
  };

  try {
    return await checkSyncStatus(config, workspaceRoot, outputChannel);
  } catch (error) {
    const syncError = error instanceof Error ? error : new Error(String(error));
    return handleSyncError(config, syncError, outputChannel);
  }
}

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
  const starterCheck = checkStarter(workspaceRoot, outputChannel).then(result => ({
    label: SPECIAL_PACKAGE_CONFIGS.starter.label,
    result,
  }));

  const npmPackageChecks = MONITORED_NPM_PACKAGES.map(config =>
    checkNpmPackageSync(config, workspaceRoot, outputChannel).then(result => ({
      label: config.label,
      result,
    }))
  );

  const allChecks = [starterCheck, ...npmPackageChecks];

  return Promise.all(allChecks);
}
