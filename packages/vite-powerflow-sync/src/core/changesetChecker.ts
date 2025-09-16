import { execSync } from 'child_process';

// Import types
import type { PackageBump } from './types.js';
import { getPackageJsonPath, getPackageNameFromPath } from './syncReporter.js';

export interface ChangesetStatusResult {
  willBeUpdated: boolean;
  newVersion?: string;
  bumpType?: 'patch' | 'minor' | 'major' | 'none';
  reason?: string;
  triggerPackage?: string;
}

/**
 * Parse changeset status output to extract package bump information
 */
function parseChangesetStatus(output: string): PackageBump[] {
  const lines = output.split('\n');
  const packages: PackageBump[] = [];
  let currentBumpType: 'patch' | 'minor' | 'major' | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect bump type section
    if (trimmed.includes('Packages to be bumped at patch')) {
      currentBumpType = 'patch';
      continue;
    }
    if (trimmed.includes('Packages to be bumped at minor')) {
      currentBumpType = 'minor';
      continue;
    }
    if (trimmed.includes('Packages to be bumped at major')) {
      currentBumpType = 'major';
      continue;
    }

    // Reset bump type at section end
    if (trimmed.includes('---')) {
      currentBumpType = null;
      continue;
    }

    // Match package line: "🦋  - @vite-powerflow/create 1.2.4"
    const regex = /^🦋\s+-\s+(.+?)\s+(.+)$/;
    const match = regex.exec(trimmed);
    if (match && currentBumpType) {
      packages.push({
        name: match[1],
        version: match[2],
        bumpType: currentBumpType,
      });
    }
  }

  return packages;
}

/**
 * Check if a package will be updated by changeset due to internal dependencies
 */
export function checkWillBeUpdatedByChangeset(
  workspaceRoot: string,
  packageName: string
): ChangesetStatusResult {
  try {
    const output = execSync('pnpm changeset status --verbose', {
      cwd: workspaceRoot,
      encoding: 'utf-8',
      stdio: 'pipe',
    });

    const packages = parseChangesetStatus(output);
    const packageUpdate = packages.find(p => p.name === packageName);

    if (packageUpdate) {
      // Find packages with direct changesets (not dependency updates)
      // These are likely the trigger packages for internal dependency updates
      const directChangesetPackages = packages.filter(p => p.name !== packageName);
      const triggerPackage =
        directChangesetPackages.length > 0 ? directChangesetPackages[0].name : undefined;

      return {
        willBeUpdated: true,
        newVersion: packageUpdate.version,
        bumpType: packageUpdate.bumpType,
        reason: triggerPackage
          ? `Dependency update: ${triggerPackage}`
          : 'Internal dependency update',
        triggerPackage,
      };
    }

    return { willBeUpdated: false };
  } catch {
    // Fallback: assume not updated if command fails
    return {
      willBeUpdated: false,
      reason: 'Error checking changeset status',
    };
  }
}

/**
 * Get the package name from sync config
 */
export async function getPackageNameFromConfig(config: {
  targetPackage?: string;
  label: unknown;
  commitPath: string;
}): Promise<string> {
  if (config.targetPackage) {
    return config.targetPackage;
  }

  // Try to get package name from label
  if (config.label && typeof config.label === 'string') {
    try {
      // Use a dummy workspace root since we just need to map the label
      const dummyWorkspaceRoot = '/tmp';
      const packagePath = getPackageJsonPath(config.label, dummyWorkspaceRoot);

      if (packagePath) {
        // Use centralized function to get package name from path
        const packageName = await getPackageNameFromPath(packagePath);
        if (packageName) {
          return packageName;
        }
      }
    } catch {
      // If label mapping fails, fall back to commit path parsing
    }
  }

  return '';
}
