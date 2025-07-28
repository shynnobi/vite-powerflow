import fs from 'fs-extra';
import { execSync } from 'node:child_process';
import os from 'os';
import path from 'path';
import { describe, expect, it } from 'vitest';

describe('CLI smoke test', () => {
  it('should pack, install, and run the CLI successfully', async () => {
    // Given: The CLI package is available for packaging
    const cliDir = path.resolve(__dirname, '../../');
    const tarball = execSync('npm pack --silent', { cwd: cliDir }).toString().trim();
    const tarballPath = path.join(cliDir, tarball);

    // Verify tarball exists before proceeding
    if (!fs.existsSync(tarballPath)) {
      throw new Error(`Tarball not found: ${tarballPath}`);
    }

    // When: The CLI is installed in a temporary project
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cli-smoke-'));
    execSync('npm init -y --silent', { cwd: tempDir });

    // Install the packed CLI tarball with retry logic (silent)
    try {
      execSync(`npm install ${tarballPath} --silent`, { cwd: tempDir });
    } catch (error) {
      // If installation fails, check if tarball still exists
      if (!fs.existsSync(tarballPath)) {
        throw new Error(`Tarball was deleted during test: ${tarballPath}`);
      }
      throw error;
    }

    // Then: The CLI should run successfully and display help
    const output = execSync('./node_modules/.bin/vite-powerflow-create --help', {
      cwd: tempDir,
    }).toString();
    expect(output).toMatch(/Usage:/); // Adjust this to match your CLI help output

    // Cleanup: remove temp directory and tarball
    fs.rmSync(tempDir, { recursive: true, force: true });
    if (fs.existsSync(tarballPath)) {
      fs.unlinkSync(tarballPath);
    }
  });
});
