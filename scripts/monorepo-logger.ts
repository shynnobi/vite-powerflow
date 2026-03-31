import chalk from 'chalk';
import ora, { Ora } from 'ora';

/**
 * Logging levels for the monorepo
 * silent: No output
 * error: Only errors
 * warn: Errors and warnings
 * normal: Standard output (default)
 * verbose: Detailed output with nested levels
 */
export type LogLevel = 'silent' | 'error' | 'warn' | 'normal' | 'verbose';

class MonorepoLogger {
  private level: LogLevel = 'normal';
  private depth: number = 0;

  constructor() {
    // Check for --verbose flag
    if (process.argv.includes('--verbose')) {
      this.level = 'verbose';
    }
  }

  setLevel(level: LogLevel) {
    this.level = level;
  }

  private indent(): string {
    return '  '.repeat(this.depth);
  }

  // Main logging methods
  info(msg: string) {
    if (this.level === 'silent') return;
    console.log(`${this.indent()}${chalk.cyan('›')} ${msg}`);
  }

  success(msg: string) {
    if (this.level === 'silent') return;
    console.log(`${this.indent()}${chalk.green('✓')} ${msg}`);
  }

  error(msg: string) {
    // Errors always show
    console.error(`${this.indent()}${chalk.red('✖')} ${msg}`);
  }

  warn(msg: string) {
    if (this.level === 'silent') return;
    console.warn(`${this.indent()}${chalk.yellow('⚠')} ${msg}`);
  }

  // Verbose mode details
  detail(msg: string) {
    if (this.level !== 'verbose') return;
    console.log(`${this.indent()}${chalk.gray('→')} ${msg}`);
  }

  // Task group
  startGroup(title: string) {
    if (this.level === 'silent') return;
    console.log(`\n${this.indent()}${chalk.bold(title)}`);
    this.depth++;
  }

  endGroup() {
    if (this.level === 'silent') return;
    this.depth = Math.max(0, this.depth - 1);
  }

  // Create a spinner (task runner)
  createSpinner(text: string): Ora {
    if (this.level === 'silent') {
      return ora({ text, isEnabled: false }).start();
    }
    return ora({ text, spinner: 'dots3', prefixText: this.indent() }).start();
  }
}

// Export singleton instance
export const logger = new MonorepoLogger();

// Legacy exports for backwards compatibility
export function createRootSpinner(text: string): Ora {
  return logger.createSpinner(text);
}

export function logRootInfo(msg: string) {
  logger.info(msg);
}

export function logRootSuccess(msg: string) {
  logger.success(msg);
}

export function logRootError(msg: string) {
  logger.error(msg);
}

export function logRootDetail(msg: string) {
  logger.detail(msg);
}
