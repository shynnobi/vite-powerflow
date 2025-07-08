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
export async function updateDevcontainerWorkspaceFolder(projectDir: string): Promise<string[]> {
  const devcontainerPath = path.join(projectDir, '.devcontainer', 'devcontainer.json');
  const messages: string[] = [];
  try {
    await fs.access(devcontainerPath);
    const devcontainer = JSON.parse(await fs.readFile(devcontainerPath, 'utf8'));
    const projectName = path.basename(projectDir);
    devcontainer.workspaceFolder = `/workspaces/${projectName}`;
    await fs.writeFile(devcontainerPath, JSON.stringify(devcontainer, null, 2));

    // Format the file with Prettier after modification
    const { exec } = await import('child_process');
    await new Promise<void>((resolve) => {
      exec(`npx prettier --write "${devcontainerPath}"`, (err) => {
        if (err) {
          messages.push('⚠️ Prettier failed to format devcontainer.json');
        } else {
          messages.push('✅ devcontainer.json formatted with Prettier');
        }
        resolve();
      });
    });

    messages.push(`✅ workspaceFolder set to /workspaces/${projectName}`);
  } catch {
    messages.push('⚠️ No devcontainer.json found or failed to update workspaceFolder');
  }
  return messages;
}

/**
 * Update the volume mapping in docker-compose.yml to match the project directory name.
 */
export async function updateDockerComposeVolume(projectDir: string): Promise<string[]> {
  const path = await import('path');
  const fs = await import('fs/promises');
  const composePath = path.join(projectDir, 'docker-compose.yml');
  const messages: string[] = [];
  try {
    await fs.access(composePath);
    const projectName = path.basename(projectDir);
    let content = await fs.readFile(composePath, 'utf8');
    content = content.replace(/workspaces\/vite-powerflow/g, `workspaces/${projectName}`);
    await fs.writeFile(composePath, content);
    messages.push(`✅ docker-compose.yml volume updated to /workspaces/${projectName}`);
  } catch {
    messages.push('⚠️ No docker-compose.yml found or failed to update volume mapping');
  }
  return messages;
}
