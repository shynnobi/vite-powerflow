import * as fs from 'fs/promises';
import inquirer from 'inquirer';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createProject } from './create.js';

vi.mock('fs/promises', () => ({
  __esModule: true,
  default: {
    writeFile: vi.fn(),
    mkdir: vi.fn(),
    access: vi.fn().mockRejectedValue(new Error('not found')),
    readFile: vi.fn().mockResolvedValue('{}'),
  },
}));

vi.mock('inquirer', () => ({
  __esModule: true,
  default: { prompt: vi.fn() },
}));

const gitMock = {
  init: vi.fn().mockResolvedValue(undefined),
  add: vi.fn().mockResolvedValue(undefined),
  commit: vi.fn().mockResolvedValue(undefined),
  addConfig: vi.fn().mockResolvedValue(undefined),
  raw: vi.fn(),
};

vi.mock('simple-git', () => ({
  __esModule: true,
  default: { simpleGit: () => gitMock },
  simpleGit: () => gitMock,
}));

vi.mock('fs-extra', () => ({
  __esModule: true,
  default: { copy: vi.fn().mockResolvedValue(undefined) },
}));

const mockedInquirer = inquirer as unknown as { prompt: ReturnType<typeof vi.fn> };
const mockedFs = fs as unknown as { default: Record<string, ReturnType<typeof vi.fn>> };

describe('createProject (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a project with default options', async () => {
    // Arrange: simulate all prompts with default values
    mockedInquirer.prompt
      .mockResolvedValueOnce({ projectName: 'my-vite-powerflow-app' })
      .mockResolvedValueOnce({
        description: 'A Vite PowerFlow project named my-vite-powerflow-app',
        author: '',
      })
      .mockResolvedValueOnce({ git: true })
      .mockResolvedValueOnce({ useGlobal: true });
    // Simulate git global identity
    gitMock.raw.mockResolvedValueOnce('John Doe\n').mockResolvedValueOnce('john@example.com\n');

    // Act
    await createProject({
      projectName: 'my-vite-powerflow-app',
      description: 'A Vite PowerFlow project named my-vite-powerflow-app',
      author: '',
      git: true,
      gitUserName: 'John Doe',
      gitUserEmail: 'john@example.com',
    });

    // Assert: check that files and folders are created
    expect(mockedFs.default.writeFile).toHaveBeenCalled();
  });
});
