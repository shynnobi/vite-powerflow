import { execSync } from 'child_process';
import * as fs from 'fs';
import * as vscode from 'vscode';

/**
 * A simple cache for npm version lookups to avoid hitting the network on every check.
 * The cache is valid for 5 minutes per package.
 */
const npmVersionCache = new Map<string, { version: string; timestamp: number }>();

/**
 * Reads and parses a package.json file, returning its name and version if available.
 * @param packagePath - The absolute path to the package.json file
 * @returns An object with name and version, or null if not found or invalid
 */
export async function getPackageInfo(
  packagePath: string
): Promise<{ name: string; version: string } | null> {
  try {
    const pkgContent = await fs.promises.readFile(packagePath, 'utf-8');
    const pkg = JSON.parse(pkgContent);
    if (pkg.name && pkg.version) {
      return { name: pkg.name, version: pkg.version };
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Fetches the latest published version of a package from npm, with caching and error handling.
 * Logs a message if the package is not found or not published yet.
 * @param packageName - The name of the npm package
 * @param outputChannel - VS Code output channel for logging
 * @param outputBuffer - Buffer to collect log lines
 * @returns The latest version as a string, or null if not found
 */
export async function getLatestNpmVersion(
  packageName: string,
  outputChannel: vscode.OutputChannel
): Promise<string | null> {
  const cached = npmVersionCache.get(packageName);
  // Cache for 5 minutes to avoid excessive network requests.
  if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
    return cached.version;
  }

  try {
    const version = execSync(`npm view ${packageName} version`, {
      encoding: 'utf-8',
      // Set a timeout to avoid hanging if npm is slow.
      timeout: 5000,
    }).trim();
    npmVersionCache.set(packageName, { version, timestamp: Date.now() });
    return version;
  } catch (error) {
    outputChannel.appendLine(
      `ℹ️ Could not fetch version for '${packageName}' from npm. It may not be published yet.`
    );
    return null;
  }
}
