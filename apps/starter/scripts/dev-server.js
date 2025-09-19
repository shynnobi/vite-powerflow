#!/usr/bin/env node

import { spawn } from 'child_process';

console.log('🚀 Starting development server...\n');

const nxProcess = spawn('npx', ['nx', 'serve'], {
  stdio: 'inherit',
  shell: true,
  cwd: process.cwd(),
});

nxProcess.on('close', code => {
  if (code !== 0) {
    console.error(`\n❌ Development server exited with code ${code}`);
    process.exit(code);
  }
});

nxProcess.on('error', error => {
  console.error(`\n❌ Failed to start development server: ${error.message}`);
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development server...');
  nxProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down development server...');
  nxProcess.kill('SIGTERM');
});
