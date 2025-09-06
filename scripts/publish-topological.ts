#!/usr/bin/env tsx

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Represents a package that needs to be published with its metadata
 * @interface PackageInfo
 */
interface PackageInfo {
  /** The package name (e.g., "@vite-powerflow/utils") */
  name: string;
  /** The version to be published (e.g., "0.0.4") */
  version: string;
  /** Runtime dependencies */
  dependencies: Record<string, string>;
  /** Development dependencies */
  devDependencies: Record<string, string>;
  /** Absolute path to the package.json file */
  path: string;
}

/**
 * Get topological order of packages for publishing using depth-first search
 * Dependencies are published before dependents to avoid resolution errors
 *
 * @param packages - Array of packages to be published
 * @returns Array of packages in topological order (dependencies first)
 * @throws {Error} If circular dependencies are detected
 */
function getTopologicalOrder(packages: PackageInfo[]): PackageInfo[] {
  const visited = new Set<string>();
  const visiting = new Set<string>();
  const result: PackageInfo[] = [];

  /**
   * Recursively visit packages and their dependencies using DFS
   * @param pkg - Package to visit
   */
  function visit(pkg: PackageInfo) {
    if (visiting.has(pkg.name)) {
      throw new Error(`Circular dependency detected involving ${pkg.name}`);
    }
    if (visited.has(pkg.name)) {
      return;
    }

    visiting.add(pkg.name);

    // Visit dependencies first
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
    for (const [depName, depVersion] of Object.entries(allDeps)) {
      // Only consider internal dependencies (workspace or @vite-powerflow)
      if (depName.startsWith('@vite-powerflow/') || depVersion.startsWith('workspace:')) {
        const depPkg = packages.find(p => p.name === depName);
        if (depPkg) {
          visit(depPkg);
        }
      }
    }

    visiting.delete(pkg.name);
    visited.add(pkg.name);
    result.push(pkg);
  }

  // Visit all packages
  for (const pkg of packages) {
    if (!visited.has(pkg.name)) {
      visit(pkg);
    }
  }

  return result;
}

/**
 * Parse changeset status output to extract packages that will be published
 * Parses the verbose output from `pnpm changeset status --verbose` to extract
 * package names and their future versions
 * Filters out private packages (not published to npm)
 *
 * @returns Array of packages that will be published to npm with their metadata
 * @throws {Error} If changeset command fails or output cannot be parsed
 */
function parseChangesetPackages(): PackageInfo[] {
  try {
    // Get packages from changeset status
    const changesetOutput = execSync('pnpm changeset status --verbose', {
      encoding: 'utf-8',
      cwd: process.cwd(),
    });

    const packages: PackageInfo[] = [];
    const processedPackages = new Set<string>();
    const outputLines = changesetOutput.split('\n');

    for (const line of outputLines) {
      // Parse lines like "🦋  - @vite-powerflow/utils 0.0.4"
      const match = /^🦋\s+-\s+(\S+)\s+(\S+)$/.exec(line);
      if (match) {
        const [, packageName, version] = match;

        // Skip if we've already processed this package
        if (processedPackages.has(packageName)) {
          continue;
        }
        processedPackages.add(packageName);

        // Find package.json for this package
        const packageJsonPath = findPackageJson(packageName);
        if (packageJsonPath) {
          const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as {
            name: string;
            private?: boolean;
            dependencies?: Record<string, string>;
            devDependencies?: Record<string, string>;
          };

          // Filter out private packages (not published to npm)
          if (packageJson.private === true) {
            console.log(`⚠️  Skipping ${packageName} - private package (not published to npm)`);
            continue;
          }

          packages.push({
            name: packageJson.name,
            version: version, // Use the future version from changeset, not current
            dependencies: packageJson.dependencies ?? {},
            devDependencies: packageJson.devDependencies ?? {},
            path: packageJsonPath,
          });
        }
      }
    }

    return packages;
  } catch (error) {
    console.error('Error getting packages to publish:', error);
    return [];
  }
}

/**
 * Find the package.json file path for a given package name
 * Searches in common locations: packages/, apps/, and special cases
 *
 * @param packageName - The package name to find (e.g., "@vite-powerflow/create")
 * @returns Absolute path to package.json or null if not found
 */
function findPackageJson(packageName: string): string | null {
  const possiblePaths = [
    `packages/cli/package.json`, // Special case for @vite-powerflow/create (check first)
    `packages/${packageName.replace('@vite-powerflow/', '')}/package.json`,
    `apps/${packageName.replace('@vite-powerflow/', '')}/package.json`,
  ];

  for (const path of possiblePaths) {
    try {
      const fullPath = join(process.cwd(), path);
      const packageJson = JSON.parse(readFileSync(fullPath, 'utf-8')) as {
        name: string;
      };
      // Check if the package name matches
      if (packageJson.name === packageName) {
        return fullPath;
      }
    } catch {
      // Continue to next path
    }
  }

  return null;
}

/**
 * Publish a single package
 */
function publishPackage(pkg: PackageInfo): void {
  const packageDir = pkg.path.replace('/package.json', '');
  console.log(`📤 Publishing ${pkg.name}@${pkg.version}...`);

  try {
    execSync('npm publish', {
      cwd: packageDir,
      stdio: 'inherit',
    });
    console.log(`✅ Successfully published ${pkg.name}@${pkg.version}`);
  } catch (error) {
    console.error(`❌ Failed to publish ${pkg.name}@${pkg.version}:`, error);
    throw error;
  }
}

