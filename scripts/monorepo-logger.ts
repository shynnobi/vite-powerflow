import chalk from 'chalk';
import ora, { Ora } from 'ora';

export function createRootSpinner(text: string): Ora {
  return ora({ text, spinner: 'dots' }).start();
}

export function logRootInfo(msg: string) {
  console.log(chalk.cyan('❯'), msg);
}

export function logRootSuccess(msg: string) {
  console.log(chalk.green('✔'), msg);
}

export function logRootError(msg: string) {
  console.error(chalk.red('✖'), msg);
}
