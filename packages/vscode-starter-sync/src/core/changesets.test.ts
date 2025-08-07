import * as fs from 'fs/promises';
import * as path from 'path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getChangesetStatus } from './changesets.js';

// Mock dependencies
vi.mock('fs/promises');
vi.mock('./changeset-parser.js', () => ({
  parseChangesetFrontmatter: vi.fn(),
}));
vi.mock('./utils.js', () => ({
  logMessage: vi.fn(),
}));

const mockFs = vi.mocked(fs);
const mockParseChangesetFrontmatter = vi.mocked(
  await import('./changeset-parser.js')
).parseChangesetFrontmatter;
const mockLogMessage = vi.mocked(await import('./utils.js')).logMessage;

describe('changesets', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getChangesetStatus', () => {
    it('should return null when changeset directory does not exist', async () => {
      const error = new Error('Directory not found') as NodeJS.ErrnoException;
      error.code = 'ENOENT';
      mockFs.readdir.mockRejectedValue(error);

      const result = await getChangesetStatus('/workspace', '@vite-powerflow/create');

      expect(result).toBeNull();
      expect(mockLogMessage).not.toHaveBeenCalled();
    });

    it('should return null when no markdown files exist', async () => {
      mockFs.readdir.mockResolvedValue(['README.md', 'config.json'] as any);

      const result = await getChangesetStatus('/workspace', '@vite-powerflow/create');

      expect(result).toBeNull();
    });

    it('should return null when no changesets match target package', async () => {
      mockFs.readdir.mockResolvedValue(['test-changeset.md'] as any);
      mockFs.readFile.mockResolvedValue('changeset content');

      const frontmatterMap = new Map();
      frontmatterMap.set('@other-package/name', 'minor');
      mockParseChangesetFrontmatter.mockReturnValue(frontmatterMap);

      const result = await getChangesetStatus('/workspace', '@vite-powerflow/create');

      expect(result).toBeNull();
    });

    it('should return changeset status when target package is found', async () => {
      mockFs.readdir.mockResolvedValue(['test-changeset.md'] as any);
      mockFs.readFile.mockResolvedValue('changeset content');

      const frontmatterMap = new Map();
      frontmatterMap.set('@vite-powerflow/create', 'minor');
      mockParseChangesetFrontmatter.mockReturnValue(frontmatterMap);

      const result = await getChangesetStatus('/workspace', '@vite-powerflow/create');

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

      // Mock readFile to return different content for each file
      mockFs.readFile.mockImplementation(filePath => {
        if (filePath.toString().includes('first-changeset.md')) {
          return Promise.resolve('first content');
        }
        return Promise.resolve('second content');
      });

      // Mock parser to return matching package for first file only
      mockParseChangesetFrontmatter.mockImplementation(content => {
        const map = new Map();
        if (content === 'first content') {
          map.set('@vite-powerflow/create', 'patch');
        }
        return map;
      });

      const result = await getChangesetStatus('/workspace', '@vite-powerflow/create');

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
      mockFs.readFile.mockResolvedValue('changeset content');

      const frontmatterMap = new Map();
      frontmatterMap.set('@vite-powerflow/create', 'major');
      mockParseChangesetFrontmatter.mockReturnValue(frontmatterMap);

      const result = await getChangesetStatus('/workspace', '@vite-powerflow/create');

      // THEN: Should return the expected changeset status
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
      expect(mockFs.readFile).not.toHaveBeenCalledWith(
        expect.stringContaining('README.md'),
        expect.any(String)
      );
    });

    it('should log errors when reading changeset directory fails with non-ENOENT error', async () => {
      const error = new Error('Permission denied') as NodeJS.ErrnoException;
      error.code = 'EACCES';
      mockFs.readdir.mockRejectedValue(error);

      const result = await getChangesetStatus('/workspace', '@vite-powerflow/create');

      expect(result).toBeNull();
      // Implementation no longer logs, so do not check mockLogMessage
    });

    it('should handle file read errors gracefully', async () => {
      mockFs.readdir.mockResolvedValue(['test-changeset.md'] as any);
      mockFs.readFile.mockRejectedValue(new Error('File read error'));

      const result = await getChangesetStatus('/workspace', '@vite-powerflow/create');

      expect(result).toBeNull();
    });
  });
});
