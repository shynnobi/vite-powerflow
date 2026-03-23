import fsExtra from 'fs-extra';
import path from 'path';
import { simpleGit } from 'simple-git';
import { fileURLToPath } from 'url';

import { rewriteReadme, rewriteViteConfig, rewriteVitestConfig } from './create/config-rewrite.js';
import { patchRootPackageJson, patchWebPackageJson } from './create/package-patch.js';
import { patchProjectJson } from './create/project-patch.js';
import {
  copyTemplate,
  renameGitignore,
  renameVscodeFolder,
  resolveTemplatePath,
} from './create/template-copy.js';
import {
  cleanupStandaloneScripts,
  fixPermissions,
  formatConfigFiles,
  swapLintStagedConfig,
  updateDevcontainerAndDocker,
} from './create/tooling-postprocess.js';
import { logError, logSuccess } from '../utils/shared/logger.js';

interface ProjectOptions {
  projectName: string;
  packageName: string;
  git: boolean;
  gitUserName?: string;
  gitUserEmail?: string;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Project creation pipeline:
 * 1) Copy template and normalize dotfiles
 * 2) Fix permissions and update devcontainer/docker metadata
 * 3) Patch package.json + project.json with project naming
 * 4) Rewrite placeholders in README/vite/vitest configs
 * 5) Format touched config files
 * 6) Swap lint-staged config and clean standalone scripts
 * 7) Optionally init git and commit
 */
export async function createProject(options: ProjectOptions): Promise<void> {
  let packageName = options.packageName;
  let projectPath = path.join(process.cwd(), packageName);

  try {
    // 1. Copy template files to the new project directory
    const templatePath = await resolveTemplatePath(__dirname);
    if (!(await fsExtra.pathExists(templatePath))) {
      logError(`Template directory not found at ${templatePath}`);
      throw new Error(`Template directory not found. Expected at: ${templatePath}`);
    }

    logSuccess(`✅ Template found at: ${templatePath}`);
    await copyTemplate(templatePath, projectPath);

    // 2. Rename gitignore to .gitignore for proper Git tracking
    const didRenameGitignore = await renameGitignore(projectPath);
    if (didRenameGitignore) {
      logSuccess('✅ .gitignore configured');
    } else {
      logError(`⚠️  Warning: gitignore file not found at ${path.join(projectPath, 'gitignore')}`);
    }

    // 3. Convert _vscode to .vscode for VS Code compatibility, then clean up _vscode
    await renameVscodeFolder(projectPath);

    // 4. Fix permissions for shell scripts and husky hooks
    await fixPermissions(projectPath);

    // 5. Update devcontainer and docker-compose configs for the new project
    await updateDevcontainerAndDocker(projectPath);

    // 6. Update package.json with the new project name and clean metadata
    const packageJsonPath = path.join(projectPath, 'package.json');
    const webPackageJsonPath = path.join(projectPath, 'apps', 'web', 'package.json');
    const webViteConfigPath = path.join(projectPath, 'apps', 'web', 'vite.config.ts');
    const webVitestConfigPath = path.join(projectPath, 'apps', 'web', 'vitest.config.ts');
    try {
      await patchRootPackageJson({
        projectPath,
        packageName: options.packageName,
        projectName: options.projectName,
        gitUserName: options.gitUserName,
        gitUserEmail: options.gitUserEmail,
      });
      await patchWebPackageJson({
        projectPath,
        packageName: options.packageName,
        projectName: options.projectName,
        gitUserName: options.gitUserName,
        gitUserEmail: options.gitUserEmail,
      });
    } catch (packageJsonError) {
      logError('Failed to update package.json');
      logError(
        packageJsonError instanceof Error ? packageJsonError.message : String(packageJsonError)
      );
      throw packageJsonError;
    }

    // 7. Update README.md placeholder for project name
    try {
      await rewriteReadme({ projectPath, projectName: options.projectName });
    } catch (readmeError) {
      logError('Failed to update README.md');
      logError(readmeError instanceof Error ? readmeError.message : String(readmeError));
      throw readmeError;
    }

    // 8. Update vite.config.ts placeholder for project name
    try {
      await rewriteViteConfig({ projectPath, projectName: options.projectName });
    } catch (viteConfigError) {
      logError('Failed to update vite.config.ts');
      logError(
        viteConfigError instanceof Error ? viteConfigError.message : String(viteConfigError)
      );
      throw viteConfigError;
    }

    // 9. Update vitest.config.ts placeholder for project name
    try {
      await rewriteVitestConfig({ projectPath, projectName: options.projectName });
    } catch (vitestConfigError) {
      logError('Failed to update vitest.config.ts');
      logError(
        vitestConfigError instanceof Error ? vitestConfigError.message : String(vitestConfigError)
      );
      throw vitestConfigError;
    }

    // 10. Update project.json placeholders for project name
    const webProjectJsonPath = path.join(projectPath, 'apps', 'web', 'project.json');
    try {
      await patchProjectJson({
        projectPath,
        packageName: options.packageName,
        projectName: options.projectName,
      });
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
    if (await fsExtra.pathExists(webViteConfigPath)) filesToFormat.push(webViteConfigPath);
    if (await fsExtra.pathExists(webVitestConfigPath)) filesToFormat.push(webVitestConfigPath);
    if (await fsExtra.pathExists(webProjectJsonPath)) filesToFormat.push(webProjectJsonPath);
    const devcontainerJsonPath = path.join(projectPath, '.devcontainer', 'devcontainer.json');
    if (await fsExtra.pathExists(devcontainerJsonPath)) filesToFormat.push(devcontainerJsonPath);
    const dockerComposePath = path.join(projectPath, 'docker-compose.yml');
    if (await fsExtra.pathExists(dockerComposePath)) filesToFormat.push(dockerComposePath);
    try {
      await formatConfigFiles(projectPath, filesToFormat);
    } catch (formatError) {
      logError('Error during config files formatting');
      logError(formatError instanceof Error ? formatError.message : String(formatError));
      throw formatError;
    }

    // 12. Replace lint-staged config with Nx version for generated projects
    // Note: The starter includes both standalone and Nx lint-staged configs to handle
    // monorepo compatibility issues in GitHub Actions. Generated projects use pure Nx.
    try {
      await swapLintStagedConfig(projectPath);
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
    try {
      await cleanupStandaloneScripts(projectPath);
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
