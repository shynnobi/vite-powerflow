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
    // After build: dist/index.js is in dist/, so template is in dist/template/
    // During development: src/commands/create.ts is in src/commands/, so we need to go up to packages/cli/template/
    let templatePath = path.join(__dirname, '..', '..', 'template');

    // If template not found (bundled case), try relative to the current module
    if (!(await fsExtra.pathExists(templatePath))) {
      // In bundled/distributed case, template should be alongside dist/index.js
      templatePath = path.join(__dirname, 'template');
    }

    if (!(await fsExtra.pathExists(templatePath))) {
      logError(`Template directory not found at ${templatePath}`);
      throw new Error(`Template directory not found. Expected at: ${templatePath}`);
    }

    logSuccess(`✅ Template found at: ${templatePath}`);
    await fsExtra.copy(templatePath, projectPath);

    // 2. Rename gitignore to .gitignore for proper Git tracking
    // The gitignore file is named 'gitignore' (without dot) in the template to avoid npm ignoring it during package distribution
    const gitignorePath = path.join(projectPath, 'gitignore');
    const dotGitignorePath = path.join(projectPath, '.gitignore');
    if (await fsExtra.pathExists(gitignorePath)) {
      await fsExtra.move(gitignorePath, dotGitignorePath);
      logSuccess('✅ .gitignore configured');
    } else {
      logError(`⚠️  Warning: gitignore file not found at ${gitignorePath}`);
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
    const webPackageJsonPath = path.join(projectPath, 'apps', 'web', 'package.json');
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

        // Fix web:dev script in root package.json to use Vite directly via pnpm filter.
        // This makes "pnpm web:dev" an alias for "pnpm --filter @<projectName>/web dev".
        if (packageJson.scripts && (packageJson.scripts as any)['web:dev']) {
          (packageJson.scripts as any)['web:dev'] = `pnpm --filter @${options.packageName}/web dev`;
        }

        await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
      }

      // 6b. Update apps/web/package.json with the new project name
      if (await fsExtra.pathExists(webPackageJsonPath)) {
        const webPackageJsonRaw = await fs.readFile(webPackageJsonPath, 'utf-8');
        const webPackageJson = JSON.parse(webPackageJsonRaw) as PackageJson;

        // Rename the web package to @projectName/web
        webPackageJson.name = `@${options.packageName}/web`;
        webPackageJson.version = '0.0.1';

        // Clean up metadata inherited from the monorepo starter
        delete webPackageJson.repository;
        delete webPackageJson.homepage;
        delete webPackageJson.bugs;
        delete webPackageJson.keywords;
        delete webPackageJson.syncConfig;

        await fs.writeFile(webPackageJsonPath, JSON.stringify(webPackageJson, null, 2));
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

    // 8. Update vite.config.ts placeholder for project name
    const viteConfigPath = path.join(projectPath, 'vite.config.ts');
    const webViteConfigPath = path.join(projectPath, 'apps', 'web', 'vite.config.ts');
    try {
      if (await fsExtra.pathExists(viteConfigPath)) {
        let viteConfigContent = await fs.readFile(viteConfigPath, 'utf-8');
        // Replace {{projectName}} placeholders
        viteConfigContent = viteConfigContent.replace(/{{projectName}}/g, options.projectName);
        // Replace hardcoded 'starter' references
        viteConfigContent = viteConfigContent.replace(/starter/g, options.projectName);
        await fs.writeFile(viteConfigPath, viteConfigContent);
      }

      // 8b. Update apps/web/vite.config.ts placeholder for project name
      if (await fsExtra.pathExists(webViteConfigPath)) {
        let webViteConfigContent = await fs.readFile(webViteConfigPath, 'utf-8');
        // Replace {{projectName}} placeholders
        webViteConfigContent = webViteConfigContent.replace(
          /{{projectName}}/g,
          options.projectName
        );
        // Replace hardcoded 'starter' references
        webViteConfigContent = webViteConfigContent.replace(/starter/g, options.projectName);
        await fs.writeFile(webViteConfigPath, webViteConfigContent);
      }
    } catch (viteConfigError) {
      logError('Failed to update vite.config.ts');
      logError(
        viteConfigError instanceof Error ? viteConfigError.message : String(viteConfigError)
      );
      throw viteConfigError;
    }

    // 9. Update vitest.config.ts placeholder for project name
    const vitestConfigPath = path.join(projectPath, 'vitest.config.ts');
    const webVitestConfigPath = path.join(projectPath, 'apps', 'web', 'vitest.config.ts');
    try {
      if (await fsExtra.pathExists(vitestConfigPath)) {
        let vitestConfigContent = await fs.readFile(vitestConfigPath, 'utf-8');
        // Replace hardcoded 'starter' references
        vitestConfigContent = vitestConfigContent.replace(/starter/g, options.projectName);
        await fs.writeFile(vitestConfigPath, vitestConfigContent);
      }

      // 9b. Update apps/web/vitest.config.ts placeholder for project name
      if (await fsExtra.pathExists(webVitestConfigPath)) {
        let webVitestConfigContent = await fs.readFile(webVitestConfigPath, 'utf-8');
        // Replace hardcoded 'starter' references
        webVitestConfigContent = webVitestConfigContent.replace(/starter/g, options.projectName);
        await fs.writeFile(webVitestConfigPath, webVitestConfigContent);
      }
    } catch (vitestConfigError) {
      logError('Failed to update vitest.config.ts');
      logError(
        vitestConfigError instanceof Error ? vitestConfigError.message : String(vitestConfigError)
      );
      throw vitestConfigError;
    }

    // 10. Update project.json placeholders for project name
    const projectJsonPath = path.join(projectPath, 'project.json');
    const webProjectJsonPath = path.join(projectPath, 'apps', 'web', 'project.json');
    try {
      if (await fsExtra.pathExists(projectJsonPath)) {
        let projectJsonContent = await fs.readFile(projectJsonPath, 'utf-8');
        // Replace {{projectName}} placeholders
        projectJsonContent = projectJsonContent.replace(
          /\{\{projectName\}\}/g,
          options.projectName
        );
        // Replace @vite-powerflow/starter references
        projectJsonContent = projectJsonContent.replace(
          /@vite-powerflow\/starter/g,
          options.projectName
        );
        projectJsonContent = projectJsonContent.replace(
          /@vite-powerflow\/starter:build/g,
          `${options.projectName}:build`
        );
        await fs.writeFile(projectJsonPath, projectJsonContent);
      }

      // 10b. Update apps/web/project.json placeholders for project name
      if (await fsExtra.pathExists(webProjectJsonPath)) {
        let webProjectJsonContent = await fs.readFile(webProjectJsonPath, 'utf-8');
        // Replace {{projectName}} placeholders
        webProjectJsonContent = webProjectJsonContent.replace(
          /\{\{projectName\}\}/g,
          options.projectName
        );
        // Ensure Nx project name for web app matches the generated package name
        // This makes sure Nx registers a project like "@<projectName>/web"
        webProjectJsonContent = webProjectJsonContent.replace(
          /"name":\s*"@vite-powerflow\/starter"/,
          `"name": "@${options.packageName}/web"`
        );
        // Replace @vite-powerflow/starter-web references
        webProjectJsonContent = webProjectJsonContent.replace(
          /@vite-powerflow\/starter-web/g,
          `@${options.packageName}/web`
        );
        // Replace @vite-powerflow/starter-web:build references
        webProjectJsonContent = webProjectJsonContent.replace(
          /@vite-powerflow\/starter-web:build/g,
          `@${options.packageName}/web:build`
        );
        // Replace @vite-powerflow/starter-web:serve references
        webProjectJsonContent = webProjectJsonContent.replace(
          /@vite-powerflow\/starter-web:serve/g,
          `@${options.packageName}/web:serve`
        );
        // Replace older starter buildTarget/browserTarget values that pointed to the
        // root project ("test-app") so they now point to the web project instead.
        webProjectJsonContent = webProjectJsonContent.replace(
          /test-app:build/g,
          `@${options.packageName}/web:build`
        );
        webProjectJsonContent = webProjectJsonContent.replace(
          /test-app:serve/g,
          `@${options.packageName}/web:serve`
        );
        await fs.writeFile(webProjectJsonPath, webProjectJsonContent);
      }
    } catch (projectJsonError) {
      logError('Failed to update project.json');
      logError(
        projectJsonError instanceof Error ? projectJsonError.message : String(projectJsonError)
      );
      throw projectJsonError;
    }

    // 11. Format config files with Prettier for consistency
    const filesToFormat: string[] = [];
    if (await fsExtra.pathExists(packageJsonPath)) filesToFormat.push(packageJsonPath);
    if (await fsExtra.pathExists(webPackageJsonPath)) filesToFormat.push(webPackageJsonPath);
    if (await fsExtra.pathExists(tsconfigPath)) filesToFormat.push(tsconfigPath);
    if (await fsExtra.pathExists(viteConfigPath)) filesToFormat.push(viteConfigPath);
    if (await fsExtra.pathExists(webViteConfigPath)) filesToFormat.push(webViteConfigPath);
    if (await fsExtra.pathExists(vitestConfigPath)) filesToFormat.push(vitestConfigPath);
    if (await fsExtra.pathExists(webVitestConfigPath)) filesToFormat.push(webVitestConfigPath);
    if (await fsExtra.pathExists(projectJsonPath)) filesToFormat.push(projectJsonPath);
    if (await fsExtra.pathExists(webProjectJsonPath)) filesToFormat.push(webProjectJsonPath);
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

    // 13. Fix .gitignore to include .nx/ directory
    const projectGitignorePath = path.join(projectPath, '.gitignore');
    try {
      if (await fsExtra.pathExists(projectGitignorePath)) {
        let gitignoreContent = await fs.readFile(projectGitignorePath, 'utf-8');
        // Replace .nx with .nx/ to ignore the entire directory
        gitignoreContent = gitignoreContent.replace(/\.nx(?!\/)/g, '.nx/');
        await fs.writeFile(projectGitignorePath, gitignoreContent);
      }
    } catch (gitignoreError) {
      logError('Failed to update .gitignore');
      logError(gitignoreError instanceof Error ? gitignoreError.message : String(gitignoreError));
      throw gitignoreError;
    }

    // 14. Replace lint-staged config with Nx version for generated projects
    // Note: The starter includes both standalone and Nx lint-staged configs to handle
    // monorepo compatibility issues in GitHub Actions. Generated projects use pure Nx.
    const lintstagedPath = path.join(projectPath, '.lintstagedrc.js');
    const lintstagedNxPath = path.join(projectPath, '.lintstagedrc-nx.js');

    try {
      // Delete the standalone version (used in monorepo to avoid Nx dependency issues)
      if (await fsExtra.pathExists(lintstagedPath)) {
        await fs.unlink(lintstagedPath);
      }

      // Rename Nx version to be the main config (generated projects use pure Nx)
      if (await fsExtra.pathExists(lintstagedNxPath)) {
        await fs.rename(lintstagedNxPath, lintstagedPath);
      }
    } catch (lintstagedError) {
      logError('Failed to update .lintstagedrc.js');
      logError(
        lintstagedError instanceof Error ? lintstagedError.message : String(lintstagedError)
      );
      throw lintstagedError;
    }

    // 13. Clean up package.json scripts (remove standalone scripts)
    // Note: Standalone scripts were needed in the monorepo starter to avoid Nx dependency issues
    // in GitHub Actions CI/CD pipelines (resolved "nx ENOENT" errors). Generated projects use
    // pure Nx commands, so these standalone fallbacks are no longer needed.
    const packageJsonCleanupPath = path.join(projectPath, 'package.json');
    try {
      const packageJsonRaw = await fs.readFile(packageJsonCleanupPath, 'utf-8');
      const packageJson = JSON.parse(packageJsonRaw);

      // Remove standalone scripts (no longer needed in generated projects)
      delete packageJson.scripts['format:fix:standalone'];
      delete packageJson.scripts['lint:fix:standalone'];

      await fs.writeFile(packageJsonCleanupPath, JSON.stringify(packageJson, null, 2));
    } catch (packageJsonError) {
      logError('Failed to clean package.json scripts');
      logError(
        packageJsonError instanceof Error ? packageJsonError.message : String(packageJsonError)
      );
      throw packageJsonError;
    }

    // 14. Initialize Git repository and create initial commit if requested
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
      } catch (gitError) {
        logError('Failed to initialize Git or create initial commit');
        logError(gitError instanceof Error ? gitError.message : String(gitError));
        throw gitError;
      }
    }

    // 15. Final success log
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
