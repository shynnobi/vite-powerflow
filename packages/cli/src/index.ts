#!/usr/bin/env node
import { logError } from '@vite-powerflow/utils';
import chalk from 'chalk';
import { Command } from 'commander';
import fs from 'fs/promises';
import path from 'path';

import { createProject } from './commands/create.js';
import { directoryExists } from './utils/fs-utils.js';
import { promptProjectName } from './utils/prompt-ui.js';
import { safePackageName } from './utils/safe-package-name.js';

let currentProjectPath: string | null = null;
let isCleaningUp = false;

process.on('SIGINT', () => {
  logError('Operation cancelled.');
  process.exit(0);
});

async function cleanup() {
  if (isCleaningUp) return;
  isCleaningUp = true;

  if (currentProjectPath) {
    try {
      await fs.rm(currentProjectPath, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  }

  logError('Operation cancelled');
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

function isNonInteractiveMode(opts: any) {
  // All required options for non-interactive mode
  return !!(
    opts.name &&
    typeof opts.git === 'boolean' &&
    (opts.git === false || (opts.git === true && opts.gitUserName && opts.gitUserEmail))
  );
}

async function init() {
  try {
    // Only enable raw mode if not in non-interactive mode
    const nonInteractive = isNonInteractiveMode(cliOptions);
    if (!nonInteractive && process.stdin.isTTY) {
      process.stdin.setRawMode(true);
      process.stdin.resume();
    }

    // Commander: get options
    let projectName = await (
      await import('./utils/prompt-ui.js')
    ).promptProjectName(cliOptions.name);

    // Always slugify the project name for the package name
    let packageName = safePackageName(projectName);
    let projectPath = path.join(process.cwd(), packageName);

    // Loop to re-prompt until the directory does not already exist
    while (await directoryExists(projectPath)) {
      if (nonInteractive) {
        logError('✘ Error: Directory already exists, choose another name.');
        process.exit(1);
      }
      console.error(chalk.red(`✘ Error: Directory already exists, choose another name.`));
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
    // Only disable raw mode if it was enabled
    if (process.stdin.isTTY && process.stdin.setRawMode) {
      try {
        process.stdin.setRawMode(false);
        process.stdin.pause();
      } catch {}
    }
  }
}

init();
