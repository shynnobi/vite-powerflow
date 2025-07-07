import fs from 'fs-extra';
import path from 'path';

const content = `# Logs
logs
*.log
pnpm-debug.log*
pnpm-error.log*
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Dependency directories
node_modules
.pnpm-store/

# Build outputs
dist
dist-ssr
*.local
.turbo/
packages/cli/template

# Editor directories and files
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
!.vscode/tailwind.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Testing
coverage
playwright-report
test-results

# Environment variables
.env
.env.*
!.env.example

# Cache
.eslintcache
.stylelintcache
.cache
.npm
.temp
.tmp
.tsbuildinfo

# Build visualizer
stats.html

# Binary files
bin/

*storybook.log

# Playwright
playwright-report/
test-results/
playwright-report.json

# Ignore temporary commit message file
/temp_commit_msg.txt
`;

async function main() {
  const targetDir = process.argv[2];
  if (!targetDir) {
    console.error('Usage: tsx generateGitignore.ts <target-directory>');
    process.exit(1);
  }
  const gitignorePath = path.join(targetDir, '.gitignore');
  await fs.writeFile(gitignorePath, content);
  console.log(`✅ .gitignore generated in ${targetDir}`);
}

main();
