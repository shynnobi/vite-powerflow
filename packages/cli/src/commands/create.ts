import fs from 'fs/promises';
import fsExtra from 'fs-extra';
import path from 'path';
import { simpleGit } from 'simple-git';
import { fileURLToPath } from 'url';

import { logError, logSuccess } from '../utils/shared/logger.js';

/**
 * Standard package.json structure used by CLI
 */
interface PackageJson {
  name?: string;
  version?: string;
  private?: boolean;
  author?: string | { name: string; email?: string; url?: string };
  [key: string]: unknown;
}
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
    // 1. Copy template files to the new project directory
    const templatePath = path.join(__dirname, 'template');
    await fsExtra.copy(templatePath, projectPath);

    // 2. Rename gitignore to .gitignore for proper Git tracking
    const gitignorePath = path.join(projectPath, 'gitignore');
    const dotGitignorePath = path.join(projectPath, '.gitignore');
    if (await fsExtra.pathExists(gitignorePath)) {
      await fsExtra.move(gitignorePath, dotGitignorePath);
    }

    // 3. Convert _vscode to .vscode for VS Code compatibility, then clean up _vscode
    const underscoreVscodePath = path.join(projectPath, '_vscode');
    const dotVscodePath = path.join(projectPath, '.vscode');
    if (await fsExtra.pathExists(underscoreVscodePath)) {
      if (await fsExtra.pathExists(dotVscodePath)) {
        await fsExtra.remove(dotVscodePath);
      }
      await fsExtra.move(underscoreVscodePath, dotVscodePath, { overwrite: true });
      // Remove _vscode if it still exists (edge case)
      if (await fsExtra.pathExists(underscoreVscodePath)) {
        await fsExtra.remove(underscoreVscodePath);
      }
    }

    // 4. Fix permissions for shell scripts and husky hooks
    async function fixPermissions(targetDir: string) {
      const fsSync = await import('fs');
      const pathMod = await import('path');

      // scripts/*.sh at the project root
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

      // .devcontainer/scripts/*.sh
      const devcontainerScriptsDir = pathMod.join(targetDir, '.devcontainer', 'scripts');
      if (fsSync.existsSync(devcontainerScriptsDir)) {
        for (const file of fsSync.readdirSync(devcontainerScriptsDir)) {
          if (file.endsWith('.sh')) {
            try {
              fsSync.chmodSync(pathMod.join(devcontainerScriptsDir, file), 0o755);
            } catch {}
          }
        }
      }

      // .husky/* (all files, not just .sh)
      const huskyDir = pathMod.join(targetDir, '.husky');
      if (fsSync.existsSync(huskyDir)) {
        for (const file of fsSync.readdirSync(huskyDir)) {
          try {
            fsSync.chmodSync(pathMod.join(huskyDir, file), 0o755);
          } catch {}
        }
      }
    }
    await fixPermissions(projectPath);

    // 5. Update devcontainer and docker-compose configs for the new project
    await updateDevcontainerWorkspaceFolder(projectPath);
    await updateDockerComposeVolume(projectPath);

    // 6. Update package.json with the new project name and clean metadata
    const packageJsonPath = path.join(projectPath, 'package.json');
    const tsconfigPath = path.join(projectPath, 'tsconfig.json');
    const readmePath = path.join(projectPath, 'README.md');
    try {
      if (await fsExtra.pathExists(packageJsonPath)) {
        const packageJsonRaw = await fs.readFile(packageJsonPath, 'utf-8');
        const packageJson = JSON.parse(packageJsonRaw) as PackageJson;

        // Set project name and reset version
        packageJson.name = options.packageName;
        packageJson.version = '0.0.1';
        packageJson.description = '';

        // Set author based on Git user info if available
        if (options.gitUserName) {
          const author: { name: string; email?: string } = { name: options.gitUserName };
          if (options.gitUserEmail) {
            author.email = options.gitUserEmail;
          }
          packageJson.author = author;
        } else {
          // Otherwise, set to an empty string as a placeholder
          packageJson.author = '';
        }

        // Clean up metadata inherited from the monorepo starter
        delete packageJson.repository;
        delete packageJson.homepage;
        delete packageJson.bugs;
        delete packageJson.keywords;
        delete packageJson.syncConfig; // Remove monorepo-specific sync configuration

        await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
      }
    } catch (packageJsonError) {
      logError('Failed to update package.json');
      logError(
        packageJsonError instanceof Error ? packageJsonError.message : String(packageJsonError)
      );
      throw packageJsonError;
    }

    // 7. Update README.md placeholder for project name
    try {
      if ((await directoryExists(projectPath)) && (await fsExtra.pathExists(readmePath))) {
        let readmeContent = await fs.readFile(readmePath, 'utf-8');
        readmeContent = readmeContent.replace(/{{projectName}}/g, options.projectName);
        await fs.writeFile(readmePath, readmeContent);
      }
    } catch (readmeError) {
      logError('Failed to update README.md');
      logError(readmeError instanceof Error ? readmeError.message : String(readmeError));
      throw readmeError;
    }

    // 8. Format config files with Prettier for consistency
    const filesToFormat: string[] = [];
    if (await fsExtra.pathExists(packageJsonPath)) filesToFormat.push(packageJsonPath);
    if (await fsExtra.pathExists(tsconfigPath)) filesToFormat.push(tsconfigPath);
    const devcontainerJsonPath = path.join(projectPath, '.devcontainer', 'devcontainer.json');
    if (await fsExtra.pathExists(devcontainerJsonPath)) filesToFormat.push(devcontainerJsonPath);
    const dockerComposePath = path.join(projectPath, 'docker-compose.yml');
    if (await fsExtra.pathExists(dockerComposePath)) filesToFormat.push(dockerComposePath);
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

    // 9. Initialize Git repository and create initial commit if requested
    if (options.git) {
      try {
        const projectGit = simpleGit(projectPath);
        await projectGit.init();
        if (options.gitUserName) {
          await projectGit.addConfig('user.name', options.gitUserName, false, 'local');
        }
        if (options.gitUserEmail) {
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

    // 10. Final success log
    logSuccess(`Project created at: ${projectPath}`);
  } catch (error) {
    logError('Failed to create project');
    console.error(error); // Print full error details for debugging
    // Don't show "dest already exists" error as it's often a false positive
    if (!(error instanceof Error) || !error.message?.includes('dest already exists')) {
      logError(error instanceof Error ? error.message : String(error));
    }
    process.exit(1);
  }
}
