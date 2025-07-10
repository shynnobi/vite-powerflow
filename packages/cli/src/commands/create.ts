import fs from 'fs/promises';
import fsExtra from 'fs-extra';
import ora from 'ora';
import path from 'path';
import { simpleGit } from 'simple-git';
import { fileURLToPath } from 'url';

import { directoryExists } from '../utils/fs-utils.js';
import { updateDevcontainerWorkspaceFolder, updateDockerComposeVolume } from '../utils/fs-utils.js';

interface ProjectOptions {
  projectName: string; // for display/README
  packageName: string; // for directory and package.json
  git: boolean;
  gitUserName?: string;
  gitUserEmail?: string;
}

// Create a global spinner so it can be stopped from anywhere
export const spinner = ora();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function createProject(options: ProjectOptions): Promise<void> {
  let packageName = options.packageName;
  let projectPath = path.join(process.cwd(), packageName);

  try {
    // Start a single spinner for the whole process
    spinner.start('Creating project...');

    // Copy local template
    const templatePath = path.join(__dirname, '..', 'template');
    await fsExtra.copy(templatePath, projectPath);

    // Update devcontainer and docker-compose
    await updateDevcontainerWorkspaceFolder(projectPath);
    await updateDockerComposeVolume(projectPath);

    // Update package.json
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJsonRaw = await fs.readFile(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonRaw);
    packageJson.name = options.packageName;
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // Update README.md placeholder for project name only
    const readmePath = path.join(projectPath, 'README.md');
    if ((await directoryExists(projectPath)) && (await fsExtra.pathExists(readmePath))) {
      let readmeContent = await fs.readFile(readmePath, 'utf-8');
      // Use the original projectName (not safe/slugified) for README
      readmeContent = readmeContent.replace(/{{projectName}}/g, options.projectName);
      await fs.writeFile(readmePath, readmeContent);
    }

    // Format package.json and devcontainer.json
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
      await new Promise<void>(resolve => {
        exec(
          `npx prettier --write ${filesToFormat.map(f => `"${f}"`).join(' ')}`,
          { cwd: projectPath },
          () => resolve()
        );
      });
    }

    // Initialize Git if requested (no prompts)
    if (options.git) {
      const projectGit = simpleGit(projectPath);
      await projectGit.init();
      if (options.gitUserName && options.gitUserEmail) {
        await projectGit.addConfig('user.name', options.gitUserName, false, 'local');
        await projectGit.addConfig('user.email', options.gitUserEmail, false, 'local');
      }
      await projectGit.add('.');
      await projectGit.commit('chore: initial commit');
    }

    // Stop the spinner and show a single success message
    spinner.succeed('Project created successfully');
  } catch (error) {
    spinner.fail('Failed to create project');
    throw error;
  }
}
