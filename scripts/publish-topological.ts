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
 *
 * @returns Array of packages that will be published with their metadata
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
            dependencies?: Record<string, string>;
            devDependencies?: Record<string, string>;
          };
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
    `packages/vite-powerflow-sync/package.json`, // Special case for extension
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
 * Main function to publish packages in topological order
 * Parses changeset status, calculates dependency order, and performs dry run
 * Shows which packages would be published and in what order
 */
function publishTopological() {
  console.log('🔍 Getting packages to publish...');
  const packages = parseChangesetPackages();

  if (packages.length === 0) {
    console.log('No packages to publish');
    return;
  }

  console.log('📦 Packages to publish:', packages.map(p => `${p.name}@${p.version}`).join(', '));

  console.log('🔄 Calculating topological order...');
  const packagesInOrder = getTopologicalOrder(packages);

  console.log('📋 Publishing order:');
  packagesInOrder.forEach((pkg, index) => {
    console.log(`  ${index + 1}. ${pkg.name}@${pkg.version}`);
  });

  console.log('\n🚀 DRY RUN - Publication order (no actual publishing):');
  console.log('─'.repeat(60));

  for (const pkg of packagesInOrder) {
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

  console.log('─'.repeat(60));
  console.log('💡 Recommendation: Run "pnpm changeset version" first to update dependencies');
  console.log('🎉 DRY RUN completed - no packages were actually published!');
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
