import * as path from 'path';
import * as vscode from 'vscode';

import { getCommitsSince, getCurrentCommit, getTemplateBaselineCommit } from './git';
import { getLatestNpmVersion, getPackageInfo } from './packages';
import { CheckResult } from './types';

/**
 * Checks the sync status of a workspace folder against a given baseline (commit or tag).
 * Handles logging and returns a CheckResult describing the sync state.
 *
 * @param label - Label for logs (e.g. 'Starter', 'CLI')
 * @param getBaseline - Synchronous function to get the baseline commit/tag
 * @param getBaselineAsync - Async function to get the baseline commit/tag (optional)
 * @param commitPath - Path to the folder to check for new commits
 * @param outputChannel - VS Code output channel for logging
 * @param outputBuffer - Buffer to collect log lines
 * @param workspaceRoot - Root path of the workspace
 * @param notFoundMsg - Message if the baseline is not found
 * @param inSyncMsg - Message if everything is up to date
 * @param unreleasedMsg - Message if there are unreleased commits
 * @param errorPrefix - Prefix for error messages
 * @returns A promise resolving to a CheckResult describing the sync state
 */
async function checkSyncStatus({
  label,
  getBaseline,
  getBaselineAsync,
  commitPath,
  outputChannel,
  outputBuffer,
  workspaceRoot,
  notFoundMsg,
  inSyncMsg,
  unreleasedMsg,
  errorPrefix,
}: {
  label: string;
  getBaseline?: () => string;
  getBaselineAsync?: () => Promise<string>;
  commitPath: string;
  outputChannel: vscode.OutputChannel;
  outputBuffer: string[];
  workspaceRoot: string;
  notFoundMsg: string;
  inSyncMsg: string;
  unreleasedMsg: string;
  errorPrefix: string;
}): Promise<CheckResult> {
  try {
    // Get the baseline commit/tag (sync or async)
    const baseline = getBaselineAsync ? await getBaselineAsync() : getBaseline!();
    // If baseline is missing or unknown, return error result
    if (!baseline || baseline === 'unknown') {
      return {
        status: 'error',
        message: notFoundMsg,
        commitCount: 0,
      };
    }
    // Log the baseline being checked
    const shortBaseline = baseline.substring(0, 7);
    const log = `📦 [${label}] Checking against baseline (commit/tag ${shortBaseline})`;
    outputChannel.appendLine(log);
    outputBuffer.push(log);

    // Get the current commit and collect new commits since the baseline
    const currentCommit = getCurrentCommit(workspaceRoot);
    const newCommits = getCommitsSince(
      workspaceRoot,
      baseline,
      currentCommit,
      commitPath,
      outputChannel
    );

    // If there are unreleased commits, log and return a warning result
    if (newCommits.length > 0) {
      const commitCount = newCommits.length;
      const warningLog = `🚨 [${label}] Found ${commitCount} unreleased commits.`;
      outputChannel.appendLine(warningLog);
      outputBuffer.push(warningLog);
      newCommits.forEach(c => {
        const commitLine = `  - ${c}`;
        outputChannel.appendLine(commitLine);
        outputBuffer.push(commitLine);
      });
      return {
        status: 'warning',
        message: `${commitCount} ${unreleasedMsg}`,
        commitCount,
      };
    } else {
      // If everything is up to date, log and return a sync result
      const successLog = `✅ [${label}] ${inSyncMsg}`;
      outputChannel.appendLine(successLog);
      outputBuffer.push(successLog);
      return { status: 'sync', message: inSyncMsg, commitCount: 0 };
    }
  } catch (error: any) {
    // Catch and log any unexpected errors
    const errorLog = `❌ [${label}] ${errorPrefix}: ${error.message}`;
    outputChannel.appendLine(errorLog);
    outputBuffer.push(errorLog);
    return { status: 'error', message: errorPrefix, commitCount: 0 };
  }
}

/**
 * Checks if the starter app is in sync with the CLI template baseline commit.
 * Logs the result and returns a CheckResult describing the sync state.
 *
 * @param workspaceRoot - Root path of the workspace
 * @param outputChannel - VS Code output channel for logging
 * @param outputBuffer - Buffer to collect log lines
 * @returns A promise resolving to a CheckResult describing the sync state
 */
export async function checkStarterStatus(
  workspaceRoot: string,
  outputChannel: vscode.OutputChannel,
  outputBuffer: string[]
): Promise<CheckResult> {
  return checkSyncStatus({
    label: 'Starter',
    getBaseline: () => getTemplateBaselineCommit(workspaceRoot, outputChannel),
    commitPath: 'apps/starter/',
    outputChannel,
    outputBuffer,
    workspaceRoot,
    notFoundMsg: 'Template baseline commit not found in CLI template.',
    inSyncMsg: 'In sync with the latest CLI template baseline.',
    unreleasedMsg: 'unreleased change(s).',
    errorPrefix: 'Error during sync check',
  });
}

/**
 * Checks if the CLI package is in sync with the latest published npm version.
 * Logs the result and returns a CheckResult describing the sync state.
 *
 * @param workspaceRoot - Root path of the workspace
 * @param outputChannel - VS Code output channel for logging
 * @param outputBuffer - Buffer to collect log lines
 * @returns A promise resolving to a CheckResult describing the sync state
 */
export async function checkCliStatus(
  workspaceRoot: string,
  outputChannel: vscode.OutputChannel,
  outputBuffer: string[]
): Promise<CheckResult> {
  try {
    const cliPackagePath = path.join(workspaceRoot, 'packages/cli/package.json');
    const cliPkg = await getPackageInfo(cliPackagePath);
    if (!cliPkg) {
      return { status: 'error', message: 'CLI package.json not found.', commitCount: 0 };
    }
    const latestPublishedVersion = await getLatestNpmVersion(
      cliPkg.name,
      outputChannel,
      outputBuffer
    );
    if (!latestPublishedVersion) {
      const msg = 'Not published on npm yet.';
      outputChannel.appendLine(`ℹ️ [CLI] ${msg}`);
      outputBuffer.push(`ℹ️ [CLI] ${msg}`);
      return { status: 'sync', message: msg, commitCount: 0 };
    }
    const gitTag = `${cliPkg.name}@${latestPublishedVersion}`;
    return checkSyncStatus({
      label: 'CLI',
      getBaseline: () => gitTag,
      commitPath: 'packages/cli/',
      outputChannel,
      outputBuffer,
      workspaceRoot,
      notFoundMsg: 'Published version tag not found.',
      inSyncMsg: 'In sync with the latest published npm version.',
      unreleasedMsg: 'unreleased change(s).',
      errorPrefix: 'Error during sync check',
    });
  } catch (error: any) {
    const errorLog = `❌ [CLI] Error during sync check: ${error.message}`;
    outputChannel.appendLine(errorLog);
    outputBuffer.push(errorLog);
    return { status: 'error', message: 'Error during sync check.', commitCount: 0 };
  }
}
