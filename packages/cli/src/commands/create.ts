import chalk from 'chalk';
import fs from 'fs/promises';
import ora from 'ora';
import path from 'path';
import { simpleGit } from 'simple-git';

import { directoryExists } from '../utils/fs-utils.js';
import { generateReadme } from '../utils/generate-readme.js';

interface ProjectOptions {
  projectName: string;
  description: string;
  author: string;
  git: boolean;
}

const TEMPLATE_REPO = 'https://github.com/shynnobi/vite-powerflow.git';

// Create a global spinner so it can be stopped from anywhere
export const spinner = ora();

export async function createProject(options: ProjectOptions): Promise<void> {
  // Fonction pour rendre le nom safe pour npm et le dossier
  function safePackageName(name: string) {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-_.]/g, '');
  }
  const safeDirName = safePackageName(options.projectName);
  const projectPath = path.join(process.cwd(), safeDirName);

  try {
    // Check if directory already exists
    if (await directoryExists(projectPath)) {
      console.error(chalk.red(`Error: Directory "${options.projectName}" already exists`));
      process.exit(1);
    }

    // Clone template
    spinner.start('Cloning template...');
    const git = simpleGit();
    await git.clone(TEMPLATE_REPO, projectPath);
    spinner.succeed('Template cloned successfully');

    // Remove .git directory
    spinner.start('Cleaning up...');
    await fs.rm(path.join(projectPath, '.git'), { recursive: true, force: true });
    // Remove docs directory if it exists
    await fs.rm(path.join(projectPath, 'docs'), { recursive: true, force: true });
    spinner.succeed('Cleaned up successfully');

    // Update package.json
    spinner.start('Updating package.json...');
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

    packageJson.name = safePackageName(options.projectName);
    packageJson.description = options.description;
    packageJson.author = options.author;

    // Supprimer les champs liés au starter d'origine
    delete packageJson.repository;
    delete packageJson.homepage;
    delete packageJson.bugs;

    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
    spinner.succeed('Updated package.json successfully');

    // Generate README.md
    const readme = generateReadme(options);
    await fs.writeFile(path.join(projectPath, 'README.md'), readme);

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
    throw error;
  }
}
