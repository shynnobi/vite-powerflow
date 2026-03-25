import {
  updateDevcontainerWorkspaceFolder,
  updateDockerComposeVolume,
} from '../../utils/fs-utils.js';

export async function fixPermissions(targetDir: string): Promise<void> {
  const fsSync = await import('fs');
  const pathMod = await import('path');

  const scriptsDir = pathMod.join(targetDir, 'scripts');
  if (fsSync.existsSync(scriptsDir)) {
    for (const file of fsSync.readdirSync(scriptsDir)) {
      if (file.endsWith('.sh')) {
        try {
          fsSync.chmodSync(pathMod.join(scriptsDir, file), 0o755);
        } catch {}
      }
    }
  }

  const devcontainerScriptsDir = pathMod.join(targetDir, '.devcontainer', 'scripts');
  if (fsSync.existsSync(devcontainerScriptsDir)) {
    for (const file of fsSync.readdirSync(devcontainerScriptsDir)) {
      if (file.endsWith('.sh')) {
        try {
          fsSync.chmodSync(pathMod.join(devcontainerScriptsDir, file), 0o755);
        } catch {}
      }
    }
  }

  const huskyDir = pathMod.join(targetDir, '.husky');
  if (fsSync.existsSync(huskyDir)) {
    for (const file of fsSync.readdirSync(huskyDir)) {
      try {
        fsSync.chmodSync(pathMod.join(huskyDir, file), 0o755);
      } catch {}
    }
  }
}

export async function updateDevcontainerAndDocker(projectPath: string): Promise<void> {
  await updateDevcontainerWorkspaceFolder(projectPath);
  await updateDockerComposeVolume(projectPath);
}

export async function formatConfigFiles(
  projectPath: string,
  filesToFormat: string[]
): Promise<void> {
  if (filesToFormat.length === 0) return;

  const { exec } = await import('child_process');
  await new Promise<void>((resolve, reject) => {
    exec(
      `npx prettier --write ${filesToFormat.map(f => `"${f}"`).join(' ')}`,
      { cwd: projectPath },
      (error, _stdout, stderr) => {
        if (error) {
          reject(new Error(stderr || error.message));
        } else {
          resolve();
        }
      }
    );
  });
}
