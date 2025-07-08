#!/usr/bin/env node
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';

import { createProject, spinner } from './commands/create.js';
import { directoryExists } from './utils/fs-utils.js';
import {
  promptGit,
  promptGitIdentity,
  promptProjectInfo,
  promptProjectName,
} from './utils/prompt-ui.js';

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

  console.log(chalk.red('\nOperation cancelled'));
  process.exit(0);
}

// Handle Ctrl+C
process.stdin.on('keypress', (_, key) => {
  if (key.ctrl && key.name === 'c') {
    cleanup();
  }
});

async function init() {
  try {
    // Enable raw mode to capture Ctrl+C
    process.stdin.setRawMode(true);
    process.stdin.resume();

    // Option 1: Project name from arguments
    let projectName = process.argv[2];
    if (projectName) {
      const projectPath = path.join(process.cwd(), projectName);
      if (await directoryExists(projectPath)) {
        console.error(chalk.red(`Error: Directory "${projectName}" already exists`));
        console.log('Try a different name or run without arguments for interactive mode.');
        process.exit(1);
      }
    }
    // Option 2: Ask for project name via CLI
    else {
      projectName = await promptProjectName();
    }

    currentProjectPath = path.join(process.cwd(), projectName);

    // Step 1: Project information
    const { description, author } = await promptProjectInfo(projectName);

    // Step 2: Git configuration
    const { git } = await promptGit();

    // Step 3: Git identity (if needed)
    let gitUserName: string | undefined = undefined;
    let gitUserEmail: string | undefined = undefined;
    if (git) {
      const identity = await promptGitIdentity();
      if (identity) {
        gitUserName = identity.gitUserName;
        gitUserEmail = identity.gitUserEmail;
      }
    }

    // Step 4: Project creation (atomic, spinner inside)
    await createProject({
      projectName,
      description,
      author,
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
