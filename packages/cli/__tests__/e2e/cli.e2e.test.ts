import { execa, execaCommandSync } from 'execa';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { describe, expect, it } from 'vitest';

// Helper: Wait for a file or directory to exist (polling)
async function waitForPath(targetPath: string, timeout = 20000) {
  const start = Date.now();
  const isVerbose = process.env.E2E_VERBOSE === 'true';

  if (isVerbose) console.log(`Waiting for path to exist: ${targetPath}`);
  let attempts = 0;

  while (!fs.existsSync(targetPath)) {
    attempts++;
    if (isVerbose && attempts % 10 === 0) {
      console.log(`Still waiting for ${targetPath}... (${Date.now() - start}ms elapsed)`);
    }

    if (Date.now() - start > timeout) {
      console.log(`Timeout reached after ${Date.now() - start}ms`);
      if (fs.existsSync(path.dirname(targetPath))) {
        console.log(`Parent directory contents:`, fs.readdirSync(path.dirname(targetPath)));
      }
      throw new Error(`Timeout: ${targetPath} was not created in time`);
    }
    await new Promise(r => setTimeout(r, 100));
  }
  if (isVerbose) console.log(`Path found after ${Date.now() - start}ms: ${targetPath}`);
}

describe('CLI E2E: project generation (non-interactive)', () => {
  it('should generate a starter project with all key files', async () => {
    // Given: The CLI package is available and a temporary environment is set up
    const cliDir = path.resolve(__dirname, '../../');
    const tarball = execaCommandSync('npm pack --silent', { cwd: cliDir }).stdout.trim();
    const tarballPath = path.join(cliDir, tarball);

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cli-e2e-'));
    execaCommandSync('npm init -y --silent', { cwd: tempDir });
    execaCommandSync(`npm install ${tarballPath} --silent`, { cwd: tempDir });

    // When: The CLI is executed with all required arguments to generate a project
    let result;
    let projectPath = path.join(tempDir, 'my-app');
    try {
      result = await execa(
        path.join(tempDir, 'node_modules', '.bin', 'vite-powerflow-create'),
        [
          'my-app',
          '--git',
          '--git-user-name',
          'Test User',
          '--git-user-email',
          'test@example.com',
          '--use-global-git',
        ],
        {
          cwd: tempDir,
          shell: false,
          reject: false,
          env: { ...process.env, FORCE_COLOR: '0' },
          timeout: 60000, // 1 min max for CLI
        }
      );
      // Log only on error
      if (result.exitCode !== 0) {
        console.log('CLI stdout:', result.stdout);
        console.log('CLI stderr:', result.stderr);
        console.log('CLI exitCode:', result.exitCode);
      }
    } catch (e: any) {
      // On error, log everything and list temp dir contents
      if (e.stdout) console.log('CLI stdout:', e.stdout);
      if (e.stderr) console.log('CLI stderr:', e.stderr);
      if (e.exitCode !== undefined) console.log('CLI exitCode:', e.exitCode);
      if (fs.existsSync(tempDir)) {
        console.log('Temp dir contents:', fs.readdirSync(tempDir));
      }
      throw e;
    }

    // Wait for the project directory to be created
    await waitForPath(projectPath, 20000); // Increase timeout to 20 seconds

    // List temp dir contents only on error
    if (!fs.existsSync(projectPath)) {
      console.log('Temp dir contents after CLI:', fs.readdirSync(tempDir));
    }

    // Then: The project should be generated with all required files
    expect(fs.existsSync(projectPath)).toBe(true);
    expect(fs.existsSync(path.join(projectPath, 'package.json'))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, 'README.md'))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, 'tsconfig.json'))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, '.devcontainer', 'devcontainer.json'))).toBe(true);

    // Cleanup
    fs.rmSync(tempDir, { recursive: true, force: true });
    if (fs.existsSync(tarballPath)) {
      fs.unlinkSync(tarballPath);
    }
  }, 30000);
});
