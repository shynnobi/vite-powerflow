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

  const webReadmePath = path.join(options.projectPath, 'apps', 'web', 'README.md');
  if (await fsExtra.pathExists(webReadmePath)) {
    let webReadmeContent = await fs.readFile(webReadmePath, 'utf-8');
    webReadmeContent = webReadmeContent.replace(/{{projectName}}/g, options.projectName);
    await fs.writeFile(webReadmePath, webReadmeContent);
  }
}

export async function rewriteViteConfig(options: RewriteConfigOptions): Promise<void> {
  const webViteConfigPath = path.join(options.projectPath, 'apps', 'web', 'vite.config.ts');

  if (await fsExtra.pathExists(webViteConfigPath)) {
    let webViteConfigContent = await fs.readFile(webViteConfigPath, 'utf-8');
    webViteConfigContent = webViteConfigContent.replace(/{{projectName}}/g, options.projectName);
    webViteConfigContent = webViteConfigContent.replace(/starter/g, options.projectName);
    await fs.writeFile(webViteConfigPath, webViteConfigContent);
  }
}

export async function rewriteVitestConfig(options: RewriteConfigOptions): Promise<void> {
  const webVitestConfigPath = path.join(options.projectPath, 'apps', 'web', 'vitest.config.ts');

  if (await fsExtra.pathExists(webVitestConfigPath)) {
    let webVitestConfigContent = await fs.readFile(webVitestConfigPath, 'utf-8');
    webVitestConfigContent = webVitestConfigContent.replace(/starter/g, options.projectName);
    await fs.writeFile(webVitestConfigPath, webVitestConfigContent);
  }
}
