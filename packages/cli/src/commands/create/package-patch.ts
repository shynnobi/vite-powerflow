import fs from 'fs/promises';
import fsExtra from 'fs-extra';
import path from 'path';

interface PackageJson {
  name?: string;
  version?: string;
  private?: boolean;
  author?: string | { name: string; email?: string; url?: string };
  [key: string]: unknown;
}

interface PatchPackageOptions {
  projectPath: string;
  packageName: string;
  projectName: string;
  gitUserName?: string;
  gitUserEmail?: string;
}

export async function patchRootPackageJson(options: PatchPackageOptions): Promise<void> {
  const packageJsonPath = path.join(options.projectPath, 'package.json');

  if (!(await fsExtra.pathExists(packageJsonPath))) return;

  const packageJsonRaw = await fs.readFile(packageJsonPath, 'utf-8');
  const packageJson = JSON.parse(packageJsonRaw) as PackageJson;

  packageJson.name = options.packageName;
  packageJson.version = '0.0.1';
  packageJson.description = '';

  if (options.gitUserName) {
    const author: { name: string; email?: string } = { name: options.gitUserName };
    if (options.gitUserEmail) {
      author.email = options.gitUserEmail;
    }
    packageJson.author = author;
  } else {
    packageJson.author = '';
  }

  delete packageJson.repository;
  delete packageJson.homepage;
  delete packageJson.bugs;
  delete packageJson.keywords;
  delete packageJson.syncConfig;

  if (packageJson.scripts && (packageJson.scripts as any)['web:dev']) {
    (packageJson.scripts as any)['web:dev'] = `pnpm --filter @${options.packageName}/web dev`;
  }

  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

export async function patchWebPackageJson(options: PatchPackageOptions): Promise<void> {
  const webPackageJsonPath = path.join(options.projectPath, 'apps', 'web', 'package.json');

  if (!(await fsExtra.pathExists(webPackageJsonPath))) return;

  const webPackageJsonRaw = await fs.readFile(webPackageJsonPath, 'utf-8');
  const webPackageJson = JSON.parse(webPackageJsonRaw) as PackageJson;

  webPackageJson.name = `@${options.packageName}/web`;
  webPackageJson.version = '0.0.1';

  delete webPackageJson.repository;
  delete webPackageJson.homepage;
  delete webPackageJson.bugs;
  delete webPackageJson.keywords;
  delete webPackageJson.syncConfig;

  await fs.writeFile(webPackageJsonPath, JSON.stringify(webPackageJson, null, 2));
}
