#!/usr/bin/env tsx

import { execSync } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Standard package.json structure used by scripts
 */
interface PackageJson {
  name?: string;
  version?: string;
  private?: boolean;
  author?: string | { name: string; email?: string; url?: string };
  syncConfig?: {
    baseline: string;
    label: string;
    monitored: boolean;
    updatedAt?: string;
  };
  [key: string]: unknown;
}
import { logRootError, logRootInfo, logRootSuccess } from './monorepo-logger';

/**
 * Updates syncConfig.baseline in all monitored packages after a release
 * This ensures the sync monitoring system tracks from the correct commit
 */
async function updateBaselinesAfterRelease(workspaceRoot: string): Promise<void> {
  logRootInfo('🔄 Updating baselines after release...');

  try {
    // Get current commit (should be the release commit)
    const currentCommit = execSync('git rev-parse HEAD', {
      encoding: 'utf-8',
      cwd: workspaceRoot,
    }).trim();

    logRootInfo(`📍 Using release commit as baseline: ${currentCommit.substring(0, 7)}`);

    // Find all package.json files with syncConfig
    const packageJsonPaths = await findPackageJsonWithSyncConfig(workspaceRoot);

    let updatedCount = 0;

    for (const packageJsonPath of packageJsonPaths) {
      try {
        const fullPath = path.join(workspaceRoot, packageJsonPath);
        const packageJson = JSON.parse(await fs.readFile(fullPath, 'utf-8')) as PackageJson;

        // Check if syncConfig exists and has monitored: true
        if (packageJson.syncConfig?.monitored === true) {
          const oldBaseline = packageJson.syncConfig.baseline;

          // Update baseline to current release commit
          packageJson.syncConfig.baseline = currentCommit;

          // Write back to file
          await fs.writeFile(fullPath, JSON.stringify(packageJson, null, 2), 'utf-8');

          const packageName = packageJson.name ?? path.basename(path.dirname(packageJsonPath));
          const oldBaselineShort = oldBaseline?.substring(0, 7) ?? 'none';
          logRootInfo(
            `✅ Updated ${packageName}: ${oldBaselineShort} → ${currentCommit.substring(0, 7)}`
          );
          updatedCount++;
        }
      } catch (error) {
        logRootError(`❌ Failed to update ${packageJsonPath}: ${error}`);
      }
    }

    if (updatedCount > 0) {
      logRootSuccess(`🎉 Successfully updated ${updatedCount} package baselines`);

      // Commit the baseline updates
      try {
        execSync('git add packages/*/package.json apps/*/package.json', { cwd: workspaceRoot });
        execSync(
          `git commit -m "chore: update package baselines to release commit ${currentCommit.substring(0, 7)}"`,
          {
            cwd: workspaceRoot,
          }
        );
        logRootSuccess('📝 Committed baseline updates');
      } catch (gitError) {
        logRootError(`⚠️ Failed to commit baseline updates: ${gitError}`);
      }
    } else {
      logRootInfo('ℹ️ No monitored packages found to update');
    }
  } catch (error) {
    logRootError(`❌ Failed to update baselines: ${error}`);
    process.exit(1);
  }
}

/**
 * Find all package.json files that have syncConfig.monitored = true
 */
async function findPackageJsonWithSyncConfig(workspaceRoot: string): Promise<string[]> {
  const packageJsonPaths: string[] = [];

  // Scan packages and apps directories
  const scanDirs = ['packages', 'apps'];

  for (const scanDir of scanDirs) {
    const scanPath = path.join(workspaceRoot, scanDir);

    try {
      if (
        !(await fs
          .access(scanPath)
          .then(() => true)
          .catch(() => false))
      ) {
        continue;
      }

      const items = await fs.readdir(scanPath);

      for (const item of items) {
        const itemPath = path.join(scanPath, item);
        const stat = await fs.stat(itemPath);

        if (stat.isDirectory()) {
          const packageJsonPath = path.join(itemPath, 'package.json');

          try {
            const packageJson = JSON.parse(
              await fs.readFile(packageJsonPath, 'utf-8')
            ) as PackageJson;

            if (packageJson.syncConfig?.monitored === true) {
              const relativePath = path.relative(workspaceRoot, packageJsonPath);
              packageJsonPaths.push(relativePath);
            }
          } catch {
            // Skip files that can't be read or parsed
          }
        }
      }
    } catch (error) {
      logRootError(`⚠️ Error scanning ${scanDir}/: ${error}`);
    }
  }

  return packageJsonPaths;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const workspaceRoot = path.resolve(process.cwd());
  void updateBaselinesAfterRelease(workspaceRoot);
}

export { updateBaselinesAfterRelease };
