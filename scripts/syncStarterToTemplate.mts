import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const starterSrc = path.resolve(__dirname, '../packages/starter');
const templateDest = path.resolve(__dirname, '../packages/cli/template');

console.log('📦 Synchronizing template from packages/starter/ to packages/cli/template/...');

fs.removeSync(templateDest);
fs.copySync(starterSrc, templateDest, {
  filter: srcPath => {
    const ignore = ['node_modules', '.git', '.DS_Store'];
    return !ignore.some(dir => srcPath.includes(dir));
  },
});

console.log('✅ Template synchronized successfully!');
