// Script to replace all "workspace:*" dependencies in package.json with the published version from npm
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const pkgPath = path.resolve(__dirname, '../package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

let changed = false;

for (const depType of ['dependencies', 'devDependencies', 'peerDependencies']) {
  if (!pkg[depType]) continue;
  for (const dep in pkg[depType]) {
    if (pkg[depType][dep] === 'workspace:*') {
      // Get the latest published version from npm
      try {
        const version = execSync(`npm view ${dep} version`).toString().trim();
        pkg[depType][dep] = `^${version}`;
        console.log(`Replaced ${dep} workspace:* with ^${version}`);
        changed = true;
      } catch {
        console.warn(`Could not fetch version for ${dep}`);
      }
    }
  }
}

if (changed) {
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  console.log('package.json updated with published versions.');
} else {
  console.log('No workspace:* dependencies found to replace.');
}
