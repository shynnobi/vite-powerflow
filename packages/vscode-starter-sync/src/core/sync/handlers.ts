import * as path from 'path';
import * as vscode from 'vscode';

import { CheckResult, SyncCheckConfig } from '../../types.js';
import { getPackageInfo } from '../packages.js';

/**
 * Logs a message to both output channel and buffer
 */
export function logMessage(
  outputChannel: vscode.OutputChannel,
  outputBuffer: string[],
  message: string
): void {
  outputChannel.appendLine(message);
  outputBuffer.push(message);
}

/**
 * Formats a baseline (commit SHA or tag) for display in logs
 */
function formatBaseline(baseline: string): string {
  // If baseline looks like a commit SHA, truncate it; otherwise, display as-is (tag)
  return /^[a-f0-9]{7,40}$/i.test(baseline) ? baseline.substring(0, 7) : baseline;
}

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
  outputChannel: vscode.OutputChannel,
  outputBuffer: string[]
): CheckResult {
  const commitCount = newCommits.length;
  const warningLog = `🚨 [${config.label}] Found ${commitCount} unreleased commits.`;
  logMessage(outputChannel, outputBuffer, warningLog);

  newCommits.forEach((commit: string) => {
    logMessage(outputChannel, outputBuffer, `  - ${commit}`);
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
  outputChannel: vscode.OutputChannel,
  outputBuffer: string[]
): CheckResult {
  const successLog = `✅ [${config.label}] ${config.messages.inSync}`;
  logMessage(outputChannel, outputBuffer, successLog);
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
  outputChannel: vscode.OutputChannel,
  outputBuffer: string[]
): CheckResult {
  const errorLog = `❌ [${config.label}] ${config.messages.errorPrefix}: ${error.message}`;
  logMessage(outputChannel, outputBuffer, errorLog);
  return {
    status: 'error',
    message: config.messages.errorPrefix,
    commitCount: 0,
  };
}
