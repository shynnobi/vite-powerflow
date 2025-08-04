import * as vscode from 'vscode';

export type SyncStatus = 'sync' | 'warning' | 'error' | 'pending';

export interface CheckResult {
  status: SyncStatus;
  message: string;
  commitCount: number;
  changeset?: Changeset;
  packageVersion?: string;
  baselineCommit?: string;
  currentCommit?: string;
}

/**
 * Configuration interface for sync status checks
 */
export interface SyncCheckConfig {
  label: string;
  baseline: () => string | Promise<string>;
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
