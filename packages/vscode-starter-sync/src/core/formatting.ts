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

  if (result.status === 'error') {
    lines.push(`[${label}]: Check failed - ${result.message}`);
  } else if (result.status === 'pending' && result.changeset) {
    lines.push(
      `[${label}]: Package has a pending ${result.changeset.bumpType} release${versionInfo} (${result.changeset.fileName})`
    );
  } else if (result.commitCount > 0) {
    lines.push(`[${label}]: Found ${result.commitCount} unreleased commit(s)${versionInfo}.`);
  } else {
    // No unreleased commits, package is in sync
    const commitInfo = result.baselineCommit
      ? ` - baseline ${result.baselineCommit.substring(0, 7)}`
      : '';
    lines.push(`[${label}]: Package in sync${versionInfo}${commitInfo}`);
  }

  // Add the list of commits if present
  if (result.commits && result.commits.length > 0) {
    for (const c of result.commits) {
      lines.push(`  - ${c.sha} ${c.message}`);
    }
  }

  return lines.join('\n');
}

/**
 * Formats a global summary line for the sync status of all packages.
 *
 * @param results - Array of { label, result } for each package
 * @returns A formatted string summarizing the global sync state
 */
export function formatGlobalStatus(results: Array<{ label: string; result: CheckResult }>): string {
  const allResults = results.map(r => r.result);

  // Error case
  if (allResults.some(r => r.status === 'error')) {
    return '❌ Some checks failed - fix errors to get accurate status.';
  }

  // If any package is pending, show pending message
  if (allResults.some(r => r.status === 'pending')) {
    return '⏳ Release(s) pending. Merge to main to publish.';
  }

  // All in sync
  if (allResults.every(r => r.status === 'sync')) {
    return '✅ Everything in sync.';
  }

  // Some packages need changesets - detailed breakdown
  const needChangesets: string[] = [];
  const inSync: string[] = [];

  for (const { label, result } of results) {
    if (result.commitCount > 0 && result.status !== 'pending') {
      needChangesets.push(label);
    } else if (result.commitCount === 0) {
      inSync.push(label);
    }
  }

  let message = '⚠️ ';
  if (needChangesets.length > 0) {
    message += `${needChangesets.join(' and ')} package${needChangesets.length > 1 ? 's' : ''} require${needChangesets.length === 1 ? 's' : ''} a changeset.`;
  }
  if (inSync.length > 0) {
    message += ` ${inSync.join(' and ')} in sync.`;
  }

  return message;
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

  // Package status lines
  for (const { label, result } of results) {
    const statusLines = formatPackageStatus(label, result).split('\n');
    lines.push(...statusLines);
  }

  // Separator
  lines.push('———');

  // Global status
  lines.push(formatGlobalStatus(results));

  return lines;
}
