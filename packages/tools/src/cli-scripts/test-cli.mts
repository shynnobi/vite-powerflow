#!/usr/bin/env node
import { exec, execSync } from 'child_process';
import fs from 'fs-extra';
import { Listr } from 'listr2';
import path from 'path';
import { promisify } from 'util';

import { logError } from '@/shared/logger';

const execAsync = promisify(exec);

const args = process.argv.slice(2);
if (args.length === 0) {
  logError('Project name is required');
  process.exit(1);
}
const projectName = args[0];
const cleanupDir = path.resolve(projectName);

const tasks = new Listr([
  {
    title: 'Sync starter to template',
    task: async () => {
      try {
        await execAsync('pnpm sync:starter-to-template');
      } catch {
        throw new Error('Starter to template sync failed');
      }
    },
  },
  {
    title: 'Build CLI',
    task: async () => {
      try {
        await execAsync('pnpm cli:build');
      } catch {
        throw new Error('CLI build failed');
      }
    },
  },
  {
    title: 'Clean target directory',
    task: () => {
      if (fs.existsSync(cleanupDir)) {
        fs.rmSync(cleanupDir, { recursive: true, force: true });
      }
    },
  },
  {
    title: 'Generate project (non-interactive)',
    task: async () => {
      try {
        await execAsync(`pnpm cli:start -n "${projectName}" -g -o`);
      } catch {
        throw new Error('Project generation failed');
      }
    },
  },
  {
    title: 'Validate project directory',
    task: () => {
      if (!fs.existsSync(cleanupDir)) {
        throw new Error('Project generation failed - directory not created');
      }
    },
  },
]);

(async () => {
  try {
    await tasks.run();
    console.log(`\nAll done for project: ${projectName}`);
  } catch (err) {
    logError(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
})();
