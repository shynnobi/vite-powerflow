import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';

export function viteRobotsCopy(): Plugin {
  return {
    name: 'vite-plugin-robots-copy',

    closeBundle() {
      const sourcePath = path.resolve(process.cwd(), '.robots.production.txt');
      const targetPath = path.resolve(process.cwd(), 'dist/robots.txt');

      try {
        if (fs.existsSync(sourcePath)) {
          fs.copyFileSync(sourcePath, targetPath);
          console.log('🤖 Robots.txt copied to dist/robots.txt');
        }
      } catch (error) {
        console.error('❌ Error copying robots.txt:', error);
      }
    },
  };
}
