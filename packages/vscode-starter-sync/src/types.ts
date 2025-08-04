import * as vscode from 'vscode';

export type Status = 'sync' | 'warning' | 'error';

export interface CheckResult {
  status: Status;
  message: string;
  commitCount: number;
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
}

/**
 * Logger interface to handle output consistently
 */
export interface Logger {
  outputChannel: vscode.OutputChannel;
  outputBuffer: string[];
}
