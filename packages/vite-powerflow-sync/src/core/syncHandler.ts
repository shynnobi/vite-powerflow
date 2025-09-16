import { CheckResult, SyncCheckConfig } from './types';

export function handleUnreleasedCommits(
  config: SyncCheckConfig,
  newCommits: string[],
  _outputChannel: { appendLine: (_v: string) => void },
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
  _outputChannel: { appendLine: (_v: string) => void },
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
