import chalk from 'chalk';
import fs from 'fs/promises';
import inquirer, { Question, QuestionCollection } from 'inquirer';
import path from 'path';
import { simpleGit } from 'simple-git';

async function validateProjectName(input: string): Promise<boolean | string> {
  if (!input.trim()) {
    return 'Project name cannot be empty';
  }

  const projectPath = path.join(process.cwd(), input);
  try {
    await fs.access(projectPath);
    return chalk.red(`Directory "${input}" already exists, please choose a different name`);
  } catch {
    return true;
  }
}

export async function promptProjectName(): Promise<string> {
  const { projectName } = await inquirer.prompt<{ projectName: string }>([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: 'my-vite-powerflow-app',
      prefix: '',
      validate: validateProjectName,
    } as Question<{ projectName: string }>,
  ]);
  return projectName;
}

export interface ProjectInfo {
  projectName: string;
  description: string;
  author: string;
}

export async function promptProjectInfo(
  projectName: string
): Promise<Pick<ProjectInfo, 'description' | 'author'>> {
  return inquirer.prompt<Pick<ProjectInfo, 'description' | 'author'>>([
    {
      type: 'input',
      name: 'description',
      message: 'Description:',
      default: `A Vite PowerFlow project named ${projectName}`,
      prefix: '',
    },
    {
      type: 'input',
      name: 'author',
      message: 'Author:',
      prefix: '',
    },
  ] as QuestionCollection<Pick<ProjectInfo, 'description' | 'author'>>);
}

interface GitConfig {
  git: boolean;
}

export async function promptGit(): Promise<GitConfig> {
  return inquirer.prompt<GitConfig>([
    {
      type: 'confirm',
      name: 'git',
      message: 'Initialize a git repository?',
      default: true,
      prefix: '',
    } as Question<GitConfig>,
  ]);
}

export async function promptGitIdentity(): Promise<{ gitUserName: string; gitUserEmail: string } | null> {
  const projectGit = simpleGit();
  let gitUserName = '';
  let gitUserEmail = '';
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
  if (gitUserName && gitUserEmail) {
    const { useGlobal } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'useGlobal',
        message: `Found global git identity:\n  Name: ${gitUserName}\n  Email: ${gitUserEmail}\nDo you want to use this for this project?`,
        default: true,
      },
    ]);
    if (useGlobal) {
      return { gitUserName, gitUserEmail };
    }
  }
  // If not using global, prompt for both
  const answers = await inquirer.prompt([
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
  return { gitUserName: answers.gitUserName, gitUserEmail: answers.gitUserEmail };
}
