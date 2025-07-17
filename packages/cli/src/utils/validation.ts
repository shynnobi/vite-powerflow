export function validateProjectName(input: string): boolean | string {
  if (!input) {
    return 'Project name is required';
  }

  if (!/^[a-z0-9-]+$/.test(input)) {
    return 'Project name can only contain lowercase letters, numbers, and hyphens';
  }

  if (input.length < 3) {
    return 'Project name must be at least 3 characters long';
  }

  if (input.length > 214) {
    return 'Project name must be less than 214 characters';
  }

  return true;
}
