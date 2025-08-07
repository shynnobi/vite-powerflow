import * as vscode from 'vscode';

export type SyncStatus = 'sync' | 'warning' | 'error' | 'pending';

export enum PackageLabel {
  Starter = 'Starter',
  Cli = 'CLI',
}

export interface CheckResult {
  status: SyncStatus;
  message: string;
  commitCount: number;
  changeset?: Changeset;
  packageVersion?: string;
  baselineCommit?: string;
  currentCommit?: string;
  commits?: { sha: string; message: string }[];
  // Commit partition for changeset coverage
  coveredCommits?: { sha: string; message: string }[];
  notCoveredCommits?: { sha: string; message: string }[];
}

/**
 * Configuration interface for sync status checks
 */
export interface SyncCheckConfig {
  label: PackageLabel;
  baseline: () => Promise<string>;
  commitPath: string;
  messages: {
    notFound: string;
    inSync: string;
    unreleased: string;
    errorPrefix: string;
  };
  targetPackage?: string;
}

export interface Changeset {
  fileName: string;
  bumpType: 'minor' | 'patch' | 'major';
}

export interface ChangesetStatus {
  status: 'pending';
  changeset: Changeset;
}

/**
 * Logger interface to handle output consistently
 */
export interface Logger {
  outputChannel: vscode.OutputChannel;
  outputBuffer: string[];
}

/**
 * Custom error class for sync check operations
 */
export class SyncCheckError extends Error {
  constructor(
    message: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'SyncCheckError';
  }
}

/**
 * Central sync result interface
 */
export interface SyncResult {
  status: SyncStatus;
  message: string;
  commitCount: number;
  packageVersion?: string;
  baselineCommit?: string;
  currentCommit?: string;
  changeset?: Changeset;
}
