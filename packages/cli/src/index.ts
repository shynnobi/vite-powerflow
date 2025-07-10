#!/usr/bin/env node
import chalk from 'chalk';
import { Command } from 'commander';
import fs from 'fs/promises';
import path from 'path';

import { createProject, spinner } from './commands/create.js';
import { directoryExists } from './utils/fs-utils.js';
import { promptProjectName } from './utils/prompt-ui.js';
import { safePackageName } from './utils/safe-package-name.js';

let currentProjectPath: string | null = null;
let isCleaningUp = false;

process.on('SIGINT', () => {
  console.log('\n' + chalk.yellow('Operation cancelled.'));
  process.exit(0);
});

async function cleanup() {
  if (isCleaningUp) return;
  isCleaningUp = true;

  spinner.stop();

  if (currentProjectPath) {
    try {
      await fs.rm(currentProjectPath, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  }

  console.log(chalk.red('\n✖ Operation cancelled'));
  process.exit(0);
}

// Handle Ctrl+C
process.stdin.on('keypress', (_: string, key: { ctrl: boolean; name: string }) => {
  if (key.ctrl && key.name === 'c') {
    cleanup();
  }
});

const program = new Command();
program
  .option('-n, --name <name>', 'Project name')
  .option('-g, --git', 'Initialize Git')
  .option('-u, --git-user-name <name>', 'Git user.name')
  .option('-e, --git-user-email <email>', 'Git user.email')
  .option('-o, --use-global-git', 'Use global Git identity if found, without prompt');
program.parse(process.argv);
const cliOptions = program.opts();

async function init() {
  try {
    // Enable raw mode to capture Ctrl+C
    process.stdin.setRawMode(true);
    process.stdin.resume();

    // Commander: get options
    let projectName = await (
      await import('./utils/prompt-ui.js')
    ).promptProjectName(cliOptions.name);

    // Always slugify the project name for the package name
    let packageName = safePackageName(projectName);
    let projectPath = path.join(process.cwd(), packageName);

    // Loop to re-prompt until the directory does not already exist
    while (await directoryExists(projectPath)) {
      console.error(chalk.red(`✘ Error: Directory "${packageName}" already exists.`));
      projectName = await promptProjectName();
      packageName = safePackageName(projectName);
      projectPath = path.join(process.cwd(), packageName);
    }
    currentProjectPath = projectPath;

    // Commander: use git option if provided, otherwise prompt
    let git = await (await import('./utils/prompt-ui.js')).promptGit(cliOptions.git);

    let gitUserName: string | undefined = cliOptions.gitUserName;
    let gitUserEmail: string | undefined = cliOptions.gitUserEmail;
    if (git && (!gitUserName || !gitUserEmail)) {
      const { promptGitIdentity } = await import('./utils/prompt-ui.js');
      const identity = await promptGitIdentity(gitUserName, gitUserEmail, cliOptions.useGlobalGit);
      if (identity) {
        gitUserName = identity.gitUserName;
        gitUserEmail = identity.gitUserEmail;
      }
    }

    await createProject({
      projectName,
      packageName,
      git,
      gitUserName,
      gitUserEmail,
    });
  } catch {
    await cleanup();
  } finally {
    // Always disable raw mode
    process.stdin.setRawMode(false);
    process.stdin.pause();
  }
}

init();
