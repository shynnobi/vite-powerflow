const fs = require('fs-extra');
const path = require('path');

const src = path.resolve(__dirname, '../packages/starter');
const dest = path.resolve(__dirname, '../packages/cli/template');

fs.removeSync(dest);
fs.copySync(src, dest, {
  filter: srcPath => {
    const ignore = ['node_modules', '.git', '.DS_Store'];
    return !ignore.some(dir => srcPath.includes(dir));
  },
});

console.log('Template synchronized from packages/starter/ to packages/cli/template/');
