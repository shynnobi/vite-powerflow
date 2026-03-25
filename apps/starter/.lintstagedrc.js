import path from 'path';

export default {
  '*.{js,jsx,ts,tsx,mjs,mts,cjs,cts,json,md,yml,yaml}': files => {
    const relativeFiles = files.map(f => path.relative(process.cwd(), f));
    return [
      `nx affected --target=lint --files=${relativeFiles.join(',')}`,
      `nx format:write --files=${relativeFiles.join(',')}`,
    ];
  },
};
