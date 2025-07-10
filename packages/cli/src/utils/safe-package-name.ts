import slugify from '@sindresorhus/slugify';

export function safePackageName(name: string): string {
  return slugify(name);
}
