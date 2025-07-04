import fs from 'fs-extra';

/**
 * Copy a config file from source to destination.
 * Throws if the copy fails.
 */
export async function copyConfigFile(source: string, destination: string): Promise<void> {
  await fs.copy(source, destination, { overwrite: true });
}
