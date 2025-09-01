import * as vscode from 'vscode';

export type SyncStatus = 'sync' | 'warning' | 'error' | 'pending';

export enum PackageLabel {
  Starter = 'Starter',
  Cli = 'CLI',
  Utils = 'Utils',
}

export interface CheckResult {
  status: SyncStatus;
  message: string;
  commitCount: number;
  changeset?: Changeset;
  packageVersion?: string;
  baselineCommit?: string;
  releaseCommit?: string;
  currentCommit?: string;
  commits?: { sha: string; message: string }[];
  coveredCommits?: { sha: string; message: string }[];
  notCoveredCommits?: { sha: string; message: string }[];
}

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
  label: PackageLabel;
  result: CheckResult;
}
