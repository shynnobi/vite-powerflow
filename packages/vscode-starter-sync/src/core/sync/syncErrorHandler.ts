import * as vscode from 'vscode';

import { logMessage } from '../../utils/logMessage.js';
import { CheckResult, SyncCheckConfig } from '../syncTypes.js';

export function handleError(
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
