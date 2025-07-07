import fs from 'fs-extra';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const starterSrc = path.resolve(__dirname, '../../starter');
const templateDest = path.resolve(__dirname, '../../cli/template');

console.log('📦 Synchronizing template from packages/starter/ to packages/cli/template/...');

// Remove existing template
fs.removeSync(templateDest);

// Copy starter to template
fs.copySync(starterSrc, templateDest, {
  filter: srcPath => {
    const ignore = ['node_modules', '.git', '.DS_Store', 'template'];
    return !ignore.some(dir => srcPath.includes(dir));
  },
});

console.log('✅ Template synchronized successfully!');
