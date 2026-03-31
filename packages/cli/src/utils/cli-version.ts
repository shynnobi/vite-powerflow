import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

interface CliPackageJson {
  name?: string;
  version?: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getCliVersion(): string {
  const cliRoot = findCliRoot();
  const baseVersion = readBaseVersion();
  const localSuffix = isLocalExecutionContext() ? getLocalBuildSuffix(cliRoot) : '';
  return `${baseVersion}${localSuffix}`;
}

function isLocalExecutionContext(): boolean {
  return !__dirname.includes(`${path.sep}node_modules${path.sep}`);
}

function readBaseVersion(): string {
  try {
    const cliRoot = findCliRoot();
    if (!cliRoot) {
      return '0.0.0';
    }

    const packageJsonPath = path.join(cliRoot, 'package.json');
    const packageJson = fs.readFileSync(packageJsonPath, 'utf-8');
    const packageData = JSON.parse(packageJson) as CliPackageJson;
    return packageData.version ?? '0.0.0';
  } catch {
    return '0.0.0';
  }
}

function findCliRoot(): string | null {
  const candidates = [
    path.join(__dirname, '..'),
    path.join(__dirname, '..', '..'),
    path.join(__dirname, '..', '..', '..'),
  ];

  for (const candidate of candidates) {
    const packageJsonPath = path.join(candidate, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      continue;
    }

    try {
      const packageJson = fs.readFileSync(packageJsonPath, 'utf-8');
      const packageData = JSON.parse(packageJson) as CliPackageJson;
      if (packageData.name === '@vite-powerflow/create') {
        return candidate;
      }
    } catch {
      continue;
    }
  }

  return null;
}

function getLocalBuildSuffix(cliRoot: string | null): string {
  if (!cliRoot) {
    return '';
  }

  const gitRoot = path.join(cliRoot, '..', '..', '.git');

  if (!fs.existsSync(gitRoot)) {
    return '';
  }

  try {
    const shortSha = execSync('git rev-parse --short HEAD', {
      cwd: cliRoot,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();

    const dirty =
      execSync('git status --porcelain', {
        cwd: cliRoot,
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim().length > 0;

    if (shortSha.length === 0) {
      return '+local';
    }

    return dirty ? `+local.${shortSha}.dirty` : `+local.${shortSha}`;
  } catch {
    return '+local';
  }
}
