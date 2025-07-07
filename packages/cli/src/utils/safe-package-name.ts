export function safePackageName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_.]/g, '')
    .replace(/^[-_.]+|[-_.]+$/g, '');
}
