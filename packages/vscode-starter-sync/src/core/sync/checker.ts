import * as path from 'path';
import * as vscode from 'vscode';

import { CheckResult, PackageLabel, SyncCheckConfig, SyncCheckError } from '../../types.js';
import { getLatestChangesetForPackage } from '../changesets.js';
import {
  getCommitsSince,
  getCurrentCommit,
  getFilesChangedSince,
  getTemplateBaselineCommit,
  resolveRefToSha,
} from '../git.js';
import { getLatestNpmVersion, getPackageInfo } from '../packages.js';
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
      // Determine whether there is a changeset and if newer changes exist after it
      const latestChangeset = await getLatestChangesetForPackage(
        workspaceRoot,
        config.targetPackage
      );

      // Regardless of commit messages, check if the package path actually changed since baseline
      const filesChangedSinceBaseline = getFilesChangedSince(
        workspaceRoot,
        baseline,
        config.commitPath,
        outputChannel
      );

      // Partition commits by changeset anchor if changeset exists
      let anchorForDiff: string | undefined = undefined;
      let coveredCommits: { sha: string; message: string }[] = [];
      let outsideCommits: { sha: string; message: string }[] = [];
      let filesChangedAfterChangeset: string[] = [];
      if (latestChangeset) {
        type ChangesetWithOptionalAnchor = typeof latestChangeset & { anchor?: unknown };
        const { anchor } = latestChangeset as ChangesetWithOptionalAnchor;
        anchorForDiff =
          typeof anchor === 'string' && anchor.length > 0 ? anchor : latestChangeset.lastCommitSha;
        if (anchorForDiff) {
          const coveredRaw = getCommitsSince(
            workspaceRoot,
            baseline,
            anchorForDiff,
            config.commitPath,
            outputChannel
          );
          coveredCommits = coveredRaw.map(line => {
            const [sha, ...msg] = line.split(' ');
            return { sha: sha?.substring(0, 7) || '', message: msg.join(' ') };
          });
          const outsideRaw = getCommitsSince(
            workspaceRoot,
            anchorForDiff,
            currentCommit,
            config.commitPath,
            outputChannel
          );
          outsideCommits = outsideRaw.map(line => {
            const [sha, ...msg] = line.split(' ');
            return { sha: sha?.substring(0, 7) || '', message: msg.join(' ') };
          });
          filesChangedAfterChangeset = getFilesChangedSince(
            workspaceRoot,
            anchorForDiff,
            config.commitPath,
            outputChannel
          );
        }
      }

      if (!latestChangeset) {
        if (filesChangedSinceBaseline.length === 0) {
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
        // No changeset found, all commits are not covered
        return {
          status: 'warning',
          message: '',
          commitCount: newCommits.length,
          packageVersion,
          baselineCommit: baseline,
          currentCommit,
          commits: newCommits,
        };
      } else {
        // Use the already calculated partition data from above
      }
      // If the anchor resolved to a tag or non-SHA ref, normalize to SHA for git diff correctness
      const normalizedAnchor =
        anchorForDiff && /^[0-9a-f]{40}$/i.test(anchorForDiff)
          ? anchorForDiff
          : anchorForDiff
            ? resolveRefToSha(workspaceRoot, anchorForDiff, outputChannel)
            : undefined;
      const filesChangedAfterNormalizedAnchor = normalizedAnchor
        ? getFilesChangedSince(workspaceRoot, normalizedAnchor, config.commitPath, outputChannel)
        : filesChangedAfterChangeset;

      if (filesChangedAfterNormalizedAnchor.length > 0) {
        // WARNING case 2: additional changes after the latest changeset
        return {
          status: 'warning',
          message: '',
          commitCount: newCommits.length,
          packageVersion,
          baselineCommit: baseline,
          currentCommit,
          commits: newCommits,
          changeset: { fileName: latestChangeset.fileName, bumpType: latestChangeset.bumpType },
          coveredCommits,
          notCoveredCommits: outsideCommits,
        };
      }
      // If we had an anchor but still no file change detected, add an explicit message if commits exist post-changeset
      if (
        anchorForDiff &&
        filesChangedSinceBaseline.length > 0 &&
        filesChangedAfterNormalizedAnchor.length === 0
      ) {
      }

      // If the package path did not change since baseline, don't force a package-level changeset message
      if (filesChangedSinceBaseline.length === 0) {
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

      // PENDING: changeset exists and use already calculated partition data
      return {
        status: 'pending',
        message: `Changeset found: ${latestChangeset.fileName} (${latestChangeset.bumpType})`,
        commitCount: newCommits.length,
        packageVersion,
        baselineCommit: baseline,
        currentCommit,
        commits: newCommits,
        changeset: { fileName: latestChangeset.fileName, bumpType: latestChangeset.bumpType },
        coveredCommits: coveredCommits,
        notCoveredCommits: [],
      };
    }

    // Default behavior when not targeting a specific package
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
    // Resolve tag to a commit SHA for robust, unified comparisons (commit..HEAD)
    const baselineSha = resolveRefToSha(workspaceRoot, cliNpmTag, outputChannel) ?? cliNpmTag;

    const config: SyncCheckConfig = {
      label: PackageLabel.Cli,
      baseline: () => Promise.resolve(baselineSha),
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
