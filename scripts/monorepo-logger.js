import chalk from 'chalk';
import ora from 'ora';

export function createRootSpinner(text) {
  return ora({ text, spinner: 'dots' }).start();
}

export function logRootInfo(msg) {
  console.log(chalk.cyan('❯'), msg);
}

export function logRootSuccess(msg) {
  console.log(chalk.green('✔'), msg);
}

export function logRootError(msg) {
  console.error(chalk.red('✖'), msg);
}
