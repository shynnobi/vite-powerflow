#!/usr/bin/env tsx

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fixed VSIX filename (no version numbering)
const VSIX_FILENAME = 'vite-powerflow-sync.vsix';
const extensionDir = path.join(__dirname, '..', 'packages', 'vite-powerflow-sync');
const vsixPath = path.join(extensionDir, VSIX_FILENAME);

/**
 * Installs the VS Code extension
 */
function installExtension(vsixPath: string): void {
  try {
    console.log(`📦 Installing: ${VSIX_FILENAME}`);

    const result = execSync(`code --install-extension "${vsixPath}"`, {
      encoding: 'utf8',
      cwd: process.cwd(),
    });

    // Check if installation was successful
    if (
      result.includes('successfully installed') ||
      result.includes('was successfully installed')
    ) {
      console.log('✅ Extension installed successfully!');
      console.log("🔄 The extension version will be displayed in VS Code's Extensions panel");
    } else {
      console.warn('⚠️ Installation completed but without explicit confirmation');
      console.log('✅ Extension should be installed (check VS Code Extensions panel)');
    }
  } catch (error) {
    console.error('❌ Error during extension installation:');

    if (error instanceof Error) {
      if (error.message.includes('No such file or directory')) {
        console.error('   → VS Code CLI (code) is not installed or not in PATH');
        console.error('   → Make sure VS Code is installed and the "code" command is available');
      } else {
        console.error(`   → ${error.message}`);
      }
    } else {
      console.error(`   → ${error}`);
    }

    process.exit(1);
  }
}

// Main script
function main() {
  console.log('🚀 Installing Vite Powerflow Sync extension...');

  // Check if VSIX file exists
  if (!fs.existsSync(vsixPath)) {
    console.error(`❌ Extension file not found: ${vsixPath}`);
    console.error('💡 Make sure to run "pnpm extension:pack" first');
    process.exit(1);
  }

  // Check file size to ensure it's not corrupted
  const stats = fs.statSync(vsixPath);
  if (stats.size < 10000) {
    // Less than 10KB is probably corrupted
    console.error(`❌ Extension file seems corrupted (size: ${stats.size} bytes)`);
    console.error('💡 Try running "pnpm extension:pack" again');
    process.exit(1);
  }

  installExtension(vsixPath);
}

// Execute the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
