import { beforeEach, describe, expect, it, vi } from 'vitest';

import { promptGitIdentity } from './prompt-ui.js';

// Mock simple-git for unit tests
vi.mock('simple-git', () => {
  return {
    simpleGit: () => ({
      raw: vi.fn(),
    }),
  };
});

// Mock enquirer prompts for all unit tests to avoid interactive input
vi.mock('enquirer/lib/prompts/input.js', () => {
  return {
    __esModule: true,
    default: vi.fn().mockImplementation(() => ({
      run: vi.fn().mockResolvedValue('mocked-input'),
    })),
  };
});
vi.mock('enquirer/lib/prompts/confirm.js', () => {
  return {
    __esModule: true,
    default: vi.fn().mockImplementation(() => ({
      run: vi.fn().mockResolvedValue(true),
    })),
  };
});

const { simpleGit } = await import('simple-git');

// Unit tests for promptGitIdentity

describe('promptGitIdentity (unit)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return mocked input if global identity not found and no input provided', async () => {
    // Arrange: mock no global git config
    (simpleGit().raw as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('not found'));
    // Act
    const result = await promptGitIdentity(undefined, undefined, false);
    // Assert: should return mocked input for both name and email
    expect(result).toEqual({ gitUserName: 'mocked-input', gitUserEmail: 'mocked-input' });
  });

  it('should return provided identity if both gitUserName and gitUserEmail are given', async () => {
    // Act
    const result = await promptGitIdentity('Jane', 'jane@example.com', false);
    // Assert
    expect(result).toEqual({ gitUserName: 'Jane', gitUserEmail: 'jane@example.com' });
  });
});

// All interactive E2E CLI tests have been removed. Only non-interactive or unit tests should remain in this file.
