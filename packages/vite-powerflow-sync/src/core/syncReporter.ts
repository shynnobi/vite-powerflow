import * as fs from 'fs';
import * as path from 'path';

import { formatBaseline } from './baselineFormatter';
import { discoverMonitoredPackages } from './gitStatus';
import { readPackageInfo } from './packageReader';
import { CheckResult, MonitoredPackage, SyncCheckConfig } from './types';

/**
 * Centralized function to get package.json path for any package label
 * This replaces hardcoded paths throughout the codebase
 */
export function getPackageJsonPath(label: string, workspaceRoot: string): string | null {
  // Use discovered packages to find the correct path
  const discoveredPackages = discoverMonitoredPackages(workspaceRoot, {
    appendLine: (_message: string) => {
      // Silent operation for this context
    },
  });

  // Find package by label directly
  const discoveredPackage = discoveredPackages.find(pkg => pkg.syncConfig.label === label);

  if (discoveredPackage) {
    // Use the discovered pkgPath
    const pkgPath = typeof discoveredPackage.pkgPath === 'string' ? discoveredPackage.pkgPath : '';
    const fullPath = path.join(workspaceRoot, pkgPath);
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }

  return null;
}

/**
 * Get package name from package.json path
 * Reads directly from package.json to avoid hardcoded mappings
 */
export async function getPackageNameFromPath(packagePath: string): Promise<string> {
  try {
    // Read package name directly from package.json
    const pkgInfo = await readPackageInfo(packagePath);
    if (pkgInfo?.name && typeof pkgInfo.name === 'string') {
      return pkgInfo.name;
    }
  } catch {
    // Silently fall back to path-based extraction
  }

  // Fallback: extract from path pattern
  const pathRegex = /packages\/([^/]+)\/package\.json/;
  const pathMatch = pathRegex.exec(packagePath);
  if (pathMatch) {
    return `@vite-powerflow/${pathMatch[1]}`;
  }

  return '';
}
/**
 * Determine the distribution channel for a package based on its private property
 */
async function getDistributionChannel(label: string, workspaceRoot: string): Promise<string> {
  try {
    // Use centralized function to get package path
    const packagePath = getPackageJsonPath(label, workspaceRoot);
    if (!packagePath) return '';

    // Read package info and check private property
    const pkgInfo = await readPackageInfo(packagePath);
    if (!pkgInfo) return '';

    // If private: false → published on npm
    // If private: true → local/internal use only
    if (pkgInfo.private === false) {
      return 'npm';
    } else if (pkgInfo.private === true) {
      return 'local';
    }

    return '';
  } catch {
    return '';
  }
}

