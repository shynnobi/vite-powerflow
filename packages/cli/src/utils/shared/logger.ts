import chalk from 'chalk';
import ora, { type Ora } from 'ora';

/**
 * CLI-style logging functions
 * These are always shown regardless of environment
 */
export function logInfo(msg: string) {
  console.log(chalk.cyan('❯'), msg);
}

export function logSuccess(msg: string) {
  console.log(chalk.green('✔'), msg);
}

export function logError(msg: string) {
  console.error(chalk.red('✖'), msg);
}

/**
 * Creates a spinner for long-running operations
 */
export function createSpinner(text: string): Ora {
  return ora({ text, spinner: 'dots' }).start();
}
