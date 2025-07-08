import inquirer from 'inquirer';
import * as simpleGitModule from 'simple-git';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as promptUi from './prompt-ui.js';
import { validateProjectName } from './validation.js';

vi.mock('inquirer', () => ({
  default: {
    prompt: vi.fn(),
  },
}));
vi.mock('fs/promises', () => ({
  default: {
    access: vi.fn(),
  },
}));
vi.mock('simple-git', () => ({
  simpleGit: () => ({
    raw: vi.fn(),
  }),
}));

describe('prompt-ui', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('promptProjectName returns the project name from prompt', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValue({ projectName: 'my-app' });
    const name = await promptUi.promptProjectName();
    expect(name).toBe('my-app');
  });

  it('promptProjectName returns the default name if user presses Enter', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValue({ projectName: 'my-vite-powerflow-app' });
    const name = await promptUi.promptProjectName();
    expect(name).toBe('my-vite-powerflow-app');
  });

  it('validateProjectName rejects an empty input', () => {
    expect(validateProjectName('')).not.toBe(true);
  });

  it('promptProjectInfo returns description and author', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValue({ description: 'desc', author: 'me' });
    const info = await promptUi.promptProjectInfo('my-app');
    expect(info).toEqual({ description: 'desc', author: 'me' });
  });

  it('promptProjectInfo returns description and empty author', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValue({ description: 'desc', author: '' });
    const info = await promptUi.promptProjectInfo('my-app');
    expect(info).toEqual({ description: 'desc', author: '' });
  });

  it('promptProjectInfo returns default description if left empty', async () => {
    const projectName = 'my-app';
    vi.mocked(inquirer.prompt).mockResolvedValue({ description: `A Vite PowerFlow project named ${projectName}`, author: 'me' });
    const info = await promptUi.promptProjectInfo(projectName);
    expect(info.description).toBe(`A Vite PowerFlow project named ${projectName}`);
    expect(info.author).toBe('me');
  });

  it('promptGit returns true when the user accepts git initialization', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValue({ git: true });
    const result = await promptUi.promptGit();
    expect(result).toEqual({ git: true });
  });

  it('promptGit returns false when the user declines git initialization', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValue({ git: false });
    const result = await promptUi.promptGit();
    expect(result).toEqual({ git: false });
  });

  it('promptGit returns true when the user presses Enter', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValue({ git: true });
    const result = await promptUi.promptGit();
    expect(result).toEqual({ git: true });
  });

  it('promptGitIdentity uses global identity if available and user accepts', async () => {
    const gitMock = { raw: vi.fn() };
    vi.spyOn(simpleGitModule, 'simpleGit').mockReturnValue(gitMock as never);
    gitMock.raw
      .mockResolvedValueOnce('John Doe\n')
      .mockResolvedValueOnce('john@example.com\n');
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({ useGlobal: true });
    const identity = await promptUi.promptGitIdentity();
    expect(identity).toEqual({ gitUserName: 'John Doe', gitUserEmail: 'john@example.com' });
  });

  it('promptGitIdentity handles user refusing global identity', async () => {
    const gitMock = { raw: vi.fn() };
    vi.spyOn(simpleGitModule, 'simpleGit').mockReturnValue(gitMock as never);
    gitMock.raw
      .mockResolvedValueOnce('John Doe\n')
      .mockResolvedValueOnce('john@example.com\n');
    vi.mocked(inquirer.prompt)
      .mockResolvedValueOnce({ useGlobal: false })
      .mockResolvedValueOnce({ gitUserName: 'Other', gitUserEmail: 'other@x.com' });
    const identity = await promptUi.promptGitIdentity();
    expect(identity).toEqual({ gitUserName: 'Other', gitUserEmail: 'other@x.com' });
  });

  it('promptGitIdentity handles errors from simple-git', async () => {
    const gitMock = { raw: vi.fn() };
    vi.spyOn(simpleGitModule, 'simpleGit').mockReturnValue(gitMock as never);
    gitMock.raw.mockRejectedValue(new Error('git error'));
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({ gitUserName: 'X', gitUserEmail: 'x@y.com' });
    const identity = await promptUi.promptGitIdentity();
    expect(identity).toEqual({ gitUserName: 'X', gitUserEmail: 'x@y.com' });
  });

  it('promptGitIdentity prompts for identity if global not used', async () => {
    const gitMock = { raw: vi.fn() };
    vi.spyOn(simpleGitModule, 'simpleGit').mockReturnValue(gitMock as never);
    gitMock.raw.mockRejectedValue(new Error('not set'));
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({ gitUserName: 'Jane', gitUserEmail: 'jane@x.com' });
    const identity = await promptUi.promptGitIdentity();
    expect(identity).toEqual({ gitUserName: 'Jane', gitUserEmail: 'jane@x.com' });
  });
});
