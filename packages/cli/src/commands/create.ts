import chalk from 'chalk';
import fs from 'fs/promises';
import fsExtra from 'fs-extra';
import ora from 'ora';
import path from 'path';
import { simpleGit } from 'simple-git';
import { fileURLToPath } from 'url';

import { directoryExists } from '../utils/fs-utils.js';
import { updateDevcontainerWorkspaceFolder, updateDockerComposeVolume } from '../utils/fs-utils.js';
import { safePackageName } from '../utils/safe-package-name.js';

interface ProjectOptions {
  projectName: string;
  description: string;
  author: string;
  git: boolean;
  gitUserName?: string;
  gitUserEmail?: string;
}

// Create a global spinner so it can be stopped from anywhere
export const spinner = ora();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function createProject(options: ProjectOptions): Promise<void> {
  const safeDirName = safePackageName(options.projectName);
  const projectPath = path.join(process.cwd(), safeDirName);

  try {
    // Check if directory already exists
    if (await directoryExists(projectPath)) {
      console.error(chalk.red(`Error: Directory "${options.projectName}" already exists`));
      process.exit(1);
    }

    // Start a single spinner for the whole process
    spinner.start('Creating project...');

    // Copy local template
    const templatePath = path.join(__dirname, '..', 'template');
    await fsExtra.copy(templatePath, projectPath);

    // Update devcontainer and docker-compose (no logs)
    await updateDevcontainerWorkspaceFolder(projectPath);
    await updateDockerComposeVolume(projectPath);

    // Update package.json
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJsonRaw = await fs.readFile(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonRaw);
    packageJson.name = safePackageName(options.projectName);
    packageJson.description = options.description;
    packageJson.author = options.author;
    delete packageJson.repository;
    delete packageJson.homepage;
    delete packageJson.bugs;
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // Initialize Git if requested (no prompts)
    if (options.git) {
      const projectGit = simpleGit(projectPath);
      await projectGit.init();
      if (options.gitUserName && options.gitUserEmail) {
        await projectGit.addConfig('user.name', options.gitUserName, false, 'local');
        await projectGit.addConfig('user.email', options.gitUserEmail, false, 'local');
      }
      await projectGit.add('.');
      await projectGit.commit('Initial commit: Project created with create-vite-powerflow-app');
    }

    // Format package.json and devcontainer.json at the very end
    const devcontainerJsonPath = path.join(projectPath, '.devcontainer', 'devcontainer.json');
    const filesToFormat: string[] = [];
    try {
      await fs.access(packageJsonPath);
      filesToFormat.push(packageJsonPath);
    } catch {
      // ignore error
    }
    try {
      await fs.access(devcontainerJsonPath);
      filesToFormat.push(devcontainerJsonPath);
    } catch {
      // ignore error
    }
    if (filesToFormat.length > 0) {
      const { exec } = await import('child_process');
      await new Promise<void>((resolve) => {
        exec(
          `npx prettier --write ${filesToFormat.map(f => `"${f}"`).join(' ')}`,
          { cwd: projectPath },
          () => resolve()
        );
      });
    }

    // Stop the spinner and show a single success message
    spinner.succeed('Project created successfully');
  } catch (error) {
    spinner.fail('Failed to create project');
    throw error;
  }
}