/**
 * Check if a package has internal dependencies
 */
function hasInternalDependencies(pkg: PackageInfo): boolean {
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
  return Object.entries(allDeps).some(
    ([depName, depVersion]) =>
      depName.startsWith('@vite-powerflow/') || depVersion.startsWith('workspace:')
  );
}

/**
 * Get packages and calculate publishing order (shared logic)
 */
function getPackagesAndOrder() {
  console.log('🔍 Getting packages to publish...');
  const packages = parseChangesetPackages();

  if (packages.length === 0) {
    console.log('No packages to publish');
    return null;
  }

  console.log('📦 Packages to publish:', packages.map(p => `${p.name}@${p.version}`).join(', '));

  console.log('🔄 Calculating topological order...');
  const packagesInOrder = getTopologicalOrder(packages);

  // Separate packages into phases
  const sharedPackages = packagesInOrder.filter(pkg => !hasInternalDependencies(pkg));
  const dependentPackages = packagesInOrder.filter(pkg => hasInternalDependencies(pkg));

  console.log('📋 Publishing order:');
  console.log('  Phase 1 - Shared packages (no internal dependencies):');
  sharedPackages.forEach((pkg, index) => {
    console.log(`    ${index + 1}. ${pkg.name}@${pkg.version}`);
  });

  if (dependentPackages.length > 0) {
    console.log('  Phase 2 - Dependent packages (with internal dependencies):');
    dependentPackages.forEach((pkg, index) => {
      console.log(`    ${index + 1}. ${pkg.name}@${pkg.version}`);
    });
  }

  return { sharedPackages, dependentPackages, packagesInOrder };
}

/**
 * Show dry run output for packages
 */
function showDryRun(
  sharedPackages: PackageInfo[],
  dependentPackages: PackageInfo[],
  packagesInOrder: PackageInfo[]
) {
  console.log('\n🚀 DRY RUN - Publication order (no actual publishing):');
  console.log('─'.repeat(60));

  // Show Phase 1: Shared packages
  if (sharedPackages.length > 0) {
    console.log('\n📦 Phase 1 - Shared packages (no internal dependencies):');
    for (const pkg of sharedPackages) {
      const packagePath = pkg.path.replace('/package.json', '').replace(process.cwd(), '.');
      console.log(`📤 ${pkg.name}@${pkg.version}`);
      console.log(`   📁 ${packagePath}`);
      console.log('');
    }
  }

  // Show Phase 2: Dependent packages
  if (dependentPackages.length > 0) {
    console.log('\n📦 Phase 2 - Dependent packages (with internal dependencies):');
    for (const pkg of dependentPackages) {
      const packagePath = pkg.path.replace('/package.json', '').replace(process.cwd(), '.');
      console.log(`📤 ${pkg.name}@${pkg.version}`);
      console.log(`   📁 ${packagePath}`);

      // Check if this package depends on any of the previously published packages
      const allDependencies = { ...pkg.dependencies, ...pkg.devDependencies };
      const internalDependencies = Object.entries(allDependencies).filter(
        ([depName, depVersion]) =>
          depName.startsWith('@vite-powerflow/') || depVersion.startsWith('workspace:')
      );

      if (internalDependencies.length > 0) {
        for (const [depName] of internalDependencies) {
          const depIndex = packagesInOrder.findIndex(p => p.name === depName);
          if (depIndex >= 0 && depIndex < packagesInOrder.indexOf(pkg)) {
            console.log(
              `   📝 Updates dependency: ${depName} → ^${packagesInOrder[depIndex].version}`
            );
          }
        }
      }
      console.log('');
    }
  }

  console.log('─'.repeat(60));
  console.log(
    '💡 In CI: This script will publish packages in topological order (changeset version already run)'
  );
  console.log('🎉 DRY RUN completed - no packages were actually published!');
  console.log(
    '🔒 To publish in CI, ensure CI=true or GITHUB_ACTIONS=true environment variables are set'
  );
}

/**
 * Main function to publish packages in topological order
 * In CI: publishes packages in topological order
 * In local: shows dry run of the publication order
 */
function publishTopological() {
  // Check if we're in CI environment
  const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';

  // Get packages and calculate order (shared logic)
  const result = getPackagesAndOrder();
  if (!result) return;

  const { sharedPackages, dependentPackages, packagesInOrder } = result;

  if (isCI) {
    console.log('\n🚀 CI Environment detected - Starting actual publication...');
    console.log('─'.repeat(60));

    // Phase 1: Publish shared packages (no internal dependencies)
    if (sharedPackages.length > 0) {
      console.log('\n📦 Phase 1: Publishing shared packages...');
      for (const pkg of sharedPackages) {
        publishPackage(pkg);
      }
      console.log('✅ Phase 1 completed - Shared packages published');
    }

    // Phase 2: Publish dependent packages (with internal dependencies)
    if (dependentPackages.length > 0) {
      console.log('\n📦 Phase 2: Publishing dependent packages...');
      for (const pkg of dependentPackages) {
        publishPackage(pkg);
      }
      console.log('✅ Phase 2 completed - Dependent packages published');
    }

    console.log('─'.repeat(60));
    console.log('🎉 All packages published successfully!');
  } else {
    // Local environment: Show dry run
    showDryRun(sharedPackages, dependentPackages, packagesInOrder);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    publishTopological();
  } catch (error) {
    console.error(error);
  }
}

export { getTopologicalOrder, publishTopological };
