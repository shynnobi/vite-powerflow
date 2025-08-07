import * as path from 'path';

import { formatBaseline } from './formatBaseline.js';
import { getPackageInfo } from './packageUtils.js';
import { CheckResult, PackageLabel, SyncCheckConfig } from './syncTypes.js';

export function formatPackageStatus(label: PackageLabel, result: CheckResult): string {
  const versionInfo = result.packageVersion ? ` (v${result.packageVersion})` : '';
  let lines: string[] = [];

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

  if (result.changeset) {
    lines.push(`   📄 Changeset: ${result.changeset.fileName} (${result.changeset.bumpType})`);

    if (result.commits && result.commits.length > 0) {
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

export function formatGlobalStatus(
  results: Array<{ label: PackageLabel; result: CheckResult }>
): string {
  if (results.length === 0) return '';

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
      const notCoveredCommits = result.notCoveredCommits || [];
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

  let result = `🔄 Status: ${globalEmoji} ${globalStatus}`;

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

export function formatSyncOutput(
  results: Array<{ label: PackageLabel; result: CheckResult }>
): string[] {
  const lines: string[] = [];

  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(
    now.getHours()
  )}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  lines.push(`🔄 Sync Status Report - [${timestamp}]`);
  lines.push('═══════════════════════════════════════════════════════════');
  lines.push('');

  for (const { label, result } of results) {
    const statusLines = formatPackageStatus(label, result).split('\n');
    lines.push(...statusLines);
    lines.push('');
  }

  lines.push('═══════════════════════════════════════════════════════════');
  const summary = formatGlobalStatus(results);
  if (summary) {
    lines.push(summary);
  }

  lines.push('');
  lines.push('');

  return lines;
}

// Helpers migrated from legacy handlers
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
      const templatePkg = await getPackageInfo(templatePackagePath);
      if (templatePkg?.version) {
        message = `📦 [Starter] Checking against CLI template baseline (commit ${shortBaseline}, version ${templatePkg.version})`;
      }
    } catch {}
  }

  return message;
}

export function handleUnreleasedCommits(
  config: SyncCheckConfig,
  newCommits: string[],
  _outputChannel: { appendLine: (v: string) => void },
  additionalInfo?: { packageVersion?: string; baselineCommit?: string; currentCommit?: string }
): CheckResult {
  const commitCount = newCommits.length;
  return {
    status: 'warning',
    message: `${commitCount} ${config.messages.unreleased}`,
    commitCount,
    packageVersion: additionalInfo?.packageVersion,
    baselineCommit: additionalInfo?.baselineCommit,
    currentCommit: additionalInfo?.currentCommit,
  };
}

export function handleInSync(
  config: SyncCheckConfig,
  _outputChannel: { appendLine: (v: string) => void },
  additionalInfo?: { packageVersion?: string; baselineCommit?: string; currentCommit?: string }
): CheckResult {
  return {
    status: 'sync',
    message: config.messages.inSync,
    commitCount: 0,
    packageVersion: additionalInfo?.packageVersion,
    baselineCommit: additionalInfo?.baselineCommit,
    currentCommit: additionalInfo?.currentCommit,
  };
}
