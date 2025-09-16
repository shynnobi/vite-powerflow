import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Import types
import type { SyncConfig } from './types.js';

export function resolveRefToSha(
  workspaceRoot: string,
  ref: string,
  outputChannel: { appendLine: (_value: string) => void }
): string | undefined {
  const tryResolve = (): string | undefined => {
    try {
      const sha = execSync(`git rev-list -n 1 ${ref}`, {
        encoding: 'utf-8',
        cwd: workspaceRoot,
        stdio: 'pipe',
      }).trim();
      return sha || undefined;
    } catch {
      return undefined;
    }
  };

  let sha = tryResolve();
  if (sha) return sha;

  try {
    execSync('git fetch --tags', { cwd: workspaceRoot, stdio: 'ignore' });
  } catch {
    outputChannel.appendLine('ℹ️ Failed to fetch tags while resolving ref to SHA.');
  }

  sha = tryResolve();
  if (!sha) {
    outputChannel.appendLine(`ℹ️ Could not resolve ref "${ref}" to a SHA. Will fallback to ref.`);
  }
  return sha;
}

/**
 * Generic function to read syncConfig from any package.json
 */
export function readSyncConfig(
  packageJsonPath: string,
  outputChannel: { appendLine: (_value: string) => void },
  _debugMode = false
): SyncConfig | null {
  try {
    const content = fs.readFileSync(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(content) as {
      syncConfig?: SyncConfig;
    };

    if (packageJson.syncConfig) {
      if (_debugMode) {
        outputChannel.appendLine(`ℹ️ Found syncConfig in ${packageJsonPath}`);
      }
      return packageJson.syncConfig;
    }

    if (_debugMode) {
      outputChannel.appendLine(`⚠️ No syncConfig found in ${packageJsonPath}`);
    }
    return null;
  } catch (error: unknown) {
    const message = (error as Error).message || String(error);
    outputChannel.appendLine(`❌ Error reading ${packageJsonPath}: ${message}`);
    return null;
  }
}

/**
 * Generic function to get baseline from any package.json using syncConfig property
 */
export function getPackageBaseline(
  workspaceRoot: string,
  packageJsonPath: string,
  packageName: string,
  outputChannel: { appendLine: (_value: string) => void }
): string {
  const syncConfig = readSyncConfig(packageJsonPath, outputChannel);
  if (syncConfig?.baseline) {
    outputChannel.appendLine(`ℹ️ Using baseline from ${packageName}: ${syncConfig.baseline}`);
    return syncConfig.baseline;
  }

  outputChannel.appendLine(`⚠️ No baseline found in ${packageName} syncConfig`);
  return 'unknown';
}

/**
 * Auto-discover all packages with syncConfig in their package.json
 * This is now the single source of truth for package configuration
 */
export function discoverMonitoredPackages(
  workspaceRoot: string,
  outputChannel: { appendLine: (_value: string) => void }
): { pkgPath: string; syncConfig: SyncConfig }[] {
  const monitoredPackages: { pkgPath: string; syncConfig: SyncConfig }[] = [];

  // Auto-discover all package.json files in apps/ and packages/
  const discoveredPaths = findAllPackageJsonFiles(workspaceRoot, outputChannel);

  for (const relativePath of discoveredPaths) {
    const fullPath = path.join(workspaceRoot, relativePath);
    try {
      const syncConfig = readSyncConfig(fullPath, outputChannel);
      if (syncConfig?.monitored) {
        monitoredPackages.push({
          pkgPath: relativePath,
          syncConfig,
        });
      }
    } catch (error) {
      // Skip packages that can't be read
      const errorMessage = error instanceof Error ? error.message : String(error);
      outputChannel.appendLine(`⚠️ Could not read ${relativePath}: ${errorMessage}`);
    }
  }

  return monitoredPackages;
}

/**
 * Find all package.json files in apps/ and packages/ directories
 */
function findAllPackageJsonFiles(
  workspaceRoot: string,
  outputChannel: { appendLine: (_value: string) => void }
): string[] {
  const packageJsonPaths: string[] = [];

  // Directories to scan
  const scanDirs = ['apps', 'packages'];

  for (const scanDir of scanDirs) {
    const scanPath = path.join(workspaceRoot, scanDir);

    try {
      if (!fs.existsSync(scanPath)) {
        outputChannel.appendLine(`⚠️ Directory ${scanDir}/ does not exist, skipping`);
        continue;
      }

      const items = fs.readdirSync(scanPath);

      for (const item of items) {
        const itemPath = path.join(scanPath, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
          // Check if this directory contains a package.json
          const packageJsonPath = path.join(itemPath, 'package.json');
          if (fs.existsSync(packageJsonPath)) {
            // Convert to relative path from workspace root
            const relativePath = path.relative(workspaceRoot, packageJsonPath);
            packageJsonPaths.push(relativePath);
          }
        }
      }
    } catch (error) {
      outputChannel.appendLine(`⚠️ Error scanning ${scanDir}/: ${error}`);
    }
  }

  return packageJsonPaths;
}

/**
 * Get all sync configurations directly from package.json files
 * This replaces the need for monitoredPackages.ts entirely
 */
export function getAllSyncConfigs(
  workspaceRoot: string,
  outputChannel: { appendLine: (_value: string) => void }
): SyncConfig[] {
  const packages = discoverMonitoredPackages(workspaceRoot, outputChannel);
  return packages.map(pkg => pkg.syncConfig);
}
