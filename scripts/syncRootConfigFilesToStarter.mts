import path from 'path';
import { findUp } from 'find-up';
import fs from 'fs-extra';
import { copyConfigFile } from './copyUtils.js';

const root = await findUp(
  async directory => {
    return fs.pathExistsSync(path.join(directory, 'pnpm-workspace.yaml')) ? directory : undefined;
  },
  { type: 'directory' }
);

const starter = path.resolve(root, 'packages/starter');
const configFiles = [
  '.editorconfig',
  '.prettierrc',
  '.prettierignore',
  'Dockerfile',
  'docker-compose.yml',
];

console.log('📄 Copying config files from monorepo root to packages/starter...');

(async () => {
  for (const filename of configFiles) {
    const source = path.join(root, filename);
    const dest = path.join(starter, filename);
    if (await fs.pathExists(source)) {
      await copyConfigFile(source, dest);
      console.log(`✅ ${filename} copied`);
    } else {
      console.log(`⚠️ ${filename} not found`);
    }
  }
  console.log('🏁 Config files sync complete!');
})();
