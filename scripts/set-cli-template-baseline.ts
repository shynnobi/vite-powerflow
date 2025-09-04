import fs from 'fs-extra';
import * as path from 'path';
import { fileURLToPath } from 'url';

import { TemplatePkgJson } from './types/package-json';
import { getLatestReleaseCommitWithShort } from './git-utils';
import { logRootError, logRootInfo, logRootSuccess } from './monorepo-logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

void (async () => {
  const root = path.resolve(__dirname, '..');
  const starterPkgPath = path.join(root, 'apps/starter/package.json');
  const templatePkgPath = path.join(root, 'packages/cli/template/package.json');

  logRootInfo('—— Updating CLI template baseline commit ——');

  try {
    // Ensure both package.json files exist before proceeding.
    const starterExists: boolean = await fs.pathExists(starterPkgPath);
    const templateExists: boolean = await fs.pathExists(templatePkgPath);
    if (!starterExists || !templateExists) {
      logRootError(
        'starter or template package.json not found. Make sure to run the sync script first.'
      );
      process.exit(1);
    }

    // Get the latest release commit hash using shared utility
    let commit: string;
    try {
      const { full, short } = getLatestReleaseCommitWithShort(root);
      commit = full;
      logRootInfo(`Using latest release commit: ${short}`);
    } catch (error) {
      logRootError('Could not get git commit hash.');
      logRootError(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }

    // Read the necessary package.json files.
    const templatePkgRaw = await fs.readFile(templatePkgPath, 'utf8');
    const templatePkg = JSON.parse(templatePkgRaw) as TemplatePkgJson;

    // Create or update the starterSource object.
    templatePkg.starterSource = {
      commit,
      syncedAt: new Date().toISOString(),
    };

    // Write the updated package.json back to the template directory.
    await fs.writeFile(templatePkgPath, JSON.stringify(templatePkg, null, 2), 'utf8');

    logRootSuccess(`Template baseline commit updated successfully to ${commit.substring(0, 7)}.`);
  } catch (err) {
    logRootError('Failed to update template baseline!');
    logRootError(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
})();
