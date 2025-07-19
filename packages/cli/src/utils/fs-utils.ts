import fs from 'fs/promises';
import path from 'path';

export async function directoryExists(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Update the workspaceFolder in .devcontainer/devcontainer.json to match the project directory name.
 */
export async function updateDevcontainerWorkspaceFolder(projectDir: string): Promise<void> {
  const devcontainerPath = path.join(projectDir, '.devcontainer', 'devcontainer.json');
  await fs.access(devcontainerPath);
  const devcontainer = JSON.parse(await fs.readFile(devcontainerPath, 'utf8'));
  const projectName = path.basename(projectDir);
  devcontainer.workspaceFolder = `/workspaces/${projectName}`;
  await fs.writeFile(devcontainerPath, JSON.stringify(devcontainer, null, 2));
}

/**
 * Update the volume mapping in docker-compose.yml to match the project directory name.
 */
export async function updateDockerComposeVolume(projectDir: string): Promise<void> {
  const composePath = path.join(projectDir, 'docker-compose.yml');
  await fs.access(composePath);
  const projectName = path.basename(projectDir);
  let content = await fs.readFile(composePath, 'utf8');
  content = content.replace(/workspaces\/vite-powerflow/g, `workspaces/${projectName}`);
  await fs.writeFile(composePath, content);
}
