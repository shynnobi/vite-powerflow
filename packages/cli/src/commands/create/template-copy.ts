import fsExtra from 'fs-extra';
import path from 'path';

export async function resolveTemplatePath(baseDir: string): Promise<string> {
  // After build: dist/index.js is in dist/, so template is in dist/template/
  // During development: src/commands/create.ts is in src/commands/, so we need to go up to packages/cli/template/
  let templatePath = path.join(baseDir, '..', '..', 'template');

  if (!(await fsExtra.pathExists(templatePath))) {
    // In bundled/distributed case, template should be alongside dist/index.js
    templatePath = path.join(baseDir, 'template');
  }

  return templatePath;
}

export async function copyTemplate(templatePath: string, projectPath: string): Promise<void> {
  await fsExtra.copy(templatePath, projectPath);
}

export async function renameGitignore(projectPath: string): Promise<boolean> {
  const gitignorePath = path.join(projectPath, 'gitignore');
  const dotGitignorePath = path.join(projectPath, '.gitignore');

  if (await fsExtra.pathExists(gitignorePath)) {
    await fsExtra.move(gitignorePath, dotGitignorePath);
    return true;
  }

  return false;
}

export async function renameVscodeFolder(projectPath: string): Promise<void> {
  const underscoreVscodePath = path.join(projectPath, '_vscode');
  const dotVscodePath = path.join(projectPath, '.vscode');

  if (await fsExtra.pathExists(underscoreVscodePath)) {
    if (await fsExtra.pathExists(dotVscodePath)) {
      await fsExtra.remove(dotVscodePath);
    }
    await fsExtra.move(underscoreVscodePath, dotVscodePath, { overwrite: true });
    if (await fsExtra.pathExists(underscoreVscodePath)) {
      await fsExtra.remove(underscoreVscodePath);
    }
  }
}
