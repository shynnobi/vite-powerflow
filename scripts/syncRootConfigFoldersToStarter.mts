import path from 'path';
import { findUp } from 'find-up';
import fs from 'fs-extra';
import { copyConfigFolder } from './copyUtils.js';

const root = await findUp(
  async directory => {
    return fs.pathExistsSync(path.join(directory, 'pnpm-workspace.yaml')) ? directory : undefined;
  },
  { type: 'directory' }
);

const starter = path.resolve(root, 'packages/starter');
const configFolders = ['.cursor', '.devcontainer', '.github', '.husky', '.vscode'];

console.log('🚀 Copying config folders from monorepo root to packages/starter...');

(async () => {
  for (const folder of configFolders) {
    const source = path.join(root, folder);
    const dest = path.join(starter, folder);
    if (await fs.pathExists(source)) {
      await copyConfigFolder(source, dest);
      console.log(`✅ ${folder} copied`);
    } else {
      console.log(`⚠️ ${folder} not found`);
    }
  }
  console.log('🏁 Config folders sync complete!');
})();
