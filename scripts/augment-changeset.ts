import { execSync } from 'child_process';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';

// Use the compiled JS from the extension package to ensure CI/runtime compatibility
// Self-contained parsing utilities to avoid build/runtime coupling in CI
const CHANGESET_REGEX = /^---\s*\n([\s\S]*?)\n---/;

function parseChangesetFrontmatter(content: string): Map<string, string> {
  const match = CHANGESET_REGEX.exec(content);
  const frontmatter = new Map<string, string>();

  if (match?.[1]) {
    const frontmatterStr = match[1];
    frontmatterStr.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.includes(':')) {
        const colonIndex = trimmedLine.indexOf(':');
        const key = trimmedLine.substring(0, colonIndex).trim().replace(/'/g, '').replace(/"/g, '');
        const value = trimmedLine
          .substring(colonIndex + 1)
          .trim()
          .replace(/'/g, '')
          .replace(/"/g, '');
        if (key && value) {
          frontmatter.set(key, value);
        }
      }
    });
  }

  return frontmatter;
}

function extractMetadataAfterFrontmatter(content: string): { anchor?: string; baseline?: string } {
  const start = content.indexOf('---');
  if (start !== 0) return {};

  const end = content.indexOf('---', 3);
  if (end === -1) return {};

  const afterFrontmatter = content.substring(end + 3);
  const lines = afterFrontmatter.split('\n');

  let anchor: string | undefined;
  let baseline: string | undefined;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '' || trimmed.startsWith('#')) {
      break;
    }
    if (trimmed.startsWith('anchor:')) {
      anchor = trimmed.replace('anchor:', '').trim();
    }
    if (trimmed.startsWith('baseline:')) {
      baseline = trimmed.replace('baseline:', '').trim();
    }
  }

  return { anchor, baseline };
}

interface ConsoleOutput {
  appendLine(v: string): void;
}

const consoleChannel: ConsoleOutput = { appendLine: (v: string) => console.log(v) };
const CHANGESET_DIR = '.changeset';
const STARTER_PACKAGE = '@vite-powerflow/starter';

function serializeFrontmatter(packageMap: Map<string, string>): string {
  const entries = Array.from(packageMap.entries());
  const pkgEntries = entries.filter(([k]) => k.startsWith('@'));
  pkgEntries.sort(([a], [b]) => a.localeCompare(b));
  const lines: string[] = [];
  for (const [k, v] of pkgEntries) {
    lines.push(`'${k}': ${v}`);
  }
  return ['---', ...lines, '---'].join('\n') + '\n';
}

function getChangesetFiles(repoRoot: string): string[] {
  const dir = path.join(repoRoot, CHANGESET_DIR);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir);
  return files.filter(f => f.endsWith('.md') && f !== 'README.md').map(f => path.join(dir, f));
}

function gitLogLastShaForFile(repoRoot: string, filePath: string): string | undefined {
  try {
    const rel = path.relative(repoRoot, filePath);
    const out = execSync(`git log -n 1 --pretty=%H -- ${rel}`, {
      cwd: repoRoot,
      encoding: 'utf-8',
      stdio: 'pipe',
    }).trim();
    return out || undefined;
  } catch {
    return undefined;
  }
}

function readStarterBaseline(repoRoot: string, out: ConsoleOutput): string | undefined {
  try {
    const templatePkgPath = path.join(repoRoot, 'packages/cli/template/package.json');
    const content = fs.readFileSync(templatePkgPath, 'utf-8');
    const json = JSON.parse(content) as { starterSource?: { commit?: string } };
    if (json.starterSource?.commit) return json.starterSource.commit;
    out.appendLine('ℹ️ augment-changeset: starterSource.commit not found (baseline omitted).');
    return undefined;
  } catch (e) {
    if (e instanceof Error) {
      out.appendLine(`ℹ️ augment-changeset: could not read starter baseline: ${e.message}`);
    } else {
      out.appendLine('ℹ️ augment-changeset: could not read starter baseline: Unknown error');
    }
    return undefined;
  }
}

async function augmentChangesetFile(repoRoot: string, filePath: string, out: ConsoleOutput) {
  const raw = await fsp.readFile(filePath, 'utf-8');

  // Use extension functions to parse frontmatter
  const packageMap = parseChangesetFrontmatter(raw);
  if (packageMap.size === 0) {
    out.appendLine(`ℹ️ augment-changeset: skipping (no packages): ${path.basename(filePath)}`);
    return;
  }

  // Extract existing metadata
  const { anchor: existingAnchor, baseline: existingBaseline } =
    extractMetadataAfterFrontmatter(raw);

  // Calculate anchor if necessary
  let anchor = existingAnchor;
  if (!anchor) {
    const sha = gitLogLastShaForFile(repoRoot, filePath);
    if (sha) anchor = sha;
  }

  // Check if the changeset concerns the starter package
  const concernsStarter = packageMap.has(STARTER_PACKAGE);
  let baseline = existingBaseline;
  if (concernsStarter && !baseline) {
    baseline = readStarterBaseline(repoRoot, out);
  }

  // Serialize frontmatter
  const frontmatter = serializeFrontmatter(packageMap);
  let metadata = '';
  if (anchor) metadata += `anchor: ${anchor}\n`;
  if (concernsStarter && baseline) metadata += `baseline: ${baseline}\n`;

  // Reconstruct the file
  const frontmatterEnd = raw.indexOf('---', 3) + 3;
  let body = raw.substring(frontmatterEnd);

  // Remove existing anchor and baseline metadata
  body = body.replace(/^anchor:.*\n?/gm, '');
  body = body.replace(/^baseline:.*\n?/gm, '');

  const newContent = frontmatter + metadata + body;
  await fsp.writeFile(filePath, newContent, 'utf-8');

  out.appendLine(`✓ augment-changeset: updated ${path.basename(filePath)}`);
}

async function main() {
  const repoRoot = process.cwd();
  const files = getChangesetFiles(repoRoot);
  if (files.length === 0) {
    consoleChannel.appendLine('ℹ️ augment-changeset: no changeset files found.');
    return;
  }
  for (const file of files) {
    await augmentChangesetFile(repoRoot, file, consoleChannel);
  }
}

main().catch(err => {
  if (err instanceof Error) {
    console.error('augment-changeset failed:', err.message);
  } else {
    console.error('augment-changeset failed:', err);
  }
  process.exitCode = 1;
});
