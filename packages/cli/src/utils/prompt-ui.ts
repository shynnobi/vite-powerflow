import chalk from 'chalk';
import { simpleGit } from 'simple-git';
import validator from 'validator';

type PromptConstructor = new (options: Record<string, unknown>) => { run: () => Promise<unknown> };

export async function promptProjectName(defaultName?: string): Promise<string> {
  if (defaultName) return defaultName;
  const { default: InputPrompt } = await import('enquirer/lib/prompts/input.js');
  // Dynamically cast the constructor to satisfy TypeScript
  return (await new (InputPrompt as unknown as PromptConstructor)({
    message: 'Project name:',
    initial: 'my-vite-powerflow-app',
    // No validation: allow any input for project name
  }).run()) as string;
}

export async function promptGit(defaultGit?: boolean): Promise<boolean> {
  if (typeof defaultGit === 'boolean') return defaultGit;
  const { default: ConfirmPrompt } = await import('enquirer/lib/prompts/confirm.js');
  return (await new (ConfirmPrompt as unknown as PromptConstructor)({
    message: 'Initialize Git?',
    initial: true,
  }).run()) as boolean;
}

// Optional parameters added
type GitIdentity = { gitUserName: string; gitUserEmail: string };

export async function promptGitIdentity(
  gitUserName?: string,
  gitUserEmail?: string,
  useGlobalIfFound?: boolean
): Promise<GitIdentity | undefined> {
  // Non-interactive mode: if both are provided, return directly
  if (gitUserName && gitUserEmail) {
    return { gitUserName, gitUserEmail };
  }

  const projectGit = simpleGit();
  let userName = '';
  let userEmail = '';
  try {
    userName = (await projectGit.raw(['config', '--global', '--get', 'user.name'])).trim();
  } catch {
    // ignore error
  }
  try {
    userEmail = (await projectGit.raw(['config', '--global', '--get', 'user.email'])).trim();
  } catch {
    // ignore error
  }

  // Early return if useGlobalIfFound is true and both userName and userEmail are found
  if (useGlobalIfFound && userName && userEmail) {
    return { gitUserName: userName, gitUserEmail: userEmail };
  }

  // Correction: if useGlobalIfFound is true and no global identity, do not prompt, just return undefined
  if (useGlobalIfFound && (!userName || !userEmail)) {
    return undefined;
  }

  if (userName && userEmail) {
    const question = chalk.blue('?');
    const bold = chalk.bold;
    const message =
      `Found global Git identity:\n` +
      `  ${bold('Name:')}  ${userName}\n` +
      `  ${bold('Email:')} ${userEmail}\n` +
      `${question} Use this identity for the project?`;

    const { default: ConfirmPrompt } = await import('enquirer/lib/prompts/confirm.js');
    const useGlobal = await new (ConfirmPrompt as unknown as PromptConstructor)({
      message,
      initial: true,
      prefix: chalk.green('✔'),
    }).run();
    if (useGlobal) {
      return { gitUserName: userName, gitUserEmail: userEmail };
    }
  }

  // If the user refuses the global identity or if no global identity is found,
  // prompt for both user.name and user.email manually (with validation to prevent empty values)
  const { default: InputPrompt } = await import('enquirer/lib/prompts/input.js');
  userName = (await new (InputPrompt as unknown as PromptConstructor)({
    message: 'Git user.name (for commits):',
    initial: userName || '',
    validate: (input: string) => {
      if (input.trim() === '') return 'Name cannot be empty';
      // Optionally: disallow certain special characters
      if (/[^-\w\s.]/.test(input)) return 'Name contains invalid characters';
      return true;
    },
  }).run()) as string;
  userEmail = (await new (InputPrompt as unknown as PromptConstructor)({
    message: 'Git user.email (for commits):',
    initial: userEmail || '',
    validate: (input: string) => {
      if (input.trim() === '') return 'Email cannot be empty';
      // Use validator to validate email format
      if (!validator.isEmail(input)) return 'Invalid email format';
      return true;
    },
  }).run()) as string;
  return { gitUserName: userName, gitUserEmail: userEmail };
}
