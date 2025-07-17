import { findUp } from 'find-up';
import path from 'path';

export async function getMonorepoRoot(): Promise<string> {
  const workspaceFile = await findUp('pnpm-workspace.yaml');
  if (!workspaceFile) {
    throw new Error('pnpm-workspace.yaml not found. Are you in a monorepo?');
  }
  return path.dirname(workspaceFile);
}
