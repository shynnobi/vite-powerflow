import { execSync } from 'child_process';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';

type Output = { appendLine: (v: string) => void };
const consoleChannel: Output = { appendLine: (v: string) => console.log(v) };

const CHANGESET_DIR = '.changeset';
const STARTER_PACKAGE = '@vite-powerflow/starter';

// Minimal YAML frontmatter parser/serializer for our specific format.
// We expect a frontmatter block like:
// ---
// '@vite-powerflow/starter': patch
// '@vite-powerflow/create': minor
// anchor: <sha>
// baseline: <sha>
// ---
//
// We will parse simple key: value pairs, where package keys may be quoted.
// Values for packages are strings (patch/minor/major). anchor/baseline are strings.
function parseFrontmatter(md: string): { map: Map<string, string>; start: number; end: number } {
  const start = md.indexOf('---');
  if (start !== 0) {
    return { map: new Map(), start: -1, end: -1 };
  }
  const end = md.indexOf('---', 3);
  if (end === -1) {
    return { map: new Map(), start: -1, end: -1 };
  }
  const fmContent = md.substring(3, end).trim();
  const map = new Map<string, string>();
  const lines = fmContent
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  for (const line of lines) {
    // Support quoted keys and unquoted keys
    // e.g. '@vite-powerflow/starter': patch
    // or anchor: abcdef
    const match = line.match(/^('?"?)([^'":]+(?:\/[^'":]+)?)\1\s*:\s*(.+)$/);
    if (match) {
      const keyRaw = match[2].trim();
      let value = match[3].trim();
      // Remove trailing comments or quotes
      value = value.replace(/^['"](.*)['"]$/, '$1').trim();
      map.set(keyRaw, value);
    } else {
      // Also try to match keys with quotes including @-prefixed scoped names
      const m2 = line.match(/^['"]([^'"]+)['"]\s*:\s*(.+)$/);
      if (m2) {
        const key = m2[1].trim();
        let value = m2[2].trim();
        value = value.replace(/^['"](.*)['"]$/, '$1').trim();
        map.set(key, value);
      }
    }
  }
  return { map, start: 0, end: end + 3 };
}

function serializeFrontmatter(map: Map<string, string>): string {
  // Keep packages first (sorted), then anchor/baseline keys for readability.
  const entries = Array.from(map.entries());
  const pkgEntries = entries.filter(([k]) => k.startsWith('@'));
  pkgEntries.sort(([a], [b]) => a.localeCompare(b));
  const metaEntries = entries.filter(([k]) => !k.startsWith('@'));

  const lines: string[] = [];
  for (const [k, v] of pkgEntries) {
    // Quote package keys to be safe
    lines.push(`'${k}': ${v}`);
  }
  for (const [k, v] of metaEntries) {
    lines.push(`${k}: ${v}`);
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

function readStarterBaseline(repoRoot: string, out: Output): string | undefined {
  try {
    const templatePkgPath = path.join(repoRoot, 'packages/cli/template/package.json');
    const content = fs.readFileSync(templatePkgPath, 'utf-8');
    const json = JSON.parse(content) as { starterSource?: { commit?: string } };
    if (json.starterSource?.commit) return json.starterSource.commit;
    out.appendLine('ℹ️ augment-changeset: starterSource.commit not found (baseline omitted).');
    return undefined;
  } catch (e) {
    out.appendLine(
      `ℹ️ augment-changeset: could not read starter baseline: ${(e as Error).message}`
    );
    return undefined;
  }
}

async function processFile(repoRoot: string, filePath: string, out: Output) {
  const raw = await fsp.readFile(filePath, 'utf-8');

  const { map, start, end } = parseFrontmatter(raw);
  if (start !== 0 || end <= 0) {
    out.appendLine(`ℹ️ augment-changeset: skipping (no frontmatter): ${path.basename(filePath)}`);
    return;
  }

  const hadAnchor = map.has('anchor');
  const hadBaseline = map.has('baseline');

  if (!hadAnchor) {
    const sha = gitLogLastShaForFile(repoRoot, filePath);
    if (sha) {
      map.set('anchor', sha);
    } else {
      out.appendLine(
        `ℹ️ augment-changeset: could not resolve anchor for ${path.basename(filePath)} (will skip anchor).`
      );
    }
  }

  // If the changeset concerns the Starter, add baseline from template metadata
  const concernsStarter = map.has(STARTER_PACKAGE);
  if (concernsStarter && !hadBaseline) {
    const baseline = readStarterBaseline(repoRoot, out);
    if (baseline) {
      map.set('baseline', baseline);
    }
  }

  // If nothing to change, return
  if (hadAnchor && (hadBaseline || !concernsStarter)) {
    out.appendLine(`✓ augment-changeset: no changes needed for ${path.basename(filePath)}`);
    return;
  }

  // Rebuild file
  const fm = serializeFrontmatter(map);
  const body = raw.substring(end);
  const next = fm + body;
  await fsp.writeFile(filePath, next, 'utf-8');
  out.appendLine(
    `✓ augment-changeset: updated ${path.basename(filePath)}${hadAnchor ? '' : ' (anchor)'}${concernsStarter && !hadBaseline ? ' (baseline)' : ''}`
  );
}

async function main() {
  const repoRoot = process.cwd();
  const files = getChangesetFiles(repoRoot);
  if (files.length === 0) {
    consoleChannel.appendLine('ℹ️ augment-changeset: no changeset files found.');
    return;
  }
  for (const file of files) {
    await processFile(repoRoot, file, consoleChannel);
  }
}

main().catch(err => {
  console.error('augment-changeset failed:', err);
  process.exitCode = 1;
});
