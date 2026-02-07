import fs from 'fs/promises';
import fsExtra from 'fs-extra';
import path from 'path';

interface PatchProjectOptions {
  projectPath: string;
  packageName: string;
  projectName: string;
}

export async function patchProjectJson(options: PatchProjectOptions): Promise<void> {
  const projectJsonPath = path.join(options.projectPath, 'project.json');
  const webProjectJsonPath = path.join(options.projectPath, 'apps', 'web', 'project.json');

  if (await fsExtra.pathExists(projectJsonPath)) {
    let projectJsonContent = await fs.readFile(projectJsonPath, 'utf-8');
    projectJsonContent = projectJsonContent.replace(/\{\{projectName\}\}/g, options.projectName);
    projectJsonContent = projectJsonContent.replace(
      /@vite-powerflow\/starter/g,
      options.projectName
    );
    projectJsonContent = projectJsonContent.replace(
      /@vite-powerflow\/starter:build/g,
      `${options.projectName}:build`
    );
    await fs.writeFile(projectJsonPath, projectJsonContent);
  }

  if (await fsExtra.pathExists(webProjectJsonPath)) {
    let webProjectJsonContent = await fs.readFile(webProjectJsonPath, 'utf-8');
    webProjectJsonContent = webProjectJsonContent.replace(
      /\{\{projectName\}\}/g,
      options.projectName
    );
    webProjectJsonContent = webProjectJsonContent.replace(
      /"name":\s*"@vite-powerflow\/starter"/,
      `"name": "@${options.packageName}/web"`
    );
    webProjectJsonContent = webProjectJsonContent.replace(
      /@vite-powerflow\/starter-web/g,
      `@${options.packageName}/web`
    );
    webProjectJsonContent = webProjectJsonContent.replace(
      /@template-app\/starter-web/g,
      `@${options.packageName}/web`
    );
    webProjectJsonContent = webProjectJsonContent.replace(
      /@vite-powerflow\/starter-web:build/g,
      `@${options.packageName}/web:build`
    );
    webProjectJsonContent = webProjectJsonContent.replace(
      /@template-app\/starter-web:build/g,
      `@${options.packageName}/web:build`
    );
    webProjectJsonContent = webProjectJsonContent.replace(
      /@vite-powerflow\/starter-web:serve/g,
      `@${options.packageName}/web:serve`
    );
    webProjectJsonContent = webProjectJsonContent.replace(
      /@template-app\/starter-web:serve/g,
      `@${options.packageName}/web:serve`
    );
    webProjectJsonContent = webProjectJsonContent.replace(
      /test-app:build/g,
      `@${options.packageName}/web:build`
    );
    webProjectJsonContent = webProjectJsonContent.replace(
      /test-app:serve/g,
      `@${options.packageName}/web:serve`
    );
    await fs.writeFile(webProjectJsonPath, webProjectJsonContent);
  }
}
