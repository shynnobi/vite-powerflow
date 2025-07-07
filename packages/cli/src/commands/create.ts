import chalk from 'chalk';
import { execa } from 'execa';
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

    // Copy local template
    spinner.start('Copying template...');
    const templatePath = path.join(__dirname, '..', 'template');
    await fsExtra.copy(templatePath, projectPath);

    // Update devcontainer.json workspaceFolder
    await updateDevcontainerWorkspaceFolder(projectPath);
    // Update docker-compose.yml volume mapping
    await updateDockerComposeVolume(projectPath);

    // Generate the .gitignore file using the tools script
    const toolsScript = path.resolve(__dirname, '../../../tools/cli-scripts/generate-gitignore.ts');
    await execa('tsx', [toolsScript, projectPath], { stdio: 'inherit' });
    spinner.succeed('Template copied successfully');

    // Update package.json
    spinner.start('Updating package.json...');
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

    packageJson.name = safePackageName(options.projectName);
    packageJson.description = options.description;
    packageJson.author = options.author;

    // Remove fields related to the original starter
    delete packageJson.repository;
    delete packageJson.homepage;
    delete packageJson.bugs;

    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
    spinner.succeed('Updated package.json successfully');

    // Initialize Git if requested
    if (options.git) {
      console.log(''); // Add newline after "Initialize Git? Yes"

      // Check for user.name and user.email in global git config
      let gitUserName = '';
      let gitUserEmail = '';
      let useGlobalIdentity = true;
      const projectGit = simpleGit(projectPath);
      try {
        gitUserName = (await projectGit.raw(['config', '--global', '--get', 'user.name'])).trim();
      } catch {
        // ignore error
      }
      try {
        gitUserEmail = (await projectGit.raw(['config', '--global', '--get', 'user.email'])).trim();
      } catch {
        // ignore error
      }

      // Gather git identity info BEFORE starting spinner or git init
      let localUserName = gitUserName;
      let localUserEmail = gitUserEmail;
      if (gitUserName && gitUserEmail) {
        const inquirer = await import('inquirer');
        const confirm = await inquirer.default.prompt([
          {
            type: 'confirm',
            name: 'useGlobal',
            message: `Found global git identity:\n  Name: ${gitUserName}\n  Email: ${gitUserEmail}\nDo you want to use this for this project?`,
            default: true,
          },
        ]);
        useGlobalIdentity = confirm.useGlobal;
        if (!useGlobalIdentity) {
          const answers = await inquirer.default.prompt([
            {
              type: 'input',
              name: 'gitUserName',
              message: 'Git user.name (for commits):',
              default: gitUserName,
            },
            {
              type: 'input',
              name: 'gitUserEmail',
              message: 'Git user.email (for commits):',
              default: gitUserEmail,
            },
          ]);
          localUserName = answers.gitUserName;
          localUserEmail = answers.gitUserEmail;
        }
      } else {
        // If any value is missing, prompt for both
        console.log(
          'No global git identity found. Please enter your name and email for this project.'
        );
        const inquirer = await import('inquirer');
        const answers = await inquirer.default.prompt([
          {
            type: 'input',
            name: 'gitUserName',
            message: 'Git user.name (for commits):',
            default: gitUserName || undefined,
          },
          {
            type: 'input',
            name: 'gitUserEmail',
            message: 'Git user.email (for commits):',
            default: gitUserEmail || undefined,
          },
        ]);
        localUserName = answers.gitUserName;
        localUserEmail = answers.gitUserEmail;
      }

      spinner.start('Initializing git repository...');
      await projectGit.init();
      // If user provided custom identity, set it locally
      if (!useGlobalIdentity || !gitUserName || !gitUserEmail) {
        if (localUserName) {
          await projectGit.addConfig('user.name', localUserName, false, 'local');
        }
        if (localUserEmail) {
          await projectGit.addConfig('user.email', localUserEmail, false, 'local');
        }
      }
      await projectGit.add('.');
      await projectGit.commit('Initial commit: Project created with create-vite-powerflow-app');
      spinner.succeed('Initialized git repository\n'); // Add newline after initialization
    }

    console.log(chalk.green('✨ Project created successfully!'));
    console.log('Next steps:');
    console.log(chalk.cyan(`  cd ${options.projectName}`));
    console.log(chalk.cyan('  pnpm install'));
    console.log(chalk.cyan('  pnpm dev'));
  } catch (error) {
    spinner.fail('Failed to create project');
    console.error('CREATE PROJECT ERROR:', error); // Log the error for debugging
    throw error;
  }
}
