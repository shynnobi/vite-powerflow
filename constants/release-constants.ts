// Release constants - keep in sync across all files
// Used by: .github/workflows/release.yml, scripts/git-utils.ts, packages/vite-powerflow-sync

export const RELEASE_CONSTANTS = {
  COMMIT_MESSAGE: 'chore: release new versions',
  PR_TITLE: 'Version Packages',
} as const;

// Export JSON when called directly (for GitHub Actions)
if (import.meta.url === `file://${process.argv[1]}` && process.argv.includes('--export-json')) {
  console.log(
    JSON.stringify(
      {
        COMMIT_MESSAGE: RELEASE_CONSTANTS.COMMIT_MESSAGE,
        PR_TITLE: RELEASE_CONSTANTS.PR_TITLE,
      },
      null,
      2
    )
  );
}
