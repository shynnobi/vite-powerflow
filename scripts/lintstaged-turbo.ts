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
  logRootInfo('[lintstaged-turbo] No files to process.');
  process.exit(0);
}

// 2. Load the list of workspaces from pnpm-workspace.yaml or turbo.json
function getWorkspaces(): string[] {
  // Try pnpm-workspace.yaml first
  const wsPath = path.resolve(process.cwd(), 'pnpm-workspace.yaml');
  if (fs.existsSync(wsPath)) {
    const wsYaml = yaml.load(fs.readFileSync(wsPath, 'utf8')) as { packages?: string[] };
    const globs: string[] = wsYaml.packages || [];
    // Expand globs to actual folders
    let workspaces: string[] = [];
    for (const g of globs) {
      workspaces = workspaces.concat(globSync(g, { cwd: process.cwd(), absolute: true }));
    }
    // Only keep folders with package.json
    return workspaces.filter(ws => fs.existsSync(path.join(ws, 'package.json')));
  }
  // Fallback: try turbo.json
  const turboPath = path.resolve(process.cwd(), 'turbo.json');
  if (fs.existsSync(turboPath)) {
    const turbo = JSON.parse(fs.readFileSync(turboPath, 'utf8'));
    if (turbo && turbo.pipeline) {
      // Try to infer workspaces from pipeline keys
      return Object.keys(turbo.pipeline)
        .map(name => path.resolve('packages', name))
        .filter(ws => fs.existsSync(path.join(ws, 'package.json')));
    }
  }
  throw new Error('No pnpm-workspace.yaml or turbo.json found to detect workspaces.');
}

const workspaces = getWorkspaces();
const workspaceRoots = workspaces.map(ws => path.relative(process.cwd(), ws));

// 3. Map each file to a workspace
function findWorkspaceForFile(file: string): string | null {
  // Find the workspace whose path is a prefix of the file
  const normFile = path.normalize(file);
  for (const ws of workspaceRoots) {
    if (normFile === ws || normFile.startsWith(ws + path.sep)) {
      return ws;
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

// 4. For each impacted workspace, run turbo run lint format --filter=<workspace>
let hasError = false;
const impactedWorkspaces = Object.keys(wsToFiles);
if (impactedWorkspaces.length) {
  logRootInfo(`[lintstaged-turbo] Impacted workspaces: ${impactedWorkspaces.join(', ')}`);
  const turboArgs = ['run', 'lint', 'format'];
  for (const ws of impactedWorkspaces) {
    const filterArg = `--filter=${ws}`;
    const result = spawnSync('npx', ['turbo', ...turboArgs, filterArg], { stdio: 'inherit' });
    if (result.status !== 0) {
      hasError = true;
    }
  }
}

// 5. For files outside any workspace, apply prettier and show a warning
if (filesOutside.length) {
  logRootError(
    '[lintstaged-turbo] Warning: The following files are not part of any workspace and will only be formatted:'
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

process.exit(hasError ? 1 : 0);
