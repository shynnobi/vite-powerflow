import fs from 'fs-extra';

/**
 * Copy a config file from source to destination.
 * Optionally transform the file content before writing.
 * Throws if the copy or transform fails.
 */
export async function copyConfigFile(source: string, destination: string): Promise<void> {
  const content = await fs.readFile(source, 'utf8');
  await fs.outputFile(destination, content);
}

/**
 * Copy a config folder from source to destination.
 * Optionally ignore files/folders matching the ignore array.
 * Throws if the copy fails.
 */
export async function copyConfigFolder(
  source: string,
  destination: string,
  options?: { ignore?: string[] }
): Promise<void> {
  await fs.copy(source, destination, {
    filter: srcPath => {
      if (!options?.ignore) return true;
      // Ignore any path that includes an ignored pattern
      return !options.ignore.some(pattern => srcPath.includes(pattern));
    },
  });
}
