import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

interface ProjectInfo {
  projectName: string;
  description: string;
  author: string;
}

/**
 * Generates a README file for a new project by using the readme-lite.md template
 * and replacing placeholders with project-specific information.
 *
 * @param info Project information to inject into the template
 * @returns Generated README content as a string
 */
export function generateReadme(info: ProjectInfo): string {
  // Calculate the path to the template directory using import.meta.url
  const currentFilePath = fileURLToPath(import.meta.url);
  const currentDir = path.dirname(currentFilePath);
  const templatePath = path.join(currentDir, '..', 'templates', 'readme-lite.md');

  // Load the template from the templates directory
  const template = fs.readFileSync(templatePath, 'utf-8');

  // Replace placeholders with project-specific information
  return template
    .replace(/\{\{projectName\}\}/g, info.projectName)
    .replace(/\{\{description\}\}/g, info.description)
    .replace(/\{\{author\}\}/g, info.author);
}
