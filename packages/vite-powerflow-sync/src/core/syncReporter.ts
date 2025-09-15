import * as path from 'path';

import { formatBaseline } from './baselineFormatter';
import { readPackageInfo } from './packageReader';
import { CheckResult, PackageLabel, SyncCheckConfig } from './types';
import { MONITORED_NPM_PACKAGES, SPECIAL_PACKAGE_CONFIGS } from '../config/monitoredPackages';

/**
 * Determine the distribution channel for a package based on its private property
 */
async function getDistributionChannel(label: PackageLabel, workspaceRoot: string): Promise<string> {
  try {
    // Get package path from configuration instead of hardcoded paths
    let packagePath: string | null = null;

    // Check if it's a standard NPM package
    const npmPackage = MONITORED_NPM_PACKAGES.find(pkg => pkg.label === label);
    if (npmPackage) {
      packagePath = path.join(workspaceRoot, npmPackage.pkgPath);
    } else if (label === PackageLabel.Extension) {
      // Special case for extension
      packagePath = path.join(workspaceRoot, 'packages/vite-powerflow-sync/package.json');
    } else if (label === PackageLabel.Starter) {
      // Special case for starter template
      packagePath = path.join(workspaceRoot, 'packages/cli/template/package.json');
    }

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
  label: PackageLabel,
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

  // For Starter, if both baselineCommit and releaseCommit are present, show both
  if (result.baselineCommit && result.releaseCommit) {
    const channelInfo = distributionChannel ? ` (${distributionChannel})` : '';
    title += ` - baseline ${result.baselineCommit.substring(0, 7)}${channelInfo} + release commit ${result.releaseCommit.substring(0, 7)}`;
  } else if (result.baselineCommit) {
    const channelInfo = distributionChannel ? ` (${distributionChannel})` : '';
    title += ` - baseline ${result.baselineCommit.substring(0, 7)}${channelInfo}`;
  }
  let lines: string[] = [];
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

export function formatGlobalStatus(
  results: { label: PackageLabel; result: CheckResult }[]
): string[] {
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

  const changesetMap = new Map<string, { label: PackageLabel; bumpType: string }[]>();

  for (const { label, result: pkgResult } of results) {
    if (pkgResult.changeset) {
      const fileName = pkgResult.changeset.fileName;
      if (!changesetMap.has(fileName)) {
        changesetMap.set(fileName, []);
      }
      changesetMap.get(fileName)!.push({ label, bumpType: pkgResult.changeset.bumpType });
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
  results: { label: PackageLabel; result: CheckResult }[],
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
  workspaceRoot: string
): Promise<string> {
  const shortBaseline = formatBaseline(baseline);
  let message = `📦 [${config.label}] Checking against baseline (commit/tag ${shortBaseline})`;

  if (config.label === PackageLabel.Starter) {
    try {
      const templatePackagePath = path.join(workspaceRoot, 'packages/cli/template/package.json');
      const templatePkg = await readPackageInfo(templatePackagePath);
      if (templatePkg?.version) {
        message = `📦 [Starter] Checking against CLI template baseline (commit ${shortBaseline}, version ${templatePkg.version})`;
      }
    } catch {}
  }

  return message;
}
