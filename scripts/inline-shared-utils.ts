#!/usr/bin/env tsx
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { builtinModules } from 'module';
import path from 'path';

const SHARED_UTILS = 'packages/shared-utils/src';
const SHARED_UTILS_PACKAGE_JSON = 'packages/shared-utils/package.json';

/**
 * Get consumers for inlining (only starter for hybrid approach)
 */
function getConsumers(): string[] {
  // All packages that use shared utilities
  const consumers = ['apps/starter', 'packages/cli', 'packages/vite-powerflow-sync'];

  console.log('🔍 Making packages autonomous by inlining shared utilities...');
  for (const consumer of consumers) {
    console.log(`  📦 Target consumer: ${consumer}`);
  }

  return consumers;
}

/**
 * Detect the appropriate import extension for a consumer project
 */
function getImportExtension(consumer: string): string {
  const packageJsonPath = `${consumer}/package.json`;

  if (!existsSync(packageJsonPath)) {
    return ''; // Default: no extension
  }

  try {
    const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as {
      bin?: unknown;
      type?: string;
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };

    // Node.js project - has bin field and type: module
    if (pkg.bin && pkg.type === 'module') {
      return '.js';
    }

    // Vite project - has vite dependency
    if (pkg.dependencies?.vite || pkg.devDependencies?.vite) {
      return ''; // No extension for Vite projects
    }

    // React project - has react dependency
    if (pkg.dependencies?.react || pkg.devDependencies?.react) {
      return ''; // React projects typically don't use extensions
    }

    // Default fallback
    return '';
  } catch {
    console.log(`⚠️  Could not read package.json for ${consumer}, using default import extension`);
    return '';
  }
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

  // Get required dependencies from shared-utils (will be calculated per consumer)
  console.log('📦 Dependencies will be extracted per consumer based on used files...');

  // Automatically detect all mappings
  const importMappings = await autoDetectAllMappings();
  console.log(`📋 Detected ${importMappings.length} modules to inline`);

  // Get consumers (hybrid approach)
  const consumers = getConsumers();

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

          // Determine the file name and extension based on project type
          const fileName = mapping.from.split('/').pop();
          const importExtension = getImportExtension(consumer);
          const importPath = `${normalizedPath}/${fileName}${importExtension}`;

          content = content.replace(
            new RegExp(`from ['"]${mapping.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g'),
            `from '${importPath}'`
          );
          modified = true;
        }
      }

      if (modified) {
        writeFileSync(file, content);
        console.log(`  🔄 Updated imports in ${path.relative(consumer, file)}`);
      }
    }

    // Update dependencies in package.json based on actually used files
    console.log(`📦 Updating dependencies for ${consumer}...`);
    const requiredDeps = getRequiredDependencies(usedFiles);
    updateConsumerDependencies(consumer, requiredDeps);

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

/**
 * Extract dependencies from shared-utils package.json that are needed for inlined files
 */
function getRequiredDependencies(usedFiles: Set<string>): Record<string, string> {
  if (!existsSync(SHARED_UTILS_PACKAGE_JSON)) {
    console.log('❌ Shared utils package.json not found, skipping dependency copying');
    return {};
  }

  const packageJson = JSON.parse(readFileSync(SHARED_UTILS_PACKAGE_JSON, 'utf-8')) as {
    dependencies?: Record<string, string>;
  };
  const dependencies = packageJson.dependencies ?? {};

  // Only detect dependencies for files that are actually being inlined
  const usedDependencies = detectUsedDependenciesForFiles(usedFiles);
  console.log(`🔍 Detected used dependencies for inlined files: ${usedDependencies.join(', ')}`);

  // Only return dependencies that are actually used in the inlined files
  const requiredDeps: Record<string, string> = {};

  for (const dep of usedDependencies) {
    const depVersion = dependencies[dep];
    if (depVersion) {
      requiredDeps[dep] = depVersion;
    }
  }

  return requiredDeps;
}

/**
 * Automatically detect which dependencies are used in specific shared-utils files
 */
function detectUsedDependenciesForFiles(usedFiles: Set<string>): string[] {
  const usedDeps = new Set<string>();

  for (const fileName of Array.from(usedFiles)) {
    const filePath = `packages/shared-utils/src/${fileName}`;
    if (existsSync(filePath)) {
      const content = readFileSync(filePath, 'utf-8');
      const imports = extractImportsFromFile(content);

      for (const importPath of imports) {
        // Extract the package name from import paths
        const packageName = extractPackageNameFromImport(importPath);
        if (packageName) {
          usedDeps.add(packageName);
        }
      }
    }
  }

  return Array.from(usedDeps);
}

/**
 * Extract import statements from file content
 */
function extractImportsFromFile(content: string): string[] {
  const imports: string[] = [];

  // Pattern to detect import statements
  const importRegex = /import\s+(?:.*?\s+from\s+)?['"]([^'"]+)['"]/g;

  let match: RegExpExecArray | null;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    imports.push(importPath);
  }

  return imports;
}

/**
 * Extract package name from import path
 */
function extractPackageNameFromImport(importPath: string): string | null {
  // Handle different import patterns:
  // - 'chalk' -> 'chalk'
  // - 'ora' -> 'ora'
  // - 'find-up' -> 'find-up'
  // - 'path' -> null (built-in module)
  // - './relative/path' -> null (relative import)
  // - '@scope/package' -> '@scope/package'
  // - '@scope/package/subpath' -> '@scope/package'

  // Skip relative imports and built-in modules
  if (importPath.startsWith('.') || importPath.startsWith('/')) {
    return null;
  }

  // Use Node.js built-in modules API for automatic detection
  const builtInModules = new Set(builtinModules);

  if (builtInModules.has(importPath)) {
    return null;
  }

  // Handle scoped packages
  if (importPath.startsWith('@')) {
    const parts = importPath.split('/');
    if (parts.length >= 2) {
      return `${parts[0]}/${parts[1]}`;
    }
  }

  // Handle regular packages
  const parts = importPath.split('/');
  return parts[0] || null;
}

/**
 * Update package.json of a consumer to include required dependencies
 */
function updateConsumerDependencies(consumer: string, requiredDeps: Record<string, string>): void {
  const packageJsonPath = `${consumer}/package.json`;

  if (!existsSync(packageJsonPath)) {
    console.log(`❌ Package.json not found for ${consumer}, skipping dependency update`);
    return;
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as {
    dependencies?: Record<string, string>;
  };

  // Initialize dependencies object if it doesn't exist
  packageJson.dependencies ??= {};

  let hasChanges = false;

  // Add or update required dependencies
  for (const [depName, depVersion] of Object.entries(requiredDeps)) {
    const currentVersion = packageJson.dependencies[depName];
    if (!currentVersion || currentVersion !== depVersion) {
      packageJson.dependencies[depName] = depVersion;
      hasChanges = true;
      console.log(`  ✅ Added/updated dependency: ${depName}@${depVersion}`);
    }
  }

  if (hasChanges) {
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    console.log(`  ✅ Updated package.json for ${consumer}`);
  } else {
    console.log(`  ℹ️  No dependency changes needed for ${consumer}`);
  }
}

// Execute the script
if (import.meta.url === `file://${process.argv[1]}`) {
  inlineSharedUtils().catch(error => {
    console.error(`❌ Script failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  });
}
