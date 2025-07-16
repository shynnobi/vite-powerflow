import fs from 'fs-extra';
import path from 'path';
import tmp from 'tmp-promise';
import { describe, expect, it } from 'vitest';

import { copyConfigFile, copyConfigFolder } from './copyUtils';

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
});

describe('copyConfigFolder', () => {
  it('copies a config folder and preserves structure', async () => {
    const { path: tempDir, cleanup } = await tmp.dir({ unsafeCleanup: true });
    const sourceDir = path.join(tempDir, 'source');
    const destDir = path.join(tempDir, 'dest');

    await fs.mkdirp(sourceDir);
    await fs.writeFile(path.join(sourceDir, 'a.txt'), 'A');
    await fs.writeFile(path.join(sourceDir, 'b.txt'), 'B');

    await copyConfigFolder(sourceDir, destDir);

    expect(await fs.pathExists(path.join(destDir, 'a.txt'))).toBe(true);
    expect(await fs.pathExists(path.join(destDir, 'b.txt'))).toBe(true);

    await cleanup();
  });

  it('copies a config folder with ignore option', async () => {
    const { path: tempDir, cleanup } = await tmp.dir({ unsafeCleanup: true });
    const sourceDir = path.join(tempDir, 'source');
    const destDir = path.join(tempDir, 'dest');

    await fs.mkdirp(sourceDir);
    await fs.writeFile(path.join(sourceDir, 'a.txt'), 'A');
    await fs.writeFile(path.join(sourceDir, 'b.txt'), 'B');
    await fs.writeFile(path.join(sourceDir, 'ignore.me'), 'X');

    await copyConfigFolder(sourceDir, destDir, { ignore: ['ignore.me'] });

    expect(await fs.pathExists(path.join(destDir, 'a.txt'))).toBe(true);
    expect(await fs.pathExists(path.join(destDir, 'b.txt'))).toBe(true);
    expect(await fs.pathExists(path.join(destDir, 'ignore.me'))).toBe(false);

    await cleanup();
  });
});
