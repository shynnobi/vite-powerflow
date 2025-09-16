#!/usr/bin/env tsx
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import path from 'path';

const SHARED_UTILS = 'packages/shared-utils/src';

/**
 * Get consumers for inlining (only starter for hybrid approach)
 */
function getConsumers(): string[] {
  // Hybrid approach: inline in starter and CLI for autonomous packages
  const consumers = ['apps/starter', 'packages/cli'];

  console.log('🔍 Using hybrid approach - inlining in starter and CLI...');
  for (const consumer of consumers) {
    console.log(`  📦 Target consumer: ${consumer}`);
  }

  return consumers;
}

interface ImportMapping {
  from: string;
  to: string;
  functions: string[];
}

/**
 * Automatically detect all mappings from shared-utils files
 */
async function autoDetectAllMappings(): Promise<ImportMapping[]> {
  const mappings: ImportMapping[] = [];

  // Scan all .ts files in shared-utils/src
  const files = await glob('packages/shared-utils/src/**/*.ts');

  for (const file of files) {
    const fileName = path.basename(file, '.ts');

    // Create the mapping automatically
    const functions = extractExports(readFileSync(file, 'utf-8'));

    mappings.push({
      from: `@vite-powerflow/shared-utils/${fileName}`,
      to: `../utils/shared/${fileName}`,
      functions,
    });
  }

  return mappings;
}

/**
 * Extract exported functions from TypeScript file content
 */
function extractExports(content: string): string[] {
  const exports: string[] = [];

  // Pattern to detect function exports (including async)
  const functionExportRegex = /export\s+(?:async\s+)?function\s+(\w+)/g;
  let match: RegExpExecArray | null;
  while ((match = functionExportRegex.exec(content)) !== null) {
    exports.push(match[1]);
  }

  // Pattern to detect const exports
  const constExportRegex = /export\s+const\s+(\w+)/g;
  while ((match = constExportRegex.exec(content)) !== null) {
    exports.push(match[1]);
  }

  // Pattern to detect named exports
  const namedExportRegex = /export\s*\{\s*([^}]+)\s*\}/g;
  while ((match = namedExportRegex.exec(content)) !== null) {
    const exportList = match[1];
    const exportedItems = exportList.split(',').map((item: string) => {
      // Handle exports with aliases (e.g., { logInfo as info })
      return item.includes(' as ') ? (item.split(' as ')[0]?.trim() ?? '') : item.trim();
    });
    exports.push(...exportedItems.filter(item => item && item !== 'type'));
  }

  // For index.ts files with export *, we cannot detect the exports
  // but we can indicate that there are exports
  if (content.includes('export * from')) {
    // Return a special marker to indicate there are exports
    exports.push('*');
  }

  return exports;
}

async function inlineSharedUtils(): Promise<void> {
  console.log('🔄 Inlining shared utilities...');

  // Automatically detect all mappings
  const importMappings = await autoDetectAllMappings();
  console.log(`📋 Detected ${importMappings.length} modules to inline`);

  // Get consumers (hybrid approach)
  console.log('🔍 Getting consumers...');
  const consumers = getConsumers();
  console.log(`📦 Found ${consumers.length} consumers`);

  for (const consumer of consumers) {
    if (!existsSync(consumer)) {
      console.log(`⏭️  Skipping ${consumer} (not found)`);
      continue;
    }

    console.log(`📦 Processing ${consumer}...`);

    // Create the destination directory
    const targetDir = `${consumer}/src/utils/shared`;
    mkdirSync(targetDir, { recursive: true });

    // Analyze source files to detect imports
    const sourceFiles = await glob(`${consumer}/**/*.{ts,js}`, {
      ignore: ['**/node_modules/**', '**/dist/**', '**/template/**'],
    });

    const usedFiles = new Set<string>();

    for (const file of sourceFiles) {
      const content = readFileSync(file, 'utf-8');

      // Detect shared-utils imports
      for (const mapping of importMappings) {
        if (content.includes(mapping.from)) {
          // Extract imported functions
          const importedFunctions = extractImportedFunctions(content, mapping.from);

          // Determine which files to copy
          for (const func of importedFunctions) {
            if (mapping.functions.includes(func)) {
              // Extract the file name from the mapping
              const fileName = mapping.from.split('/').pop() + '.ts';
              usedFiles.add(fileName);
            }
          }
        }
      }
    }

    // Copy used files
    for (const file of Array.from(usedFiles)) {
      const sourceFile = `${SHARED_UTILS}/${file}`;
      const targetFile = `${targetDir}/${file}`;

      if (existsSync(sourceFile)) {
        copyFileSync(sourceFile, targetFile);
        console.log(`  ✅ Copied ${file}`);
      }
    }

    // Update imports in source files
    for (const file of sourceFiles) {
      let content = readFileSync(file, 'utf-8');
      let modified = false;

      for (const mapping of importMappings) {
        if (content.includes(mapping.from)) {
          // Calculate the correct relative path
          const relativePath = path.relative(path.dirname(file), `${consumer}/src/utils/shared`);
          const normalizedPath = relativePath.startsWith('.') ? relativePath : `./${relativePath}`;

          // Determine the file name to import automatically
          const fileName = mapping.from.split('/').pop() + '.ts';

          content = content.replace(
            new RegExp(`from ['"]${mapping.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g'),
            `from '${normalizedPath}/${fileName}'`
          );
          modified = true;
        }
      }

      if (modified) {
        writeFileSync(file, content);
        console.log(`  🔄 Updated imports in ${path.relative(consumer, file)}`);
      }
    }

    console.log(`✅ Completed ${consumer}`);
  }

  console.log('🎉 Shared utilities inlining completed!');
}

function extractImportedFunctions(content: string, importPath: string): string[] {
  const functions: string[] = [];

  // Pattern to detect named imports
  const namedImportRegex = new RegExp(
    `import\\s*\\{([^}]+)\\}\\s*from\\s*['"]${importPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`,
    'g'
  );

  let match: RegExpExecArray | null;
  while ((match = namedImportRegex.exec(content)) !== null) {
    const importList = match[1];
    const importedItems = importList.split(',').map((item: string) => item.trim());

    for (const item of importedItems) {
      // Handle imports with aliases (e.g., { logInfo as info })
      const functionName = item.includes(' as ')
        ? (item.split(' as ')[0]?.trim() ?? '')
        : item.trim();

      if (functionName && functionName !== 'type') {
        functions.push(functionName);
      }
    }
  }

  // Pattern to detect default imports
  const defaultImportRegex = new RegExp(
    `import\\s+(\\w+)\\s*from\\s*['"]${importPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`,
    'g'
  );

  while ((match = defaultImportRegex.exec(content)) !== null) {
    const functionName = match[1];
    functions.push(functionName);
  }

  return functions;
}

// Execute the script
if (import.meta.url === `file://${process.argv[1]}`) {
  inlineSharedUtils().catch(console.error);
}
