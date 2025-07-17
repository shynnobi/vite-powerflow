#!/usr/bin/env tsx

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function usageAndExit() {
  console.error('Usage: pnpm generate:app <app-name>');
  process.exit(1);
}

const [, , appName] = process.argv;
if (!appName || !/^[a-zA-Z0-9-_]+$/.test(appName)) usageAndExit();

const root = path.resolve(__dirname, '..');
const templateDir = path.join(root, 'templates', 'example-app');
const destDir = path.join(root, 'apps', appName);

if (fs.existsSync(destDir)) {
  console.error(`Error: ${destDir} already exists.`);
  process.exit(1);
}

function copyDir(src: string, dest: string) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    if (entry === 'node_modules') continue;
    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function replaceInFile(file: string, from: string, to: string) {
  const content = fs.readFileSync(file, 'utf-8');
  const replaced = content.split(from).join(to);
  if (content !== replaced) fs.writeFileSync(file, replaced);
}

function walkFiles(dir: string, cb: (file: string) => void) {
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    if (fs.statSync(fullPath).isDirectory()) {
      walkFiles(fullPath, cb);
    } else {
      cb(fullPath);
    }
  }
}

// 1. Copy the template
type LogFn = (msg: string) => void;
const log: LogFn = msg => console.log(`\x1b[36m[generate:app]\x1b[0m ${msg}`);

log(`Copying template to apps/${appName}...`);
copyDir(templateDir, destDir);

// 2. Replace 'example-app' with the new name in all files
log('Replacing occurrences of "example-app"...');
walkFiles(destDir, file => replaceInFile(file, 'example-app', appName));

// 3. Update the "name" field in package.json
const pkgJsonPath = path.join(destDir, 'package.json');
if (fs.existsSync(pkgJsonPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
  pkg.name = appName;
  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkg, null, 2));
  log('Updated package.json name field.');
}

// 4. Run build and generate:aliases
log(`Running pnpm --filter ${appName}... build...`);
execSync(`pnpm --filter ${appName}... build`, { stdio: 'inherit', cwd: root });
log('Running pnpm generate:aliases...');
execSync('pnpm generate:aliases', { stdio: 'inherit', cwd: root });

log(`App ${appName} generated successfully!`);
