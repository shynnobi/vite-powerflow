import * as path from 'path';
import * as vscode from 'vscode';

import { CheckResult, SyncCheckConfig } from '../../types.js';
import { getPackageInfo } from '../packages.js';
import { formatBaseline, logMessage } from '../utils.js';

/**
 * Creates a baseline log message with optional version info for Starter
 */
export async function formatBaselineLog(
  config: SyncCheckConfig,
  baseline: string,
  workspaceRoot: string
): Promise<string> {
  const shortBaseline = formatBaseline(baseline);
  let logMessage = `📦 [${config.label}] Checking against baseline (commit/tag ${shortBaseline})`;

  // Add version info for Starter
  if (config.label === 'Starter') {
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
 */
export function handleUnreleasedCommits(
  config: SyncCheckConfig,
  newCommits: string[],
  outputChannel: vscode.OutputChannel
): CheckResult {
  const commitCount = newCommits.length;
  const warningLog = `🚨 [${config.label}] Found ${commitCount} unreleased commits.`;
  logMessage(outputChannel, warningLog);

  newCommits.forEach((commit: string) => {
    logMessage(outputChannel, `  - ${commit}`);
  });

  return {
    status: 'warning',
    message: `${commitCount} ${config.messages.unreleased}`,
    commitCount,
  };
}

/**
 * Handles the case where everything is in sync
 */
export function handleInSync(
  config: SyncCheckConfig,
  outputChannel: vscode.OutputChannel
): CheckResult {
  const successLog = `✅ [${config.label}] ${config.messages.inSync}`;
  logMessage(outputChannel, successLog);
  return {
    status: 'sync',
    message: config.messages.inSync,
    commitCount: 0,
  };
}

/**
 * Handles errors during sync check
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
