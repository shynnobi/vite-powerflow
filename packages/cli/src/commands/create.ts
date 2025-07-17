import { createSpinner, logError } from '@vite-powerflow/tools';

import fs from 'fs/promises';
import fsExtra from 'fs-extra';
import path from 'path';
import { simpleGit } from 'simple-git';
import { fileURLToPath } from 'url';

import { directoryExists } from '@/utils/fs-utils.js';
import { updateDevcontainerWorkspaceFolder, updateDockerComposeVolume } from '@/utils/fs-utils.js';

interface ProjectOptions {
  projectName: string;
  packageName: string;
  git: boolean;
  gitUserName?: string;
  gitUserEmail?: string;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function createProject(options: ProjectOptions): Promise<void> {
  let packageName = options.packageName;
  let projectPath = path.join(process.cwd(), packageName);

  // Use the shared spinner utility
  const spinner = createSpinner('Creating project...');

  try {
    // 1. Copy local template to the new project directory
    spinner.text = 'Copying template...';
    const templatePath = path.join(__dirname, '..', 'template');
    await fsExtra.copy(templatePath, projectPath);

    // Centralize all relevant file paths
    const packageJsonPath = path.join(projectPath, 'package.json');
    const devcontainerJsonPath = path.join(projectPath, '.devcontainer', 'devcontainer.json');
    const tsconfigPath = path.join(projectPath, 'tsconfig.json');
    const readmePath = path.join(projectPath, 'README.md');

    // 2. Clean the generated project's tsconfig.json: remove any reference to tsconfig.base.json
    spinner.text = 'Cleaning tsconfig.json...';
    if (await fsExtra.pathExists(tsconfigPath)) {
      const tsconfigRaw = await fs.readFile(tsconfigPath, 'utf-8');
      const tsconfig = JSON.parse(tsconfigRaw);
      if (tsconfig.extends) {
        delete tsconfig.extends;
        await fs.writeFile(tsconfigPath, JSON.stringify(tsconfig, null, 2));
      }
    }

    // 3. Update devcontainer and docker-compose configs
    spinner.text = 'Updating devcontainer and docker-compose configs...';
    await updateDevcontainerWorkspaceFolder(projectPath);
    await updateDockerComposeVolume(projectPath);

    // 4. Update package.json with the new project name
    spinner.text = 'Updating package.json...';
    if (await fsExtra.pathExists(packageJsonPath)) {
      const packageJsonRaw = await fs.readFile(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(packageJsonRaw);
      packageJson.name = options.packageName;
      await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
    }

    // 5. Update README.md placeholder for project name
    spinner.text = 'Updating README.md...';
    if ((await directoryExists(projectPath)) && (await fsExtra.pathExists(readmePath))) {
      let readmeContent = await fs.readFile(readmePath, 'utf-8');
      readmeContent = readmeContent.replace(/{{projectName}}/g, options.projectName);
      await fs.writeFile(readmePath, readmeContent);
    }

    // 6. Format package.json, devcontainer.json, and tsconfig.json with Prettier
    spinner.text = 'Formatting files...';
    const filesToFormat: string[] = [];
    async function addFileToFormat(filePath: string, filesToFormat: string[]) {
      try {
        await fs.access(filePath);
        filesToFormat.push(filePath);
      } catch {
        // ignore missing files
      }
    }
    await addFileToFormat(packageJsonPath, filesToFormat);
    await addFileToFormat(devcontainerJsonPath, filesToFormat);
    await addFileToFormat(tsconfigPath, filesToFormat);
    if (filesToFormat.length > 0) {
      const { exec } = await import('child_process');
      await new Promise<void>((resolve, reject) => {
        exec(
          `npx prettier --write ${filesToFormat.map(f => `"${f}"`).join(' ')}`,
          { cwd: projectPath },
          (error, stdout, stderr) => {
            if (error) {
              logError('Failed to format files with Prettier: ' + (stderr || error.message));
              reject(error);
            } else {
              resolve();
            }
          }
        );
      });
    }

    // 7. Initialize Git if requested (no prompts)
    spinner.text = 'Initializing Git...';
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

    spinner.succeed(`Project created successfully: ${projectPath}`);
  } catch (error) {
    spinner.fail('Failed to create project');
    logError(error instanceof Error ? error.message : String(error));
    throw error;
  }
}
