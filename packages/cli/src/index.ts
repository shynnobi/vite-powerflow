#!/usr/bin/env node
import chalk from 'chalk';
import { Command } from 'commander';
import fs from 'fs/promises';
import path from 'path';

import { createProject } from './commands/create.js';
import { directoryExists } from './utils/fs-utils.js';
import { promptProjectName } from './utils/prompt-ui.js';
import { safePackageName } from './utils/safe-package-name.js';
import { logError } from './utils/shared/logger.js';
import type { GitOptions } from '../types/git-options.js';

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
    void cleanup();
  }
});

const program = new Command()
  .name('@vite-powerflow/create')
  .version(process.env.npm_package_version || '1.0.4')
  .argument(
    '[project-directory]',
    'The name of the project directory (optional in interactive mode)'
  )
  .option('-g, --git', 'Initialize Git repository')
  .option('-u, --git-user-name <name>', 'Git user.name (required with --git)')
  .option('-e, --git-user-email <email>', 'Git user.email (required with --git)')
  .option('-o, --use-global-git', 'Use global Git identity if found')
  .addHelpText(
    'after',
    '\nExamples:\n  $ npx @vite-powerflow/create              # Interactive mode\n  $ npx @vite-powerflow/create my-app       # Non-interactive with project name\n  $ npx @vite-powerflow/create my-app --git # With Git initialization'
  );

program.parse(process.argv);
const cliOptions = program.opts<GitOptions>();

function isNonInteractiveMode(opts: GitOptions, args: string[]) {
  // If no project directory is provided, force interactive mode
  if (args.length === 0) return false;

  // Check if we're in non-interactive mode (all required options are provided)
  const hasGitOptions = opts.git && opts.gitUserName && opts.gitUserEmail;
  const hasNoGitOptions =
    !opts.git && !opts.gitUserName && !opts.gitUserEmail && !opts.useGlobalGit;

  // We're in non-interactive mode only if:
  // 1. All Git-related options are provided, or
  // 2. No Git-related options are provided at all
  return hasGitOptions || hasNoGitOptions;
}

async function init() {
  try {
    // Only enable raw mode if not in non-interactive mode
    const nonInteractive = isNonInteractiveMode(cliOptions, program.args);
    if (!nonInteractive && process.stdin.isTTY) {
      process.stdin.setRawMode(true);
      process.stdin.resume();
    }

    // Get project name from argument or prompt if not provided
    let projectName = program.args[0];
    if (!projectName) {
      projectName = await (await import('./utils/prompt-ui.js')).promptProjectName();
    }

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
    const git = await (await import('./utils/prompt-ui.js')).promptGit(cliOptions.git);

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

void init();
