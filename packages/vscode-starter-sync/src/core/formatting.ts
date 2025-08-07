import { CheckResult, PackageLabel } from '../types.js';

/**
 * Formats a single package sync result into a human-readable status line.
 *
 * @param label - The display label for the package (e.g. "Starter", "CLI")
 * @param result - The CheckResult object for the package
 * @returns A formatted string describing the sync status for the package
 */
export function formatPackageStatus(label: PackageLabel, result: CheckResult): string {
  const versionInfo = result.packageVersion ? ` (v${result.packageVersion})` : '';
  let lines: string[] = [];

  // Package header
  lines.push(`📦 [${label}]${versionInfo}`);

  if (result.status === 'error') {
    lines.push(`   ❌ Check failed - ${result.message}`);
    return lines.join('\n');
  }

  if (result.commitCount === 0) {
    const commitInfo = result.baselineCommit
      ? ` - baseline ${result.baselineCommit.substring(0, 7)}`
      : '';
    lines.push(`   ✅ Package in sync${commitInfo}`);
    return lines.join('\n');
  }

  // Handle changeset info
  if (result.changeset) {
    lines.push(`   📄 Changeset: ${result.changeset.fileName} (${result.changeset.bumpType})`);

    if (result.commits && result.commits.length > 0) {
      // Use actual partition data from CheckResult
      const coveredCommits = result.coveredCommits || [];
      const notCoveredCommits = result.notCoveredCommits || [];
      const totalCommits = result.commits.length;

      lines.push(`   📊 Coverage: ${coveredCommits.length}/${totalCommits} commits covered`);

      if (notCoveredCommits.length === 0) {
        lines.push(`   🎯 Ready for release`);
      } else {
        const plural = notCoveredCommits.length > 1 ? 'commits' : 'commit';
        lines.push(`   ⚠️  ${notCoveredCommits.length} ${plural} NOT covered by changeset:`);
        notCoveredCommits.forEach(commit => {
          lines.push(`      • ${commit.sha.substring(0, 7)} ${commit.message}`);
        });
        lines.push(`   ⚠️ Require changeset update`);
      }
    } else {
      // If there are no commits, still need a final status
      lines.push(`   🎯 Ready for release`);
    }
  } else {
    lines.push(`   ❌ No changeset found`);
    const plural = result.commitCount > 1 ? 'commits' : 'commit';
    lines.push(`   📋 ${result.commitCount} unreleased ${plural} need changeset:`);

    if (result.commits) {
      const maxShow = 5;
      const commitsToShow = result.commits.slice(0, maxShow);
      commitsToShow.forEach(commit => {
        lines.push(`      • ${commit.sha.substring(0, 7)} ${commit.message}`);
      });

      if (result.commits.length > maxShow) {
        lines.push(`      • ... and ${result.commits.length - maxShow} more`);
      }
    }
    lines.push(`   ⚠️ Require changeset (${result.commitCount} unreleased ${plural})`);
  }

  return lines.join('\n');
}

/**
 * Formats a global summary line for the sync status of all packages.
 *
 * @param results - Array of { label, result } for each package
 * @returns A formatted string summarizing the global sync state
 */
export function formatGlobalStatus(
  results: Array<{ label: PackageLabel; result: CheckResult }>
): string {
  if (results.length === 0) return '';

  // Count status types
  let syncCount = 0;
  let pendingCount = 0;
  let warningCount = 0;
  let errorCount = 0;

  for (const { result } of results) {
    if (result.status === 'error') {
      errorCount++;
    } else if (result.commitCount === 0) {
      syncCount++;
    } else if (result.changeset) {
      // Check if changeset fully covers commits
      const notCoveredCommits = result.notCoveredCommits || [];
      if (notCoveredCommits.length > 0) {
        warningCount++; // Partial coverage = warning
      } else {
        pendingCount++; // Full coverage = pending
      }
    } else {
      warningCount++;
    }
  }

  const totalPackages = results.length;
  const packageWord = totalPackages > 1 ? 'packages' : 'package';

  // Determine global status with priority: ERROR > WARNING > PENDING > SYNC
  let globalStatus = '';
  let globalEmoji = '';

  if (errorCount > 0) {
    globalStatus = 'ERROR';
    globalEmoji = '🔴';
  } else if (warningCount > 0) {
    globalStatus = 'WARNING';
    globalEmoji = '🟠';
  } else if (pendingCount > 0) {
    globalStatus = 'PENDING';
    globalEmoji = '🟡';
  } else {
    globalStatus = 'SYNC';
    globalEmoji = '🟢';
  }

  // Line 1: Global status
  let result = `🔄 Status: ${globalEmoji} ${globalStatus}`;

  // Line 2: Summary counts
  let summary = '';
  if (errorCount + warningCount === 0) {
    summary = `📋 Summary: All ${totalPackages} ${packageWord} ready`;
  } else if (syncCount + pendingCount === 0) {
    summary = `📋 Summary: All ${totalPackages} ${packageWord} need attention`;
  } else {
    const readyCount = syncCount + pendingCount;
    const needAttentionCount = errorCount + warningCount;
    const readyWord = readyCount > 1 ? 'packages' : 'package';
    const needAttentionWord = needAttentionCount > 1 ? 'packages' : 'package';
    summary = `📋 Summary: ${readyCount} ${readyWord} ready, ${needAttentionCount} ${needAttentionWord} need attention`;
  }
  result += `\n${summary}`;

  // Line 3: Multi-package changesets
  const changesetMap = new Map<string, Array<{ label: PackageLabel; bumpType: string }>>();

  for (const { label, result: pkgResult } of results) {
    if (pkgResult.changeset) {
      const fileName = pkgResult.changeset.fileName;
      if (!changesetMap.has(fileName)) {
        changesetMap.set(fileName, []);
      }
      changesetMap.get(fileName)!.push({ label, bumpType: pkgResult.changeset.bumpType });
    }
  }

  // Filter to only multi-package changesets
  const multiPackageChangesets = Array.from(changesetMap.entries()).filter(
    ([_, packages]) => packages.length > 1
  );

  if (multiPackageChangesets.length > 0) {
    for (const [fileName, packages] of multiPackageChangesets) {
      const packageList = packages
        .map(({ label, bumpType }) => `${label} (${bumpType})`)
        .join(', ');
      result += `\n🔗 ${fileName}: ${packageList}`;
    }
  }

  return result;
}

/**
 * Formats the complete sync output for display (multi-line, per package + global summary).
 *
 * @param results - Array of { label, result } for each package
 * @returns Array of formatted lines (one per package, separator, then global summary)
 */
export function formatSyncOutput(
  results: Array<{ label: PackageLabel; result: CheckResult }>
): string[] {
  const lines: string[] = [];

  // Timestamp for the report
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  // Header
  lines.push(`🔄 Sync Status Report - [${timestamp}]`);
  lines.push('═══════════════════════════════════════════════════════════');
  lines.push('');

  // Package status lines
  for (const { label, result } of results) {
    const statusLines = formatPackageStatus(label, result).split('\n');
    lines.push(...statusLines);
    lines.push(''); // Empty line between packages
  }

  // Footer separator and summary
  lines.push('═══════════════════════════════════════════════════════════');
  const summary = formatGlobalStatus(results);
  if (summary) {
    lines.push(summary);
  }

  // Final empty lines for spacing
  lines.push('');
  lines.push('');

  return lines;
}
