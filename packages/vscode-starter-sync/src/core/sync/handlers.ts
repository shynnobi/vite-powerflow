import * as path from 'path';
import * as vscode from 'vscode';

import { CheckResult, PackageLabel, SyncCheckConfig } from '../../types.js';
import { getPackageInfo } from '../packages.js';
import { formatBaseline, logMessage } from '../utils.js';

/**
 * Creates a baseline log message with optional version info for Starter
 * @param config - The sync check configuration
 * @param baseline - The baseline commit or tag
 * @param workspaceRoot - The workspace root path
 * @returns Promise resolving to formatted log message
 */
export async function formatBaselineLog(
  config: SyncCheckConfig,
  baseline: string,
  workspaceRoot: string
): Promise<string> {
  const shortBaseline = formatBaseline(baseline);
  let logMessage = `📦 [${config.label}] Checking against baseline (commit/tag ${shortBaseline})`;

  if (config.label === PackageLabel.Starter) {
    try {
      const templatePackagePath = path.join(workspaceRoot, 'packages/cli/template/package.json');
      const templatePkg = await getPackageInfo(templatePackagePath);
      if (templatePkg?.version) {
        logMessage = `📦 [Starter] Checking against CLI template baseline (commit ${shortBaseline}, version ${templatePkg.version})`;
      }
    } catch {
      // If we can't get version info, just use the basic message
    }
  }

  return logMessage;
}

/**
 * Handles the case where unreleased commits are found
 * @param config - The sync check configuration
 * @param newCommits - Array of new commits found
 * @param outputChannel - VS Code output channel for logging
 * @param additionalInfo - Optional additional information (version, commits)
 * @returns CheckResult with warning status
 */
export function handleUnreleasedCommits(
  config: SyncCheckConfig,
  newCommits: string[],
  outputChannel: vscode.OutputChannel,
  additionalInfo?: { packageVersion?: string; baselineCommit?: string; currentCommit?: string }
): CheckResult {
  const commitCount = newCommits.length;

  return {
    status: 'warning',
    message: `${commitCount} ${config.messages.unreleased}`,
    commitCount,
    packageVersion: additionalInfo?.packageVersion,
    baselineCommit: additionalInfo?.baselineCommit,
    currentCommit: additionalInfo?.currentCommit,
  };
}

/**
 * Handles the case where everything is in sync
 * @param config - The sync check configuration
 * @param outputChannel - VS Code output channel for logging
 * @param additionalInfo - Optional additional information (version, commits)
 * @returns CheckResult with sync status
 */
export function handleInSync(
  config: SyncCheckConfig,
  outputChannel: vscode.OutputChannel,
  additionalInfo?: { packageVersion?: string; baselineCommit?: string; currentCommit?: string }
): CheckResult {
  return {
    status: 'sync',
    message: config.messages.inSync,
    commitCount: 0,
    packageVersion: additionalInfo?.packageVersion,
    baselineCommit: additionalInfo?.baselineCommit,
    currentCommit: additionalInfo?.currentCommit,
  };
}

/**
 * Handles errors during sync check
 * @param config - The sync check configuration
 * @param error - The error that occurred
 * @param outputChannel - VS Code output channel for logging
 * @returns CheckResult with error status
 */
export function handleError(
  config: SyncCheckConfig,
  error: Error,
  outputChannel: vscode.OutputChannel
): CheckResult {
  const errorLog = `❌ [${config.label}] ${config.messages.errorPrefix}: ${error.message}`;
  logMessage(outputChannel, errorLog);
  return {
    status: 'error',
    message: config.messages.errorPrefix,
    commitCount: 0,
  };
}
