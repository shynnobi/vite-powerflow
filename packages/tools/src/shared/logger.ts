import chalk from 'chalk';
import ora, { Ora } from 'ora';

export function createSpinner(text: string): Ora {
  return ora({ text, spinner: 'dots' }).start();
}

export function logInfo(msg: string) {
  console.log(chalk.cyan('▪'), msg);
}

export function logSuccess(msg: string) {
  console.log(chalk.green('✔'), msg);
}

export function logError(msg: string) {
  console.error(chalk.red('✖'), msg);
}
