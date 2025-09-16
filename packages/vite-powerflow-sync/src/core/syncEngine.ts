import * as path from 'path';
import * as vscode from 'vscode';

import { checkWillBeUpdatedByChangeset, getPackageNameFromConfig } from './changesetChecker.js';
import { readLatestChangeset } from './changesetReader.js';
import { getCommitsSince, getCurrentCommit, getFilesChangedSince } from './gitCommands.js';
import { resolveRefToSha } from './gitStatus.js';
import { readPackageInfo } from './packageReader.js';
import { CheckResult, SyncCheckConfig } from './types.js';

/**
 * Core sync engine that determines if a package is in sync with its published version.
 *
 * This function implements a sophisticated multi-phase analysis:
 *
 * PHASE 1: Resolve baseline reference point
 * PHASE 2: Gather package-specific commit history
 * PHASE 3: Find most recent release commit
 * PHASE 4: Extract current package version
 * PHASE 5: Analyze sync status using commit history
 * PHASE 6: Determine anchor commit for unreleased changes
 * PHASE 7: Identify unreleased commits
 * PHASE 8: Make final sync status decision
 * PHASE 9: Perform changeset analysis (if applicable)
 *
 * Key concepts:
 * - "Baseline": Reference point (tag/commit) representing last known good state
 * - "Anchor": Commit representing last published state (used for unreleased detection)
 * - "Unreleased commits": Commits after anchor that haven't been published yet
 * - Package is "in sync" if all commits since last release are properly covered
 *
 * @param config - Package configuration with paths, baseline resolver, and messages
 * @param workspaceRoot - Absolute path to workspace root directory
 * @param outputChannel - VS Code output channel for logging/debugging
 * @returns Detailed sync analysis with commit information and actionable recommendations
 */
