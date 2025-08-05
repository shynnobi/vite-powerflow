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

  if (result.status === 'error') {
    return `[${label}]: Check failed - ${result.message}`;
  }

  if (result.status === 'pending' && result.changeset) {
    return `[${label}]: Package has a pending ${result.changeset.bumpType} release${versionInfo} (${result.changeset.fileName})`;
  }

  if (result.commitCount > 0) {
    return `[${label}]: Found ${result.commitCount} unreleased commit(s)${versionInfo}.`;
  }

  // In sync
  const commitInfo = result.baselineCommit
    ? ` - baseline ${result.baselineCommit.substring(0, 7)}`
    : '';
  return `[${label}]: Package in sync${versionInfo}${commitInfo}`;
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

  // No changes at all
  if (allResults.filter(r => r.commitCount > 0).length === 0) {
    return '✅ Everything in sync.';
  }

  // Check if ALL packages with changes have changesets
  const packagesWithChanges = allResults.filter(r => r.commitCount > 0);
  const allHaveChangesets = packagesWithChanges.every(r => r.status === 'pending');

  if (allHaveChangesets) {
    return '⏳ Ready for release. Merge to main to publish automatically.';
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
    lines.push(formatPackageStatus(label, result));
  }

  // Separator
  lines.push('———');

  // Global status
  lines.push(formatGlobalStatus(results));

  return lines;
}
