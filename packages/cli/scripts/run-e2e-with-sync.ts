import { execa } from 'execa';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface BackupEntry {
  source: string;
  backup: string;
  existed: boolean;
}

const isVerbose = process.env.E2E_VERBOSE === 'true';

async function runStep(label: string, command: string, args: string[], cwd: string): Promise<void> {
  if (isVerbose) {
    await execa(command, args, {
      cwd,
      stdio: 'inherit',
    });
    return;
  }

  const result = await execa(command, args, {
    cwd,
    all: true,
    reject: false,
  });

  if (result.exitCode !== 0) {
    if (result.all) {
      console.error(result.all);
    }
    throw new Error(`${label} failed with exit code ${result.exitCode}`);
  }

  process.stdout.write(`\n[e2e-cli] ${label}: ok\n`);
}

async function backupPath(source: string, backupRoot: string): Promise<BackupEntry> {
  const existed = await fs.pathExists(source);
  const backup = path.join(backupRoot, path.basename(source));

  if (existed) {
    await fs.copy(source, backup);
  }

  return { source, backup, existed };
}

async function restorePath(entry: BackupEntry): Promise<void> {
  if (entry.existed) {
    await fs.remove(entry.source);
    await fs.copy(entry.backup, entry.source);
    return;
  }

  if (await fs.pathExists(entry.source)) {
    await fs.remove(entry.source);
  }
}

async function run(): Promise<void> {
  const repoRoot = path.resolve(__dirname, '..', '..', '..');
  const cliRoot = path.resolve(__dirname, '..');

  const templatePath = path.join(cliRoot, 'template');
  const distPath = path.join(cliRoot, 'dist');

  const backupRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'vite-powerflow-cli-e2e-'));
  const templateBackup = await backupPath(templatePath, backupRoot);
  const distBackup = await backupPath(distPath, backupRoot);

  try {
    await runStep('sync-template', 'pnpm', ['sync:starter-to-template'], repoRoot);

    await runStep(
      'build-cli',
      'pnpm',
      ['--filter', '@vite-powerflow/create', 'run', 'build'],
      repoRoot
    );

    await runStep('run-tests', 'pnpm', ['exec', 'vitest', 'run', '__tests__/e2e/'], cliRoot);
  } finally {
    await restorePath(templateBackup);
    await restorePath(distBackup);
    await fs.remove(backupRoot);
  }
}

run().catch(error => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});
