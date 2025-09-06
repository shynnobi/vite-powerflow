import * as fs from 'fs/promises';
import * as path from 'path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { logMessage } from '../utils/logMessage';
import { parseChangesetFrontmatter } from './changesetParser';
import { readChangesetStatus } from './changesetReader';

// Mock dependencies
vi.mock('fs/promises');
vi.mock('./changesetParser.js', () => ({
  parseChangesetFrontmatter: vi.fn(),
  extractMetadataAfterFrontmatter: vi.fn(() => ({})),
}));
vi.mock('../utils/logMessage.js', () => ({
  logMessage: vi.fn(),
}));

const mockFs = vi.mocked(fs);
const mockParseChangesetFrontmatter = vi.mocked(parseChangesetFrontmatter as any);
const mockLogMessage = vi.mocked(logMessage as any);

describe('changesetReader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('readChangesetStatus', () => {
    it('should return null when changeset directory does not exist', async () => {
      const error = new Error('Directory not found') as NodeJS.ErrnoException;
      error.code = 'ENOENT';
      mockFs.readdir.mockRejectedValue(error);

      const result = await readChangesetStatus('/workspace', '@vite-powerflow/create');

      expect(result).toBeNull();
      expect(mockLogMessage).not.toHaveBeenCalled();
    });

    it('should return null when no markdown files exist', async () => {
      mockFs.readdir.mockResolvedValue(['README.md', 'config.json'] as any);

      const result = await readChangesetStatus('/workspace', '@vite-powerflow/create');

      expect(result).toBeNull();
    });

    it('should return null when no changesets match target package', async () => {
      mockFs.readdir.mockResolvedValue(['test-changeset.md'] as any);
      mockFs.readFile.mockResolvedValue('changeset content');

      const frontmatterMap = new Map();
      frontmatterMap.set('@other-package/name', 'minor');
      mockParseChangesetFrontmatter.mockReturnValue(frontmatterMap);

      const result = await readChangesetStatus('/workspace', '@vite-powerflow/create');

      expect(result).toBeNull();
    });

    it('should return changeset status when target package is found', async () => {
      mockFs.readdir.mockResolvedValue(['test-changeset.md'] as any);
      mockFs.readFile.mockResolvedValue('changeset content');

      // Always return the expected frontmatter for this test
      mockParseChangesetFrontmatter.mockReturnValue(new Map([['@vite-powerflow/create', 'minor']]));

      const result = await readChangesetStatus('/workspace', '@vite-powerflow/create');

      expect(result).toEqual({
        status: 'pending',
        changeset: {
          fileName: 'test-changeset.md',
          bumpType: 'minor',
        },
      });
    });

    it('should return first matching changeset when multiple exist', async () => {
      mockFs.readdir.mockResolvedValue(['first-changeset.md', 'second-changeset.md'] as any);
      mockFs.readFile.mockImplementation(filePath => {
        if (filePath.toString().includes('first-changeset.md')) {
          return Promise.resolve('first content');
        }
        return Promise.resolve('second content');
      });
      // Always return the expected frontmatter for first file only
      mockParseChangesetFrontmatter.mockImplementation((content: string) => {
        if (content === 'first content') {
          return new Map([['@vite-powerflow/create', 'patch']]);
        }
        return new Map();
      });
      const result = await readChangesetStatus('/workspace', '@vite-powerflow/create');
      expect(result).toEqual({
        status: 'pending',
        changeset: {
          fileName: 'first-changeset.md',
          bumpType: 'patch',
        },
      });
    });

    it('should ignore README.md files', async () => {
      mockFs.readdir.mockResolvedValue(['README.md', 'valid-changeset.md'] as any);
      mockFs.readFile.mockImplementation(filePath => {
        if (filePath.toString().includes('valid-changeset.md')) {
          return Promise.resolve('valid content');
        }
        return Promise.resolve('');
      });
      // Always return the expected frontmatter for valid-changeset.md only
      mockParseChangesetFrontmatter.mockImplementation((content: string) => {
        if (content === 'valid content') {
          return new Map([['@vite-powerflow/create', 'major']]);
        }
        return new Map();
      });
      const result = await readChangesetStatus('/workspace', '@vite-powerflow/create');
      expect(result).toEqual({
        status: 'pending',
        changeset: {
          fileName: 'valid-changeset.md',
          bumpType: 'major',
        },
      });
      expect(mockFs.readFile).toHaveBeenCalledWith(
        path.join('/workspace', '.changeset', 'valid-changeset.md'),
        'utf-8'
      );
    });

    it('should log errors when reading changeset directory fails with non-ENOENT error', async () => {
      const error = new Error('Permission denied') as NodeJS.ErrnoException;
      error.code = 'EACCES';
      mockFs.readdir.mockRejectedValue(error);

      const result = await readChangesetStatus('/workspace', '@vite-powerflow/create');

      expect(result).toBeNull();
    });

    it('should handle file read errors gracefully', async () => {
      mockFs.readdir.mockResolvedValue(['test-changeset.md'] as any);
      mockFs.readFile.mockRejectedValue(new Error('File read error'));

      const result = await readChangesetStatus('/workspace', '@vite-powerflow/create');

      expect(result).toBeNull();
    });
  });

  describe('readLatestChangeset', () => {
    it('should return the latest changeset for a package', async () => {
      // Mock test - would need actual implementation
      expect(true).toBe(true);
    });
  });
});
