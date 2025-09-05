import * as path from 'path';
import * as vscode from 'vscode';

import { checkWillBeUpdatedByChangeset, getPackageNameFromConfig } from './changesetChecker';
import { readLatestChangeset } from './changesetReader';
import { getCommitsSince, getCurrentCommit, getFilesChangedSince } from './gitCommands';
import { resolveRefToSha } from './gitStatus';
import { readPackageInfo } from './packageReader';
import { CheckResult, PackageLabel, SyncCheckConfig } from './types';

/**
 * Checks the sync status of a package against its baseline (commit/tag).
 * This is the core "engine" of the sync logic.
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

  // Read package version for reporting (derive from commitPath)
  let packageVersion: string | undefined;
  try {
    // Derive package.json path from commitPath
    let packageJsonPath: string;

    if (config.label === PackageLabel.Starter) {
      // Special case: Starter uses the template package.json
      packageJsonPath = path.join(workspaceRoot, 'packages/cli/template/package.json');
    } else {
      // For other packages, derive from commitPath
      // e.g., "packages/utils/" -> "packages/utils/package.json"
      // e.g., "packages/cli/" -> "packages/cli/package.json"
      const normalizedPath = config.commitPath.replace(/\/$/, ''); // Remove trailing slash
      packageJsonPath = path.join(workspaceRoot, normalizedPath, 'package.json');
    }

    const pkg = await readPackageInfo(packageJsonPath);
    packageVersion = pkg?.version;
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

    // CORRECTION: Check if there are unreleased commits affecting this package path
    // Instead of just checking if the last global commit is a release commit
    if (unreleasedCommits.length === 0) {
      return {
        status: 'sync',
        message: config.messages.inSync,
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
          // Get commits covered by changeset (anchorSha..anchor)
          const coveredRaw = getCommitsSince(
            workspaceRoot,
            anchorSha,
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

      // If no changeset found, check if package will be updated via dependencies
      if (!latestChangeset) {
        // Check if this package will be updated by changeset due to internal dependencies
        const packageName = getPackageNameFromConfig(config);
        if (packageName) {
          const dependencyCheck = checkWillBeUpdatedByChangeset(
            workspaceRoot,
            packageName,
            outputChannel
          );

          if (dependencyCheck.willBeUpdated) {
            return {
              status: 'dependency-pending',
              message: `Will be updated to v${dependencyCheck.newVersion} via ${dependencyCheck.reason}`,
              commitCount: unreleasedCommits.length,
              packageVersion,
              futureVersion: dependencyCheck.newVersion,
              baselineCommit: baseline,
              currentCommit,
              commits: unreleasedCommits,
            };
          }
        }

        // Original logic: report pending/warning based on file changes
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
          releaseCommit: lastReleaseCommitSha,
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
          releaseCommit: lastReleaseCommitSha,
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
          releaseCommit: lastReleaseCommitSha,
          currentCommit,
          commits: unreleasedCommits,
        };
      }

      // Otherwise, changeset found and all files covered
      // Get future version from changeset status for Utils
      let futureVersion: string | undefined;
      if (config.label === PackageLabel.Utils) {
        const packageName = getPackageNameFromConfig(config);
        if (packageName) {
          const dependencyCheck = checkWillBeUpdatedByChangeset(
            workspaceRoot,
            packageName,
            outputChannel
          );
          futureVersion = dependencyCheck.newVersion;
        }
      }

      return {
        status: 'pending',
        message: `Changeset found: ${latestChangeset.fileName} (${latestChangeset.bumpType})`,
        commitCount: unreleasedCommits.length,
        packageVersion,
        futureVersion,
        baselineCommit: baseline,
        releaseCommit: lastReleaseCommitSha,
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
      releaseCommit: lastReleaseCommitSha,
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
