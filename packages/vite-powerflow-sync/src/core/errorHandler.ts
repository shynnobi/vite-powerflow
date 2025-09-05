import * as vscode from 'vscode';

import { logMessage } from '../utils/logMessage';
import { CheckResult, SyncCheckConfig } from './types';

export function handleSyncError(
  config: SyncCheckConfig,
  error: Error,
  _outputChannel: vscode.OutputChannel
): CheckResult {
  const errorLog = `❌ [${config.label}] ${config.messages.errorPrefix}: ${error.message}`;
  logMessage(_outputChannel, errorLog);
  return {
    status: 'error',
    message: config.messages.errorPrefix,
    commitCount: 0,
  };
}
