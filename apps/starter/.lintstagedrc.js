/**
 * Enterprise-grade lint-staged configuration for Nx monorepos
 * Optimized for Vite PowerFlow starter
 */

const createNxCommand = (target, files) => {
  const relativeFiles = files.map(file => file.replace(process.cwd() + '/', ''));
  return `nx affected --target=${target} --files=${relativeFiles.join(',')}`;
};

const createFormatCommand = files => {
  const relativeFiles = files.map(file => file.replace(process.cwd() + '/', ''));
  return `nx format:write --files=${relativeFiles.join(',')}`;
};

export default {
  // TypeScript files: typecheck + lint + format
  '{src,tests}/**/*.{ts,tsx}': files => createNxCommand('typecheck', files),

  // JavaScript/TypeScript files: lint + format
  '{src,tests}/**/*.{js,ts,jsx,tsx,json}': [
    files => createNxCommand('lint', files),
    files => createFormatCommand(files),
  ],

  // Configuration files: format only
  '*.{json,yml,yaml,md}': files => createFormatCommand(files),
};
