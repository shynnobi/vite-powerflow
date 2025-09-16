#!/usr/bin/env tsx
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import path from 'path';

const SHARED_UTILS = 'packages/shared-utils/src';

/**
 * Automatically detect all packages that consume shared-utils
 */
async function autoDetectConsumers(): Promise<string[]> {
  const consumers: string[] = [];

  // Scanner tous les package.json du workspace
  const packageJsonFiles = await glob('**/package.json', {
    ignore: ['**/node_modules/**', '**/dist/**', 'packages/shared-utils/**'],
  });

  for (const packageJsonFile of packageJsonFiles) {
    try {
      const content = readFileSync(packageJsonFile, 'utf-8');
      const packageJson = JSON.parse(content) as Record<string, unknown>;

      // Vérifier si le package a des dépendances vers shared-utils
      const dependencies = packageJson.dependencies as Record<string, string> | undefined;
      const devDependencies = packageJson.devDependencies as Record<string, string> | undefined;

      const hasSharedUtilsDependency =
        dependencies?.['@vite-powerflow/shared-utils'] ??
        devDependencies?.['@vite-powerflow/shared-utils'];

      if (hasSharedUtilsDependency) {
        const packageDir = path.dirname(packageJsonFile);
        consumers.push(packageDir);
        console.log(`  📦 Found consumer: ${packageDir}`);
      }
    } catch (error) {
      // Ignorer les erreurs de parsing JSON
      console.warn(`  ⚠️  Could not parse ${packageJsonFile}: ${error}`);
    }
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

  // Scanner tous les fichiers .ts dans shared-utils/src
  const files = await glob('packages/shared-utils/src/**/*.ts');

  for (const file of files) {
    const fileName = path.basename(file, '.ts');

    // Créer le mapping automatiquement
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

  // Pattern pour détecter les exports de fonctions (y compris async)
  const functionExportRegex = /export\s+(?:async\s+)?function\s+(\w+)/g;
  let match: RegExpExecArray | null;
  while ((match = functionExportRegex.exec(content)) !== null) {
    exports.push(match[1]);
  }

  // Pattern pour détecter les exports de constantes
  const constExportRegex = /export\s+const\s+(\w+)/g;
  while ((match = constExportRegex.exec(content)) !== null) {
    exports.push(match[1]);
  }

  // Pattern pour détecter les exports nommés
  const namedExportRegex = /export\s*\{\s*([^}]+)\s*\}/g;
  while ((match = namedExportRegex.exec(content)) !== null) {
    const exportList = match[1];
    const exportedItems = exportList.split(',').map((item: string) => {
      // Gérer les exports avec alias (ex: { logInfo as info })
      return item.includes(' as ') ? (item.split(' as ')[0]?.trim() ?? '') : item.trim();
    });
    exports.push(...exportedItems.filter(item => item && item !== 'type'));
  }

  // Pour les fichiers index.ts avec export *, on ne peut pas détecter les exports
  // mais on peut indiquer qu'il y a des exports
  if (content.includes('export * from')) {
    // On retourne un marqueur spécial pour indiquer qu'il y a des exports
    exports.push('*');
  }

  return exports;
}

async function inlineSharedUtils(): Promise<void> {
  console.log('🔄 Inlining shared utilities...');

  // Détecter automatiquement tous les mappings
  const importMappings = await autoDetectAllMappings();
  console.log(`📋 Detected ${importMappings.length} modules to inline`);

  // Détecter automatiquement tous les consommateurs
  console.log('🔍 Detecting consumers...');
  const consumers = await autoDetectConsumers();
  console.log(`📦 Found ${consumers.length} consumers`);

  for (const consumer of consumers) {
    if (!existsSync(consumer)) {
      console.log(`⏭️  Skipping ${consumer} (not found)`);
      continue;
    }

    console.log(`📦 Processing ${consumer}...`);

    // Créer le dossier de destination
    const targetDir = `${consumer}/src/utils/shared`;
    mkdirSync(targetDir, { recursive: true });

    // Analyser les fichiers source pour détecter les imports
    const sourceFiles = await glob(`${consumer}/**/*.{ts,js}`, {
      ignore: ['**/node_modules/**', '**/dist/**', '**/template/**'],
    });

    const usedFiles = new Set<string>();

    for (const file of sourceFiles) {
      const content = readFileSync(file, 'utf-8');

      // Détecter les imports de shared-utils
      for (const mapping of importMappings) {
        if (content.includes(mapping.from)) {
          // Extraire les fonctions importées
          const importedFunctions = extractImportedFunctions(content, mapping.from);

          // Déterminer quels fichiers copier
          for (const func of importedFunctions) {
            if (mapping.functions.includes(func)) {
              // Extraire le nom du fichier du mapping
              const fileName = mapping.from.split('/').pop() + '.ts';
              usedFiles.add(fileName);
            }
          }
        }
      }
    }

    // Copier les fichiers utilisés
    for (const file of Array.from(usedFiles)) {
      const sourceFile = `${SHARED_UTILS}/${file}`;
      const targetFile = `${targetDir}/${file}`;

      if (existsSync(sourceFile)) {
        copyFileSync(sourceFile, targetFile);
        console.log(`  ✅ Copied ${file}`);
      }
    }

    // Mettre à jour les imports dans les fichiers source
    for (const file of sourceFiles) {
      let content = readFileSync(file, 'utf-8');
      let modified = false;

      for (const mapping of importMappings) {
        if (content.includes(mapping.from)) {
          // Calculer le chemin relatif correct
          const relativePath = path.relative(path.dirname(file), `${consumer}/src/utils/shared`);
          const normalizedPath = relativePath.startsWith('.') ? relativePath : `./${relativePath}`;

          // Déterminer le nom du fichier à importer automatiquement
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

  // Pattern pour détecter les imports nommés
  const namedImportRegex = new RegExp(
    `import\\s*\\{([^}]+)\\}\\s*from\\s*['"]${importPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`,
    'g'
  );

  let match: RegExpExecArray | null;
  while ((match = namedImportRegex.exec(content)) !== null) {
    const importList = match[1];
    const importedItems = importList.split(',').map((item: string) => item.trim());

    for (const item of importedItems) {
      // Gérer les imports avec alias (ex: { logInfo as info })
      const functionName = item.includes(' as ')
        ? (item.split(' as ')[0]?.trim() ?? '')
        : item.trim();

      if (functionName && functionName !== 'type') {
        functions.push(functionName);
      }
    }
  }

  // Pattern pour détecter les imports par défaut
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

// Exécuter le script
if (import.meta.url === `file://${process.argv[1]}`) {
  inlineSharedUtils().catch(console.error);
}
