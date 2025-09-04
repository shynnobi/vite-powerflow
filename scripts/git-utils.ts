import { execSync } from 'child_process';

import { RELEASE_CONSTANTS } from '../constants/release-constants';

/**
 * Gets the latest release commit hash by searching for commits with release patterns.
 * This should be the most recent "${RELEASE_CONSTANTS.COMMIT_MESSAGE}" or "${RELEASE_CONSTANTS.PR_TITLE}" commit.
 *
 * @param workspaceRoot - The root directory of the workspace
 * @returns The SHA of the latest release commit, or HEAD if no release commit found
 */
export function getLatestReleaseCommit(workspaceRoot: string): string {
  try {
    // First, try to find the most recent release commit
    const releaseCommit = execSync(
      `git log --oneline --grep="${RELEASE_CONSTANTS.COMMIT_MESSAGE}" --grep="${RELEASE_CONSTANTS.PR_TITLE}" -1 --format="%H"`,
      { encoding: 'utf-8', cwd: workspaceRoot }
    ).trim();

    if (releaseCommit) {
      return releaseCommit;
    } else {
      // Fallback to HEAD if no release commit found
      return execSync('git rev-parse HEAD', { encoding: 'utf-8', cwd: workspaceRoot }).trim();
    }
  } catch (error) {
    throw new Error(
      `Could not get git commit hash: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Gets the latest release commit hash and returns both the full SHA and short SHA.
 *
 * @param workspaceRoot - The root directory of the workspace
 * @returns Object containing full SHA and short SHA (7 characters)
 */
export function getLatestReleaseCommitWithShort(workspaceRoot: string): {
  full: string;
  short: string;
} {
  const full = getLatestReleaseCommit(workspaceRoot);
  return {
    full,
    short: full.substring(0, 7),
  };
}
