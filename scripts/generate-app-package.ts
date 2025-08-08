#!/usr/bin/env tsx

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { LogFn } from './types/log';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function usageAndExit() {
  console.error('Usage: pnpm generate:<type> <name>');
  console.error('  <type>: app | package');
  process.exit(1);
}

const [, , type, name] = process.argv;
if (!type || !name || !/^(app|package)$/.test(type) || !/^[a-zA-Z0-9-_]+$/.test(name))
  usageAndExit();

const root = path.resolve(__dirname, '..');
const templateDir = path.join(
  root,
  'templates',
  type === 'app' ? 'example-app' : 'example-package'
);
const destDir = path.join(root, type === 'app' ? 'apps' : 'packages', name);
const templateName = type === 'app' ? 'example-app' : 'example-package';

// For packages, enforce the @vite-powerflow scope in package.json
function getScopedPackageName(name: string): string {
  if (type === 'package') {
    return name.startsWith('@vite-powerflow/') ? name : `@vite-powerflow/${name}`;
  }
  return name;
}
const scopedName = getScopedPackageName(name);

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

const log: LogFn = msg => console.log(`\x1b[36m[generate:${type}]\x1b[0m ${msg}`);

log(`Copying template to ${type === 'app' ? 'apps' : 'packages'}/${name}...`);
copyDir(templateDir, destDir);

log(`Replacing occurrences of "${templateName}"...`);
walkFiles(destDir, file => replaceInFile(file, templateName, name));

const pkgJsonPath = path.join(destDir, 'package.json');
if (fs.existsSync(pkgJsonPath)) {
  const pkgRaw = fs.readFileSync(pkgJsonPath, 'utf-8');
  const pkg = JSON.parse(pkgRaw) as { name: string; [key: string]: unknown };
  pkg.name = scopedName;
  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkg, null, 2));
  log('Updated package.json name field.');
}

log('Running pnpm generate:aliases...');
execSync('pnpm generate:aliases', { stdio: 'inherit', cwd: root });

log(`Running pnpm --filter ${name}... build...`);
execSync(`pnpm --filter ${name}... build`, { stdio: 'inherit', cwd: root });

log(`${type.charAt(0).toUpperCase() + type.slice(1)} ${name} generated successfully!`);

log('Running pnpm install...');
execSync('pnpm install', { stdio: 'inherit', cwd: root });
