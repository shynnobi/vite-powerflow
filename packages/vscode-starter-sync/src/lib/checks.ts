import * as path from 'path';
import * as vscode from 'vscode';

import { getCommitsSince, getCurrentCommit, getTemplateBaselineCommit } from './git';
import { getLatestNpmVersion, getPackageInfo } from './packages';
import { CheckResult } from './types';

export async function checkStarterStatus(
  workspaceRoot: string,
  outputChannel: vscode.OutputChannel,
  outputBuffer: string[]
): Promise<CheckResult> {
  try {
    const templateBaselineCommit = getTemplateBaselineCommit(workspaceRoot, outputChannel);
    if (templateBaselineCommit === 'unknown') {
      return {
        status: 'error',
        message: 'Template baseline commit not found in CLI template.',
        commitCount: 0,
      };
    }
    const shortTemplateBaselineCommit = templateBaselineCommit.substring(0, 7);
    const templateLog = `📦 [Starter] Checking against CLI template baseline (commit ${shortTemplateBaselineCommit})`;
    outputChannel.appendLine(templateLog);
    outputBuffer.push(templateLog);

    const currentCommit = getCurrentCommit(workspaceRoot);
    const newStarterCommits = getCommitsSince(
      workspaceRoot,
      templateBaselineCommit,
      currentCommit,
      'apps/starter/',
      outputChannel
    );

    if (newStarterCommits.length > 0) {
      const commitCount = newStarterCommits.length;
      const warningLog = `🚨 [Starter] Found ${commitCount} unreleased commits.`;
      outputChannel.appendLine(warningLog);
      outputBuffer.push(warningLog);
      newStarterCommits.forEach(c => {
        const commitLine = `  - ${c}`;
        outputChannel.appendLine(commitLine);
        outputBuffer.push(commitLine);
      });
      return {
        status: 'warning',
        message: `${commitCount} unreleased change(s).`,
        commitCount,
      };
    } else {
      const successLog = '✅ [Starter] In sync with the latest CLI template baseline.';
      outputChannel.appendLine(successLog);
      outputBuffer.push(successLog);
      return { status: 'sync', message: 'In sync.', commitCount: 0 };
    }
  } catch (error: any) {
    const errorLog = `❌ [Starter] Error during sync check: ${error.message}`;
    outputChannel.appendLine(errorLog);
    outputBuffer.push(errorLog);
    return { status: 'error', message: 'Error during sync check.', commitCount: 0 };
  }
}

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
      // This isn't an error, it just means we can't compare.
      const msg = 'Not published on npm yet.';
      outputChannel.appendLine(`ℹ️ [CLI] ${msg}`);
      outputBuffer.push(`ℹ️ [CLI] ${msg}`);
      return { status: 'sync', message: msg, commitCount: 0 };
    }

    const gitTag = `${cliPkg.name}@${latestPublishedVersion}`;
    const tagLog = `📦 [CLI] Checking against last published version tag (${gitTag})`;
    outputChannel.appendLine(tagLog);
    outputBuffer.push(tagLog);

    const currentCommit = getCurrentCommit(workspaceRoot);
    const newCliCommits = getCommitsSince(
      workspaceRoot,
      gitTag,
      currentCommit,
      'packages/cli/',
      outputChannel
    );

    if (newCliCommits.length > 0) {
      const commitCount = newCliCommits.length;
      const warningLog = `🚨 [CLI] Found ${commitCount} unreleased commits.`;
      outputChannel.appendLine(warningLog);
      outputBuffer.push(warningLog);
      newCliCommits.forEach(c => {
        const commitLine = `  - ${c}`;
        outputChannel.appendLine(commitLine);
        outputBuffer.push(commitLine);
      });
      return {
        status: 'warning',
        message: `${commitCount} unreleased change(s).`,
        commitCount,
      };
    } else {
      const successLog = '✅ [CLI] In sync with the latest published npm version.';
      outputChannel.appendLine(successLog);
      outputBuffer.push(successLog);
      return { status: 'sync', message: 'In sync.', commitCount: 0 };
    }
  } catch (error: any) {
    const errorLog = `❌ [CLI] Error during sync check: ${error.message}`;
    outputChannel.appendLine(errorLog);
    outputBuffer.push(errorLog);
    return { status: 'error', message: 'Error during sync check.', commitCount: 0 };
  }
}
