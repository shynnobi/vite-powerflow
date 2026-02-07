import fs from 'fs/promises';
import fsExtra from 'fs-extra';
import path from 'path';
import { directoryExists } from '../../utils/fs-utils.js';

interface RewriteConfigOptions {
  projectPath: string;
  projectName: string;
}

export async function rewriteReadme(options: RewriteConfigOptions): Promise<void> {
  const readmePath = path.join(options.projectPath, 'README.md');
  if ((await directoryExists(options.projectPath)) && (await fsExtra.pathExists(readmePath))) {
    let readmeContent = await fs.readFile(readmePath, 'utf-8');
    readmeContent = readmeContent.replace(/{{projectName}}/g, options.projectName);
    await fs.writeFile(readmePath, readmeContent);
  }
}

export async function rewriteViteConfig(options: RewriteConfigOptions): Promise<void> {
  const viteConfigPath = path.join(options.projectPath, 'vite.config.ts');
  const webViteConfigPath = path.join(options.projectPath, 'apps', 'web', 'vite.config.ts');

  if (await fsExtra.pathExists(viteConfigPath)) {
    let viteConfigContent = await fs.readFile(viteConfigPath, 'utf-8');
    viteConfigContent = viteConfigContent.replace(/{{projectName}}/g, options.projectName);
    viteConfigContent = viteConfigContent.replace(/starter/g, options.projectName);
    await fs.writeFile(viteConfigPath, viteConfigContent);
  }

  if (await fsExtra.pathExists(webViteConfigPath)) {
    let webViteConfigContent = await fs.readFile(webViteConfigPath, 'utf-8');
    webViteConfigContent = webViteConfigContent.replace(/{{projectName}}/g, options.projectName);
    webViteConfigContent = webViteConfigContent.replace(/starter/g, options.projectName);
    await fs.writeFile(webViteConfigPath, webViteConfigContent);
  }
}

export async function rewriteVitestConfig(options: RewriteConfigOptions): Promise<void> {
  const vitestConfigPath = path.join(options.projectPath, 'vitest.config.ts');
  const webVitestConfigPath = path.join(options.projectPath, 'apps', 'web', 'vitest.config.ts');

  if (await fsExtra.pathExists(vitestConfigPath)) {
    let vitestConfigContent = await fs.readFile(vitestConfigPath, 'utf-8');
    vitestConfigContent = vitestConfigContent.replace(/starter/g, options.projectName);
    await fs.writeFile(vitestConfigPath, vitestConfigContent);
  }

  if (await fsExtra.pathExists(webVitestConfigPath)) {
    let webVitestConfigContent = await fs.readFile(webVitestConfigPath, 'utf-8');
    webVitestConfigContent = webVitestConfigContent.replace(/starter/g, options.projectName);
    await fs.writeFile(webVitestConfigPath, webVitestConfigContent);
  }
}
