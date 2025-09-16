import * as vscode from 'vscode';

/**
 * Sync status types
 */
export type SyncStatus = 'sync' | 'warning' | 'error' | 'pending' | 'dependency-pending';

/**
 * Configuration structure for sync monitoring in package.json
 */
export interface SyncConfig {
  baseline: string;
  label: string;
  monitored: boolean;
  updatedAt?: string;
}

/**
 * Package bump information for changesets
 */
export interface PackageBump {
  name: string;
  version: string;
  bumpType: 'patch' | 'minor' | 'major' | 'none';
}

/**
 * Monitored package information
 */
export interface MonitoredPackage {
  label: string;
  pkgName: string;
  pkgPath: string;
  commitPath: string;
  type: 'npm' | 'unpublished';
  baseline?: string;
}

/**
 * Sync check configuration
 */
export interface SyncCheckConfig {
  label: string;
  baseline: () => Promise<string>;
  commitPath: string;
  targetPackage?: string;
  messages: {
    notFound: string;
    inSync: string;
    unreleased: string;
    errorPrefix: string;
  };
}

/**
 * Check result from sync engine
 */
export interface CheckResult {
  status: SyncStatus;
  message: string;
  commitCount: number;
  packageVersion?: string;
  currentCommit?: string;
  baselineCommit?: string;
  releaseCommit?: string;
  unreleasedCommits?: string[];
  changeset?: Changeset;
  futureVersion?: string;
  commits?: { sha: string; message: string }[];
  coveredCommits?: { sha: string; message: string }[];
  notCoveredCommits?: { sha: string; message: string }[];
}

export interface Changeset {
  fileName: string;
  bumpType: 'minor' | 'patch' | 'major' | 'none';
}

export interface ChangesetStatus {
  status: 'pending';
  changeset: Changeset;
}

export interface Logger {
  outputChannel: vscode.OutputChannel;
  outputBuffer: string[];
}

export class SyncCheckError extends Error {
  constructor(
    message: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'SyncCheckError';
  }
}

export interface SyncResult {
  status: SyncStatus;
  message: string;
  commitCount: number;
  packageVersion?: string;
  baselineCommit?: string;
  currentCommit?: string;
  changeset?: Changeset;
}

export interface LabeledCheckResult {
  label: string;
  result: CheckResult;
}