export async function checkSyncStatus(
  config: SyncCheckConfig,
  workspaceRoot: string,
  outputChannel: vscode.OutputChannel
): Promise<CheckResult> {
  // ============================================================================
  // PHASE 1: RESOLVE BASELINE REFERENCE
  // ============================================================================

  // The baseline represents the "last known good state" of this package
  // It could be a version tag (e.g., @vite-powerflow/utils@0.0.6) or a specific commit
  // This serves as our reference point for determining what has changed
  const baseline = await config.baseline();
  if (!baseline || baseline === 'unknown') {
    return {
      status: 'error',
      message: config.messages.notFound,
      commitCount: 0,
    };
  }

  const currentCommit = getCurrentCommit(workspaceRoot);

  // ============================================================================
  // PHASE 2: GATHER PACKAGE-SPECIFIC COMMIT HISTORY
  // ============================================================================

  // Retrieve all commits that affect this package's directory since baseline
  // IMPORTANT: We filter by config.commitPath to only get commits touching this package
  // This is NOT all commits in the project, only those relevant to this package!
  const allCommitsRaw = getCommitsSince(
    workspaceRoot,
    baseline, // Start from this package's baseline (not project start!)
    currentCommit, // Go until current HEAD
    config.commitPath, // Filter to only commits affecting this package path
    outputChannel
  );
  const allCommits = allCommitsRaw.map(line => {
    const [sha, ...msgParts] = line.split(' ');
    return { sha: sha?.substring(0, 40) || '', message: msgParts.join(' ') };
  });

  // ============================================================================
  // PHASE 3: FIND MOST RECENT RELEASE COMMIT
  // ============================================================================

  // Search for the most recent "chore: release new versions" or "Version Packages" commit
  // This represents the last time packages were published to NPM
  // CRITICAL: We search globally (across all packages) using empty path filter
  // to find release commits that may cover this specific package
  let lastReleaseCommitSha: string | undefined;
  try {
    const allCommitsUnfilteredRaw = getCommitsSince(
      workspaceRoot,
      baseline, // Start from baseline (not project start!)
      currentCommit, // Go to current HEAD
      '', // Empty path = search ALL commits (not just this package)
      outputChannel
    );

    // For NPM packages, we want the FIRST release commit (oldest in range)
    // because that's the one that corresponds to the published version
    const releaseCommitIndex = allCommitsUnfilteredRaw.findIndex(line =>
      /chore: release new versions|Version Packages/i.test(line)
    );
    if (releaseCommitIndex >= 0) {
      const [releaseSha] = allCommitsUnfilteredRaw[releaseCommitIndex].split(' ');
      lastReleaseCommitSha = releaseSha?.substring(0, 40);
    }
  } catch (_error) {
    // If unfiltered search fails, fallback to filtered search
    const releaseCommitIndex = allCommits.findIndex(c =>
      /chore: release new versions|Version Packages/i.test(c.message)
    );
    lastReleaseCommitSha = releaseCommitIndex >= 0 ? allCommits[releaseCommitIndex].sha : undefined;
  }

  // Read package version for reporting (derive from commitPath)
  let packageVersion: string | undefined;
  try {
    // Derive package.json path from commitPath
    let packageJsonPath: string;

    // Derive package.json path from commitPath for all packages
    // e.g., "packages/utils/" -> "packages/utils/package.json"
    // e.g., "packages/cli/" -> "packages/cli/package.json"
    // e.g., "apps/starter/" -> "apps/starter/package.json"
    const normalizedPath = config.commitPath.replace(/\/$/, ''); // Remove trailing slash
    packageJsonPath = path.join(workspaceRoot, normalizedPath, 'package.json');

    const pkg = await readPackageInfo(packageJsonPath);
    packageVersion = pkg?.version;
  } catch {
    // Ignore errors when reading package info
  }

  // ============================================================================
  // PHASE 4: ANALYZE SYNC STATUS USING COMMIT HISTORY
  // ============================================================================

  if (allCommits.length > 0) {
    // ============================================================================
    // PHASE 5: DETERMINE ANCHOR COMMIT FOR UNRELEASED CHANGES
    // ============================================================================

    // The "anchor" is the commit that represents the last known published state
    // This is CRUCIAL: we consider all commits AFTER this anchor as "unreleased"
    //
    // Priority order for anchor selection:
    // 1. Last release commit (preferred) - represents latest published version
    // 2. Baseline commit (fallback) - represents last known good state
    //
    // This determines what commits need changesets vs what's already covered
    let anchorSha = baseline; // Start with baseline as fallback
    if (lastReleaseCommitSha) {
      // CRITICAL FIX: Use the release commit SHA directly!
      // Don't search for it in filtered lists (it might not be there)
      anchorSha = lastReleaseCommitSha;
    }
    // ============================================================================
    // PHASE 6: IDENTIFY UNRELEASED COMMITS
    // ============================================================================

    // Get all commits between the anchor and current HEAD that affect this package
    // These are the commits that haven't been published yet and may need changesets
    const unreleasedRaw = getCommitsSince(
      workspaceRoot,
      anchorSha, // Start from anchor (last published state)
      currentCommit, // Go to current HEAD
      config.commitPath, // Only commits affecting this package
      outputChannel
    );

    // Parse into structured commit objects for display and analysis
    const unreleasedCommits = unreleasedRaw.map(line => {
      const [sha, ...msgParts] = line.split(' ');
      return {
        sha: sha?.substring(0, 7) || '', // Short SHA for display
        message: msgParts.join(' '),
      };
    });

    // ============================================================================
    // PHASE 7: MAKE SYNC STATUS DECISION
    // ============================================================================

    // If no unreleased commits exist, the package is perfectly in sync!
    // All commits since the anchor have been properly published
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

    // ============================================================================
    // PHASE 8: CHANGESET ANALYSIS (FOR NPM PACKAGES)
    // ============================================================================

    // Only perform changeset analysis for packages that support it
    // This applies to NPM packages that use changesets for versioning
    // Changesets are files that describe what should be published and how to bump versions
    if (config.targetPackage) {
      // Read the most recent changeset file for this package
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
        anchorForDiff =
          latestChangeset.anchor && latestChangeset.anchor.length > 0
            ? latestChangeset.anchor
            : latestChangeset.lastCommitSha;
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
        const packageName = await getPackageNameFromConfig(config);
        if (packageName) {
          const dependencyCheck = checkWillBeUpdatedByChangeset(workspaceRoot, packageName);

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
        // But if we found a release commit, check if all commits are covered by it
        if (filesChangedSinceBaseline.length === 0) {
          return {
            status: 'pending',
            message: config.messages.unreleased,
            commitCount: unreleasedCommits.length,
            packageVersion,
            baselineCommit: baseline,
            releaseCommit: lastReleaseCommitSha, // ✅ Include release commit for (npm) mention
            currentCommit,
            commits: unreleasedCommits,
          };
        }

        // If we found a release commit and there are unreleased commits,
        // but the release commit covers them, then it's actually sync
        if (lastReleaseCommitSha && unreleasedCommits.length > 0) {
          // Check if the release commit is after the baseline in the commit history
          const releaseCommitIndex = allCommits.findIndex(c => c.sha === lastReleaseCommitSha);
          const baselineIndex = allCommits.findIndex(c => c.sha === baseline);

          if (releaseCommitIndex >= 0 && baselineIndex >= 0 && releaseCommitIndex > baselineIndex) {
            // The release commit covers all commits after baseline, so it's sync
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
      // Get future version from changeset status for all packages
      let futureVersion: string | undefined;
      const packageName = await getPackageNameFromConfig(config);
      if (packageName) {
        const dependencyCheck = checkWillBeUpdatedByChangeset(workspaceRoot, packageName);
        futureVersion = dependencyCheck.newVersion;
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
        notCoveredCommits: outsideCommits,
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
