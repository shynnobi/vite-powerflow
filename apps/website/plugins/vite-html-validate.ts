import { readdir, readFile } from 'fs/promises';
import { HtmlValidate } from 'html-validate/node';
import { extname, resolve } from 'path';
import type { Plugin } from 'vite';

interface HtmlValidateOptions {
  outputDir?: string;
  failOnError?: boolean;
}

export default function viteHtmlValidate(options: HtmlValidateOptions = {}): Plugin {
  const { outputDir = 'dist', failOnError = false } = options;

  return {
    name: 'vite-html-validate',
    apply: 'build',

    async closeBundle() {
      console.log('🔍 Starting HTML validation...');

      try {
        const fullOutputDir = resolve(process.cwd(), outputDir);
        const htmlFiles = await findHtmlFiles(fullOutputDir);

        if (htmlFiles.length === 0) {
          console.log('⚠️  No HTML files found to validate');
          return;
        }

        console.log(`📄 Found ${htmlFiles.length} HTML files to validate`);

        const validator = new HtmlValidate({
          extends: ['html-validate:recommended'],
          rules: {
            // Recommended rules are a good start, but some might be too strict
            // for auto-generated code. We can disable them here if needed.
            'doctype-style': 'off', // Vite generates lowercase doctype
            'void-style': 'off', // Vite uses self-closing tags for void elements
            'valid-id': 'off', // PWA plugin generates an ID with a colon
          },
        });

        let totalErrors = 0;
        let totalWarnings = 0;

        for (const htmlFile of htmlFiles) {
          console.log(`\n🔍 Validating: ${htmlFile}`);

          const htmlContent = await readFile(htmlFile, 'utf-8');
          const report = await validator.validateString(htmlContent);

          if (report.valid) {
            console.log('✅ Valid HTML');
          } else {
            console.log('❌ HTML validation issues:');

            report.results.forEach(result => {
              result.messages.forEach(message => {
                const icon = message.severity === 2 ? '❌' : '⚠️';
                console.log(
                  `  ${icon} ${message.message} (line ${message.line}, col ${message.column})`
                );

                if (message.severity === 2) totalErrors++;
                else totalWarnings++;
              });
            });
          }
        }

        console.log(`\n📊 Validation Summary:`);
        console.log(`  Errors: ${totalErrors}`);
        console.log(`  Warnings: ${totalWarnings}`);
        console.log(`  Files validated: ${htmlFiles.length}`);

        if (failOnError && totalErrors > 0) {
          throw new Error(`HTML validation failed with ${totalErrors} errors`);
        }

        console.log('✅ HTML validation completed successfully!');
      } catch (error) {
        console.error('❌ HTML validation failed:', error);

        if (failOnError) {
          throw error;
        }
      }
    },
  };
}

async function findHtmlFiles(dir: string): Promise<string[]> {
  const htmlFiles: string[] = [];

  async function scanDirectory(currentDir: string) {
    try {
      const entries = await readdir(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = resolve(currentDir, entry.name);

        if (entry.isDirectory()) {
          await scanDirectory(fullPath);
        } else if (entry.isFile() && extname(entry.name).toLowerCase() === '.html') {
          htmlFiles.push(fullPath);
        }
      }
    } catch {
      // Skip directories we can't read
      console.warn(`⚠️  Could not read directory: ${currentDir}`);
    }
  }

  await scanDirectory(dir);
  return htmlFiles;
}
