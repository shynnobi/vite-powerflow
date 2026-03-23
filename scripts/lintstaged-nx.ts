#!/usr/bin/env tsx

import { spawnSync } from 'child_process';
import fs from 'fs';
import { globSync } from 'glob';
import * as yaml from 'js-yaml';
import path from 'path';

import { logRootError, logRootInfo } from './monorepo-logger';

// 1. Get the list of files passed as arguments
const files = process.argv.slice(2).filter(f => !f.startsWith('-'));
if (files.length === 0) {
  logRootInfo('[lintstaged-nx] No files to process.');
  process.exit(0);
}

// 2. Load the list of workspaces from pnpm-workspace.yaml
function getWorkspaces(): string[] {
  const wsPath = path.resolve(process.cwd(), 'pnpm-workspace.yaml');
  if (fs.existsSync(wsPath)) {
    const wsYaml = yaml.load(fs.readFileSync(wsPath, 'utf8')) as { packages?: string[] };
    const globs: string[] = wsYaml.packages ?? [];
    let workspaces: string[] = [];
    for (const g of globs) {
      workspaces = workspaces.concat(globSync(g, { cwd: process.cwd(), absolute: true }));
    }
    return workspaces.filter(ws => fs.existsSync(path.join(ws, 'package.json')));
  }
  throw new Error('No pnpm-workspace.yaml found to detect workspaces.');
}

const workspaces = getWorkspaces();
const workspaceRoots = workspaces?.map(ws => path.relative(process.cwd(), ws));

// 3. Map each file to a workspace
function findWorkspaceForFile(file: string): string | null {
  // Skip template files
  if (file.includes('packages/cli/template/')) {
    return null;
  }

  const normFile = path.normalize(file);
  for (const ws of workspaceRoots) {
    if (normFile === ws || normFile.startsWith(ws + path.sep)) {
      const packageJsonPath = path.join(ws, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')) as {
          name?: string;
        };
        return packageJson.name ?? path.basename(ws);
      }
      return path.basename(ws);
    }
  }
  return null;
}

const wsToFiles: Record<string, string[]> = {};
const filesOutside: string[] = [];
for (const file of files) {
  const ws = findWorkspaceForFile(file);
  if (ws) {
    if (!wsToFiles[ws]) wsToFiles[ws] = [];
    wsToFiles[ws].push(file);
  } else {
    filesOutside.push(file);
  }
}

// 4. For each impacted workspace, run nx run <workspace>:lint <workspace>:format
let hasError = false;
const impactedWorkspaces = Object.keys(wsToFiles);
if (impactedWorkspaces.length) {
  logRootInfo(`[lintstaged-nx] Impacted workspaces: ${impactedWorkspaces.join(', ')}`);

  // Run lint for all impacted workspaces
  const lintTargets = impactedWorkspaces.map(ws => `${ws}:lint`);
  logRootInfo(
    `[lintstaged-nx] Running: nx run-many --target=lint --projects=${impactedWorkspaces.join(',')}`
  );
  const lintResult = spawnSync(
    'npx',
    [
      'nx',
      'run-many',
      '--target=lint',
      `--projects=${impactedWorkspaces.join(',')}`,
      '--skip-nx-cache',
    ],
    { stdio: 'inherit' }
  );
  if (lintResult.status !== 0) {
    logRootError(`[lintstaged-nx] ❌ Lint failed (exit code: ${lintResult.status})`);
    hasError = true;
  }

  // Run format for all impacted workspaces
  const formatTargets = impactedWorkspaces.map(ws => `${ws}:format`);
  logRootInfo(
    `[lintstaged-nx] Running: nx run-many --target=format --projects=${impactedWorkspaces.join(',')}`
  );
  const formatResult = spawnSync(
    'npx',
    [
      'nx',
      'run-many',
      '--target=format',
      `--projects=${impactedWorkspaces.join(',')}`,
      '--skip-nx-cache',
    ],
    { stdio: 'inherit' }
  );
  if (formatResult.status !== 0) {
    logRootError(`[lintstaged-nx] ❌ Format failed (exit code: ${formatResult.status})`);
    hasError = true;
  }

  if (!hasError) {
    logRootInfo(`[lintstaged-nx] ✅ All checks passed for impacted workspaces`);
  }
}

// 5. For files outside any workspace, apply prettier
if (filesOutside.length) {
  logRootError(
    '[lintstaged-nx] Warning: The following files are not part of any workspace and will only be formatted:'
  );
  for (const f of filesOutside) {
    logRootError('  - ' + f);
  }
  const prettierResult = spawnSync('npx', ['prettier', '--write', ...filesOutside], {
    stdio: 'inherit',
  });
  if (prettierResult.status !== 0) {
    hasError = true;
  }
}

// 6. Exit with error code if any error occurred
process.exit(hasError ? 1 : 0);
