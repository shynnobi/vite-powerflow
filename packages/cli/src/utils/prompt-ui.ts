import chalk from 'chalk';
import fs from 'fs/promises';
import inquirer, { Question, QuestionCollection } from 'inquirer';
import path from 'path';

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