export async function formatPackageStatus(
  label: string,
  result: CheckResult,
  workspaceRoot: string
): Promise<string> {
  let versionInfo = '';
  if (result.packageVersion) {
    versionInfo = ` (v${result.packageVersion})`;
  }

  let title = `📦 [${label}]${versionInfo}`;

  // Get distribution channel based on package.json private property
  const distributionChannel = await getDistributionChannel(label, workspaceRoot);

  // Show baseline and release commit info if both are present
  if (result.baselineCommit && result.releaseCommit) {
    const channelInfo = distributionChannel ? ` (${distributionChannel})` : '';
    title += ` - baseline ${result.baselineCommit.substring(0, 7)}${channelInfo} + release commit ${result.releaseCommit.substring(0, 7)}`;
  } else if (result.baselineCommit) {
    const channelInfo = distributionChannel ? ` (${distributionChannel})` : '';
    title += ` - baseline ${result.baselineCommit.substring(0, 7)}${channelInfo}`;
  }
  const lines: string[] = [];
  lines.push(title);

  if (result.status === 'error') {
    lines.push(`   ❌ Check failed - ${result.message}`);
    return lines.join('\n');
  }

  if (result.commitCount === 0) {
    lines.push(`   ✅ Package in sync`);
    return lines.join('\n');
  }

  if (result.status === 'dependency-pending') {
    lines.push(`   🔄 ${result.message}`);
    if (result.commits && result.commits.length > 0) {
      const plural = result.commits.length > 1 ? 'commits' : 'commit';
      lines.push(
        `   📋 ${result.commits.length} ${plural} will be covered by dependency changeset:`
      );
      result.commits.forEach(commit => {
        lines.push(`      • ${commit.sha} ${commit.message}`);
      });
    }
    const futureVersionText = result.futureVersion ? ` → v${result.futureVersion}` : '';
    lines.push(`   🎯 Ready for release${futureVersionText}`);
    return lines.join('\n');
  }

  if (result.changeset) {
    lines.push(`   📄 Changeset: ${result.changeset.fileName} (${result.changeset.bumpType})`);

    if (result.commits && result.commits.length > 0) {
      const coveredCommits = result.coveredCommits ?? [];
      const notCoveredCommits = result.notCoveredCommits ?? [];
      const totalCommits = result.commits.length;

      lines.push(`   📊 Coverage: ${coveredCommits.length}/${totalCommits} commits covered`);

      if (notCoveredCommits.length === 0) {
        const futureVersionText = result.futureVersion ? ` → v${result.futureVersion}` : '';
        lines.push(`   🎯 Ready for release${futureVersionText}`);
      } else {
        const plural = notCoveredCommits.length > 1 ? 'commits' : 'commit';
        lines.push(`   ⚠️  ${notCoveredCommits.length} ${plural} NOT covered by changeset:`);
        notCoveredCommits.forEach(commit => {
          lines.push(`      • ${commit.sha.substring(0, 7)} ${commit.message}`);
        });
        lines.push(`   ⚠️ Require changeset update`);
      }
    } else {
      const futureVersionText = result.futureVersion ? ` → v${result.futureVersion}` : '';
      lines.push(`   🎯 Ready for release${futureVersionText}`);
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

export function formatGlobalStatus(results: { label: string; result: CheckResult }[]): string[] {
  if (results.length === 0) return [];

  let syncCount = 0;
  let pendingCount = 0;
  let warningCount = 0;
  let errorCount = 0;

  for (const { result } of results) {
    if (result.status === 'error') {
      errorCount++;
    } else if (result.commitCount === 0) {
      syncCount++;
    } else if (result.status === 'dependency-pending') {
      // dependency-pending is treated as pending (ready for release)
      pendingCount++;
    } else if (result.changeset) {
      const notCoveredCommits = result.notCoveredCommits ?? [];
      if (notCoveredCommits.length > 0) {
        warningCount++;
      } else {
        pendingCount++;
      }
    } else {
      warningCount++;
    }
  }

  const totalPackages = results.length;
  const packageWord = totalPackages > 1 ? 'packages' : 'package';

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

  const result = [`🔄 Status: ${globalEmoji} ${globalStatus}`];

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
  result.push(summary);

  const changesetMap = new Map<string, { label: string; bumpType: string }[]>();

  for (const { label, result: pkgResult } of results) {
    if (pkgResult.changeset) {
      const fileName = pkgResult.changeset.fileName;
      if (typeof fileName === 'string' && !changesetMap.has(fileName)) {
        changesetMap.set(fileName, []);
      }
      if (typeof fileName === 'string') {
        changesetMap.get(fileName)!.push({ label, bumpType: pkgResult.changeset.bumpType });
      }
    }
  }

  const multiPackageChangesets = Array.from(changesetMap.entries()).filter(
    ([, packages]) => packages.length > 1
  );

  if (multiPackageChangesets.length > 0) {
    for (const [fileName, packages] of multiPackageChangesets) {
      const packageList = packages
        .map(({ label, bumpType }) => `${label} (${bumpType})`)
        .join(', ');
      result.push(`🔗 ${fileName}: ${packageList}`);
    }
  }

  return result;
}

export async function formatSyncOutput(
  results: { label: string; result: CheckResult }[],
  workspaceRoot: string
): Promise<string[]> {
  const lines: string[] = [];

  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  // Use local time for user-facing output; tests normalize this line for snapshots
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(
    now.getHours()
  )}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  lines.push(`🔄 Sync Status Report - [${timestamp}]`);
  lines.push('═══════════════════════════════════════════════════════════');
  lines.push('');

  for (const { label, result } of results) {
    const statusLines = (await formatPackageStatus(label, result, workspaceRoot)).split('\n');
    lines.push(...statusLines);
    lines.push('');
  }

  lines.push('═══════════════════════════════════════════════════════════');
  const summaryLines = formatGlobalStatus(results);
  if (summaryLines.length > 0) {
    lines.push(...summaryLines);
  }

  lines.push('');
  lines.push('');

  return lines;
}

export async function formatBaselineLog(
  config: SyncCheckConfig,
  baseline: string,
  _workspaceRoot: string
): Promise<string> {
  const shortBaseline = formatBaseline(baseline);
  let message = `📦 [${config.label}] Checking against baseline (commit/tag ${shortBaseline})`;

  return message;
}

/**
 * Get all monitored packages directly from their syncConfig in package.json
 * This completely replaces the need for monitoredPackages.ts
 */
export async function getAllMonitoredPackages(
  workspaceRoot: string,
  outputChannel: { appendLine: (_value: string) => void }
): Promise<MonitoredPackage[]> {
  const discoveredPackages = discoverMonitoredPackages(workspaceRoot, outputChannel);

  const results = await Promise.all(
    discoveredPackages.map(async discoveredPackage => {
      // Use label directly from syncConfig (no hardcode mapping needed)
      const configLabel =
        typeof discoveredPackage.syncConfig.label === 'string'
          ? discoveredPackage.syncConfig.label
          : '';

      // Build full path and read package details
      const pkgPath =
        typeof discoveredPackage.pkgPath === 'string' ? discoveredPackage.pkgPath : '';
      const fullPackagePath = path.join(workspaceRoot, pkgPath);
      const pkgName = pkgPath ? await getPackageNameFromPath(fullPackagePath) : '';

      // Extract directory path for commit tracking
      const commitPath = pkgPath ? path.dirname(pkgPath) + '/' : '';

      // Determine type based on private property
      let type: 'npm' | 'unpublished' = 'unpublished';
      try {
        const pkgInfo = await readPackageInfo(fullPackagePath);
        if (pkgInfo?.private === false) {
          type = 'npm';
        }
      } catch {
        // Keep default type as unpublished
      }

      return {
        label: configLabel,
        pkgName,
        pkgPath,
        commitPath,
        type,
        baseline:
          typeof discoveredPackage.syncConfig.baseline === 'string'
            ? discoveredPackage.syncConfig.baseline
            : '',
      };
    })
  );

  return results;
}
