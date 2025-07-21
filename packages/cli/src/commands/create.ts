import { logError, logSuccess } from '@vite-powerflow/utils';
import fs from 'fs/promises';
import fsExtra from 'fs-extra';
import path from 'path';
import { simpleGit } from 'simple-git';
import { fileURLToPath } from 'url';

import { updateDevcontainerWorkspaceFolder, updateDockerComposeVolume } from '../utils/fs-utils.js';
import { directoryExists } from '../utils/fs-utils.js';

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

  try {
    // Copy template
    const templatePath = path.join(__dirname, 'template');
    await fsExtra.copy(templatePath, projectPath);
    // logSuccess('Template copied successfully');

    // Rename gitignore to .gitignore if it exists
    const gitignorePath = path.join(projectPath, 'gitignore');
    const dotGitignorePath = path.join(projectPath, '.gitignore');
    if (await fsExtra.pathExists(gitignorePath)) {
      await fsExtra.move(gitignorePath, dotGitignorePath);
    }

    // Rename _vscode to .vscode if it exists
    const underscoreVscodePath = path.join(projectPath, '_vscode');
    const dotVscodePath = path.join(projectPath, '.vscode');
    if (await fsExtra.pathExists(underscoreVscodePath)) {
      await fsExtra.move(underscoreVscodePath, dotVscodePath);
    }

    // Fix permissions for shell scripts in scripts/
    async function fixShellScriptPermissions(targetDir: string) {
      const fsSync = await import('fs');
      const pathMod = await import('path');
      // scripts/*.sh
      const scriptsDir = pathMod.join(targetDir, 'scripts');
      if (fsSync.existsSync(scriptsDir)) {
        for (const file of fsSync.readdirSync(scriptsDir)) {
          if (file.endsWith('.sh')) {
            try {
              fsSync.chmodSync(pathMod.join(scriptsDir, file), 0o755);
            } catch {}
          }
        }
      }
    }
    await fixShellScriptPermissions(projectPath);

    // Files to update
    const packageJsonPath = path.join(projectPath, 'package.json');
    const tsconfigPath = path.join(projectPath, 'tsconfig.json');
    const readmePath = path.join(projectPath, 'README.md');

    // Update devcontainer and docker-compose configs
    await updateDevcontainerWorkspaceFolder(projectPath);
    await updateDockerComposeVolume(projectPath);
    // logSuccess('Devcontainer and docker-compose configs updated.');

    // Update package.json with the new project name
    try {
      if (await fsExtra.pathExists(packageJsonPath)) {
        const packageJsonRaw = await fs.readFile(packageJsonPath, 'utf-8');
        const packageJson = JSON.parse(packageJsonRaw);
        packageJson.name = options.packageName;
        await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
        // logSuccess('package.json updated.');
      }
    } catch (packageJsonError) {
      logError('Failed to update package.json');
      logError(
        packageJsonError instanceof Error ? packageJsonError.message : String(packageJsonError)
      );
      throw packageJsonError;
    }

    // Update README.md placeholder for project name
    try {
      if ((await directoryExists(projectPath)) && (await fsExtra.pathExists(readmePath))) {
        let readmeContent = await fs.readFile(readmePath, 'utf-8');
        readmeContent = readmeContent.replace(/{{projectName}}/g, options.projectName);
        await fs.writeFile(readmePath, readmeContent);
        // logSuccess('README.md updated.');
      }
    } catch (readmeError) {
      logError('Failed to update README.md');
      logError(readmeError instanceof Error ? readmeError.message : String(readmeError));
      throw readmeError;
    }

    // Files to format
    const filesToFormat: string[] = [];
    if (await fsExtra.pathExists(packageJsonPath)) filesToFormat.push(packageJsonPath);
    if (await fsExtra.pathExists(tsconfigPath)) filesToFormat.push(tsconfigPath);
    const devcontainerJsonPath = path.join(projectPath, '.devcontainer', 'devcontainer.json');
    if (await fsExtra.pathExists(devcontainerJsonPath)) filesToFormat.push(devcontainerJsonPath);
    const dockerComposePath = path.join(projectPath, 'docker-compose.yml');
    if (await fsExtra.pathExists(dockerComposePath)) filesToFormat.push(dockerComposePath);

    // Format files with Prettier
    try {
      if (filesToFormat.length > 0) {
        const { exec } = await import('child_process');
        await new Promise<void>((resolve, reject) => {
          exec(
            `npx prettier --write ${filesToFormat.map(f => `"${f}"`).join(' ')}`,
            { cwd: projectPath },
            (error, _stdout, stderr) => {
              if (error) {
                logError('Failed to format config files with Prettier');
                logError(stderr || error.message);
                reject(error);
              } else {
                resolve();
              }
            }
          );
        });
      }
    } catch (formatError) {
      logError('Error during config files formatting');
      logError(formatError instanceof Error ? formatError.message : String(formatError));
      throw formatError;
    }

    // Initialize Git if requested (no prompts)
    if (options.git) {
      try {
        const projectGit = simpleGit(projectPath);
        await projectGit.init();
        if (options.gitUserName && options.gitUserEmail) {
          await projectGit.addConfig('user.name', options.gitUserName, false, 'local');
          await projectGit.addConfig('user.email', options.gitUserEmail, false, 'local');
        }
        await projectGit.add('.');
        await projectGit.commit('chore: initial commit');
        // logSuccess('Git initialized and initial commit created.');
      } catch (gitError) {
        logError('Failed to initialize Git or create initial commit');
        logError(gitError instanceof Error ? gitError.message : String(gitError));
        throw gitError;
      }
    }

    logSuccess(`Project created at: ${projectPath}`);
  } catch (error) {
    logError('Failed to create project');
    // Don't show "dest already exists" error as it's often a false positive
    if (!(error instanceof Error) || !error.message?.includes('dest already exists')) {
      logError(error instanceof Error ? error.message : String(error));
    }
    process.exit(1);
  }
}
