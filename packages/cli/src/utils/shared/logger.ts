import chalk from 'chalk';
import ora, { type Ora } from 'ora';

/**
 * Simple depth tracking for indentation
 */
let indent_depth = 0;

function getIndent(): string {
  return '  '.repeat(indent_depth);
}

/**
 * CLI-style logging functions
 * These are always shown regardless of environment
 */
export function logInfo(msg: string) {
  console.log(`${getIndent()}${chalk.cyan('›')} ${msg}`);
}

export function logSuccess(msg: string) {
  console.log(`${getIndent()}${chalk.green('✓')} ${msg}`);
}

export function logError(msg: string) {
  console.error(`${getIndent()}${chalk.red('✖')} ${msg}`);
}

export function logDetail(msg: string) {
  console.log(`${getIndent()}${chalk.gray('→')} ${msg}`);
}

/**
 * Task grouping for hierarchical output
 */
export function startGroup(title: string) {
  console.log(`\n${getIndent()}${chalk.bold(title)}`);
  indent_depth++;
}

export function endGroup() {
  indent_depth = Math.max(0, indent_depth - 1);
}

/**
 * Creates a spinner for long-running operations
 */
export function createSpinner(text: string): Ora {
  return ora({ text, spinner: 'dots', prefixText: getIndent() }).start();
}
