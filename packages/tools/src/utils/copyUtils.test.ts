import fs from 'fs-extra';
import path from 'path';
import tmp from 'tmp-promise';
import { describe, expect, it } from 'vitest';

import { copyConfigFile, copyConfigFolder } from '../utils/copyUtils.js';

describe('copyConfigFile', () => {
  it('copies a config file and preserves content', async () => {
    const { path: tempDir, cleanup } = await tmp.dir({ unsafeCleanup: true });

    // Create a test source file
    const sourceFile = path.join(tempDir, 'test.txt');
    const testContent = 'Hello, this is test content!';
    await fs.writeFile(sourceFile, testContent);

    const destFile = path.join(tempDir, 'test-copy.txt');

    // Test copying
    await copyConfigFile(sourceFile, destFile);

    // Verify file was copied correctly
    expect(await fs.pathExists(destFile)).toBe(true);
    const copiedContent = await fs.readFile(destFile, 'utf8');
    expect(copiedContent).toBe(testContent);

    await cleanup();
  });

  it('copies a config file with transform function', async () => {
    const { path: tempDir, cleanup } = await tmp.dir({ unsafeCleanup: true });

    // Create a test source file
    const sourceFile = path.join(tempDir, 'test.txt');
    const testContent = 'Hello, this is test content!';
    await fs.writeFile(sourceFile, testContent);

    const destFile = path.join(tempDir, 'test-transformed.txt');

    // Test copying with transform
    await copyConfigFile(sourceFile, destFile, {
      transform: content => content.toUpperCase(),
    });

    // Verify file was copied and transformed
    expect(await fs.pathExists(destFile)).toBe(true);
    const copiedContent = await fs.readFile(destFile, 'utf8');
    expect(copiedContent).toBe(testContent.toUpperCase());

    await cleanup();
  });
});

describe('copyConfigFolder', () => {
  it('copies a config folder with optional ignore patterns', async () => {
    const { path: tempDir, cleanup } = await tmp.dir({ unsafeCleanup: true });

    // Create a test source folder with some files
    const sourceFolder = path.join(tempDir, 'source');
    await fs.ensureDir(sourceFolder);
    await fs.writeFile(path.join(sourceFolder, 'file1.txt'), 'content1');
    await fs.writeFile(path.join(sourceFolder, 'file2.txt'), 'content2');
    await fs.writeFile(path.join(sourceFolder, 'ignore.txt'), 'ignore me');

    const destFolder = path.join(tempDir, 'dest');

    // Test copying with ignore pattern
    await copyConfigFolder(sourceFolder, destFolder, {
      ignore: ['ignore.txt'],
    });

    // Verify files were copied correctly
    expect(await fs.pathExists(path.join(destFolder, 'file1.txt'))).toBe(true);
    expect(await fs.pathExists(path.join(destFolder, 'file2.txt'))).toBe(true);
    expect(await fs.pathExists(path.join(destFolder, 'ignore.txt'))).toBe(false);

    await cleanup();
  });
});
