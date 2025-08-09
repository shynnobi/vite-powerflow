import * as path from 'path';
import * as vscode from 'vscode';

import { readLatestChangeset } from './changesetReader.js';
import { handleSyncError } from './errorHandler.js';
import { getCommitsSince, getCurrentCommit, getFilesChangedSince } from './gitCommands.js';
import { getTemplateBaseline, resolveRefToSha } from './gitStatus.js';
import { readLatestNpmVersion, readPackageInfo } from './packageReader.js';
import { CheckResult, PackageLabel, SyncCheckConfig, SyncCheckError } from './types.js';

/**
 * Checks the sync status of a package against its baseline (commit/tag).
 * Handles detection of unreleased commits, changeset coverage, and auto-release commits.
 * Returns a CheckResult describing the sync state, unreleased commits, and changeset coverage.
 *
 * @param config - SyncCheckConfig describing the package, baseline logic, and messages
 * @param workspaceRoot - Absolute path to the workspace root
 * @param outputChannel - VS Code output channel for logging
 * @returns Promise<CheckResult> describing sync status and details
 */
export async function checkSyncStatus(
  config: SyncCheckConfig,
  workspaceRoot: string,
  outputChannel: vscode.OutputChannel
): Promise<CheckResult> {
  // Resolve baseline commit/tag for comparison
  const baseline = await config.baseline();
  if (!baseline || baseline === 'unknown') {
    return {
      status: 'error',
      message: config.messages.notFound,
      commitCount: 0,
    };
  }

  const currentCommit = getCurrentCommit(workspaceRoot);
  // Get all commits since baseline (full SHA)
  const allCommitsRaw = getCommitsSince(
    workspaceRoot,
    baseline,
    currentCommit,
    config.commitPath,
    outputChannel
  );
  const allCommits = allCommitsRaw.map(line => {
    const [sha, ...msgParts] = line.split(' ');
    return { sha: sha?.substring(0, 40) || '', message: msgParts.join(' ') };
  });

  // Read package version for reporting (Starter/CLI)
  let packageVersion: string | undefined;
  try {
    if (config.label === PackageLabel.Starter) {
      const templatePackagePath = path.join(workspaceRoot, 'packages/cli/template/package.json');
      const templatePkg = await readPackageInfo(templatePackagePath);
      packageVersion = templatePkg?.version;
    } else if (config.label === PackageLabel.Cli) {
      const cliPackagePath = path.join(workspaceRoot, 'packages/cli/package.json');
      const cliPkg = await readPackageInfo(cliPackagePath);
      packageVersion = cliPkg?.version;
    }
  } catch {}

  // Main sync logic: detect auto-release commit, unreleased commits, and changeset coverage
  if (allCommits.length > 0) {
    // Find the last changeset release commit (auto-release) in the commit list
    const releaseCommitIndex = allCommits.findLastIndex(c =>
      /chore: release new versions|Version Packages/i.test(c.message)
    );
    // Get SHA of last release commit (if any)
    const lastReleaseCommitSha =
      releaseCommitIndex >= 0 ? allCommits[releaseCommitIndex].sha : undefined;
    // Use the newer of baseline and last release commit as the anchor for unreleased commit detection
    let anchorSha = baseline;
    if (lastReleaseCommitSha) {
      // Find index of lastReleaseCommitSha in allCommits
      const anchorIndex = allCommits.findIndex(c => c.sha === lastReleaseCommitSha);
      if (anchorIndex >= 0) {
        anchorSha = allCommits[anchorIndex].sha;
      }
    }
    // Get unreleased commits after anchorSha
    const unreleasedRaw = getCommitsSince(
      workspaceRoot,
      anchorSha,
      currentCommit,
      config.commitPath,
      outputChannel
    );
    const unreleasedCommits = unreleasedRaw.map(line => {
      const [sha, ...msgParts] = line.split(' ');
      return { sha: sha?.substring(0, 7) || '', message: msgParts.join(' ') };
    });
    const lastCommit = allCommits[allCommits.length - 1];

    // If last commit is the auto-release commit, package is in sync
    if (lastReleaseCommitSha && lastCommit && lastCommit.sha === lastReleaseCommitSha) {
      return {
        status: 'sync',
        message: '',
        commitCount: 0,
        packageVersion,
        baselineCommit: baseline,
        releaseCommit: lastReleaseCommitSha,
        currentCommit,
        commits: [],
      };
    }

    // If targetPackage is set, check changeset coverage and file changes
    if (config.targetPackage) {
      const latestChangeset = await readLatestChangeset(workspaceRoot, config.targetPackage);

      // Get files changed since baseline
      const filesChangedSinceBaseline = getFilesChangedSince(
        workspaceRoot,
        baseline,
        config.commitPath,
        outputChannel
      );

      let anchorForDiff: string | undefined = undefined;
      let coveredCommits: { sha: string; message: string }[] = [];
      let outsideCommits: { sha: string; message: string }[] = [];
      let filesChangedAfterChangeset: string[] = [];
      if (latestChangeset) {
        // Use anchor from changeset if present, else lastCommitSha
        type ChangesetWithOptionalAnchor = typeof latestChangeset & { anchor?: unknown };
        const { anchor } = latestChangeset as ChangesetWithOptionalAnchor;
        anchorForDiff =
          typeof anchor === 'string' && anchor.length > 0 ? anchor : latestChangeset.lastCommitSha;
        if (anchorForDiff) {
          // Get commits covered by changeset (baseline..anchor)
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
          // Get commits not covered by changeset (anchor..current)
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
          // Get files changed after changeset anchor
          filesChangedAfterChangeset = getFilesChangedSince(
            workspaceRoot,
            anchorForDiff,
            config.commitPath,
            outputChannel
          );
        }
      }

      // If no changeset found, report pending/warning based on file changes
      if (!latestChangeset) {
        if (filesChangedSinceBaseline.length === 0) {
          return {
            status: 'pending',
            message: config.messages.unreleased,
            commitCount: unreleasedCommits.length,
            packageVersion,
            baselineCommit: baseline,
            currentCommit,
            commits: unreleasedCommits,
          };
        }
        return {
          status: 'warning',
          message: '',
          commitCount: unreleasedCommits.length,
          packageVersion,
          baselineCommit: baseline,
          currentCommit,
          commits: unreleasedCommits,
        };
      }

      // Normalize anchor SHA for diffing
      const normalizedAnchor =
        anchorForDiff && /^[0-9a-f]{40}$/i.test(anchorForDiff)
          ? anchorForDiff
          : anchorForDiff
            ? resolveRefToSha(workspaceRoot, anchorForDiff, outputChannel)
            : undefined;
      const filesChangedAfterNormalizedAnchor = normalizedAnchor
        ? getFilesChangedSince(workspaceRoot, normalizedAnchor, config.commitPath, outputChannel)
        : filesChangedAfterChangeset;

      // If files changed after changeset, report warning
      if (filesChangedAfterNormalizedAnchor.length > 0) {
        return {
          status: 'warning',
          message: '',
          commitCount: unreleasedCommits.length,
          packageVersion,
          baselineCommit: baseline,
          currentCommit,
          commits: unreleasedCommits,
          changeset: { fileName: latestChangeset.fileName, bumpType: latestChangeset.bumpType },
          coveredCommits,
          notCoveredCommits: outsideCommits,
        };
      }

      // If no files changed since baseline, report pending
      if (filesChangedSinceBaseline.length === 0) {
        return {
          status: 'pending',
          message: config.messages.unreleased,
          commitCount: unreleasedCommits.length,
          packageVersion,
          baselineCommit: baseline,
          currentCommit,
          commits: unreleasedCommits,
        };
      }

      // Otherwise, changeset found and all files covered
      return {
        status: 'pending',
        message: `Changeset found: ${latestChangeset.fileName} (${latestChangeset.bumpType})`,
        commitCount: unreleasedCommits.length,
        packageVersion,
        baselineCommit: baseline,
        currentCommit,
        commits: unreleasedCommits,
        changeset: { fileName: latestChangeset.fileName, bumpType: latestChangeset.bumpType },
        coveredCommits: coveredCommits,
        notCoveredCommits: [],
      };
    }

    // No changeset logic: report pending with unreleased commits
    return {
      status: 'pending',
      message: config.messages.unreleased,
      commitCount: unreleasedCommits.length,
      packageVersion,
      baselineCommit: baseline,
      currentCommit,
      commits: unreleasedCommits,
    };
  }
  // No commits since baseline: package is in sync
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
 * Checks sync status for the Starter package against the CLI template baseline.
 * Returns a CheckResult describing sync state and unreleased changes.
 *
 * @param workspaceRoot - Absolute path to workspace root
 * @param outputChannel - VS Code output channel for logging
 * @returns Promise<CheckResult> describing sync status
 */
export async function checkStarterSync(
  workspaceRoot: string,
  outputChannel: vscode.OutputChannel
): Promise<CheckResult> {
  const config: SyncCheckConfig = {
    label: PackageLabel.Starter,
    baseline: () => Promise.resolve(getTemplateBaseline(workspaceRoot, outputChannel)),
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
    return await checkSyncStatus(config, workspaceRoot, outputChannel);
  } catch (error) {
    const syncError = error instanceof Error ? error : new Error(String(error));
    return handleSyncError(config, syncError, outputChannel);
  }
}

/**
 * Checks sync status for the CLI package against the latest published npm version/tag.
 * Returns a CheckResult describing sync state and unreleased changes.
 *
 * @param workspaceRoot - Absolute path to workspace root
 * @param outputChannel - VS Code output channel for logging
 * @returns Promise<CheckResult> describing sync status
 */
export async function checkCliSync(
  workspaceRoot: string,
  outputChannel: vscode.OutputChannel
): Promise<CheckResult> {
  try {
    const cliPackagePath = path.join(workspaceRoot, 'packages/cli/package.json');
    const cliPkg = await readPackageInfo(cliPackagePath);

    if (!cliPkg) {
      throw new SyncCheckError('CLI package.json not found.');
    }

    // Get latest published npm version for CLI
    const latestPublishedVersion = readLatestNpmVersion(cliPkg.name, outputChannel);

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

    // Resolve baseline SHA from npm tag
    const cliNpmTag = `${cliPkg.name}@${latestPublishedVersion}`;
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

    return await checkSyncStatus(config, workspaceRoot, outputChannel);
  } catch (error) {
    const syncError = error instanceof Error ? error : new Error(String(error));
    return handleSyncError(
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
