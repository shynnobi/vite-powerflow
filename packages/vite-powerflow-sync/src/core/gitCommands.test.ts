import { execSync as execSyncRaw } from 'child_process';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import { getCommitsSince, getCurrentCommit, getFilesChangedSince } from './gitCommands.js';

vi.mock('child_process', () => ({
  execSync: vi.fn(),
}));

const execSync = execSyncRaw as unknown as Mock;

describe('gitCommands', () => {
  const mockExec = vi.fn();
  const mockOutputChannel = { appendLine: vi.fn() };
  const workspaceRoot = '/fake/path';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('getCurrentCommit returns trimmed commit hash', () => {
    mockExec.mockReturnValue('abc123\n');
    const result = getCurrentCommit(workspaceRoot, mockExec);
    expect(result).toBe('abc123');
    expect(mockExec).toHaveBeenCalledWith(
      'git rev-parse HEAD',
      expect.objectContaining({ cwd: workspaceRoot })
    );
  });

  it('getCommitsSince returns commit lines', () => {
    const commits = 'abc123 first\ndef456 second';
    execSync.mockImplementationOnce(() => undefined); // cat-file -e
    execSync.mockImplementationOnce(() => commits); // git log
    const result = getCommitsSince(workspaceRoot, 'base', 'head', 'src/', mockOutputChannel);
    expect(result).toEqual(['abc123 first', 'def456 second']);
  });

  it('getCommitsSince throws if base ref not found', () => {
    execSync.mockImplementationOnce(() => {
      throw new Error('not found');
    });
    expect(() =>
      getCommitsSince(workspaceRoot, 'badref', 'head', 'src/', mockOutputChannel)
    ).toThrow();
    expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(expect.stringContaining('badref'));
  });

  it('getCommitsSince falls back to diff if log fails', () => {
    execSync.mockImplementationOnce(() => undefined); // cat-file -e
    execSync.mockImplementationOnce(() => {
      throw new Error('log fail');
    });
    execSync.mockImplementationOnce(() => {
      throw new Error('diff fail');
    });
    const result = getCommitsSince(workspaceRoot, 'base', 'head', 'src/', mockOutputChannel);
    expect(result[0]).toMatch(/Changes detected/);
  });

  it('getFilesChangedSince returns file list', () => {
    execSync.mockImplementationOnce(() => undefined); // cat-file -e
    execSync.mockImplementationOnce(() => 'src/file1.js\nsrc/file2.js');
    const result = getFilesChangedSince(workspaceRoot, 'base', 'src/', mockOutputChannel);
    expect(result).toEqual(['src/file1.js', 'src/file2.js']);
  });

  it('getFilesChangedSince handles not found ref gracefully', () => {
    execSync.mockReset();
    execSync.mockImplementation(() => {
      throw new Error('not found');
    });
    const result = getFilesChangedSince(workspaceRoot, 'badref', 'src/', mockOutputChannel);
    expect(result).toEqual([]);
    expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(expect.stringContaining('badref'));
  });
});
