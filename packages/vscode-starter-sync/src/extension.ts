import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

let outputChannel: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext) {
  outputChannel = vscode.window.createOutputChannel('Vite Powerflow');
  outputChannel.appendLine('Vite Powerflow extension activated.');

  // Commande simple pour tester la logique
  const command = vscode.commands.registerCommand(
    'vitePowerflow.showStarterSyncStatus',
    async () => {
      await checkIfStarterIsOutOfSync();
    }
  );

  context.subscriptions.push(command);
}

export function deactivate() {}

async function checkIfStarterIsOutOfSync() {
  try {
    outputChannel.appendLine('=== CHECKING STARTER SYNC ===');

    // 1. Vérifier qu'on est dans le bon repo
    const workspaceRoot = getWorkspaceRoot();
    if (!workspaceRoot) {
      outputChannel.appendLine('❌ Not in Vite Powerflow workspace');
      return;
    }

    // 2. Récupérer le commit associé au tag CLI 1.0.5
    const cliTag = '@vite-powerflow/create@1.0.5';
    const tagCommit = getCommitFromTag(workspaceRoot, cliTag);
    outputChannel.appendLine(`🏷️ CLI tag ${cliTag} commit: ${tagCommit}`);

    // 3. Récupérer le dernier commit actuel
    const currentCommit = getCurrentCommit(workspaceRoot);
    outputChannel.appendLine(`📍 Current commit: ${currentCommit}`);

    // 4. Vérifier si il y a des commits affectant le starter depuis le tag
    const starterCommitsSinceTag = getStarterCommitsSinceTag(
      workspaceRoot,
      tagCommit,
      currentCommit
    );
    outputChannel.appendLine(`🎯 Starter commits since tag: ${starterCommitsSinceTag.length}`);

    if (starterCommitsSinceTag.length > 0) {
      outputChannel.appendLine('📝 Starter commits:');
      starterCommitsSinceTag.forEach(commit => {
        outputChannel.appendLine(`  - ${commit}`);
      });
    }

    // 5. Récupérer le commit de référence du template publié (pour comparaison)
    const publishedTemplateCommit = getPublishedTemplateCommit(workspaceRoot);
    outputChannel.appendLine(`📦 Published template commit: ${publishedTemplateCommit}`);

    // 6. Analyser la situation
    const isOutOfSync = starterCommitsSinceTag.length > 0;

    outputChannel.appendLine('=== RESULT ===');
    outputChannel.appendLine(`🔄 Starter is out of sync: ${isOutOfSync}`);

    if (isOutOfSync) {
      outputChannel.appendLine(
        `🚨 ACTION NEEDED: ${starterCommitsSinceTag.length} starter commits need changeset`
      );
    } else {
      outputChannel.appendLine('✅ Starter is synchronized with last CLI release');
    }

    // 7. Préparer l'injection du commit dans le template
    outputChannel.appendLine('=== TEMPLATE UPDATE SUGGESTION ===');
    outputChannel.appendLine(`💡 Template should reference tag commit: ${tagCommit}`);
    outputChannel.appendLine(`💡 Current template references: ${publishedTemplateCommit}`);

    outputChannel.show();
  } catch (error) {
    outputChannel.appendLine(`❌ Error: ${error}`);
    outputChannel.show();
  }
}

function getWorkspaceRoot(): string | null {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) return null;

  const root = workspaceFolder.uri.fsPath;
  const starterPath = path.join(root, 'apps/starter');
  const templatePath = path.join(root, 'packages/cli/template');

  if (fs.existsSync(starterPath) && fs.existsSync(templatePath)) {
    return root;
  }
  return null;
}

function getCurrentCommit(workspaceRoot: string): string {
  return execSync('git rev-parse HEAD', {
    encoding: 'utf-8',
    cwd: workspaceRoot,
  }).trim();
}

function getCommitFromTag(workspaceRoot: string, tagName: string): string {
  try {
    // Récupérer le commit associé au tag
    const commit = execSync(`git rev-list -n 1 ${tagName}`, {
      encoding: 'utf-8',
      cwd: workspaceRoot,
    }).trim();

    return commit;
  } catch (error) {
    outputChannel.appendLine(`⚠️ Error getting commit from tag ${tagName}: ${error}`);

    // Fallback: essayer de lister les tags disponibles
    try {
      const tags = execSync('git tag -l "*create*"', {
        encoding: 'utf-8',
        cwd: workspaceRoot,
      }).trim();
      outputChannel.appendLine(`📋 Available CLI tags: ${tags}`);
    } catch (listError) {
      outputChannel.appendLine(`⚠️ Could not list tags: ${listError}`);
    }

    return 'unknown';
  }
}

function getStarterCommitsSinceTag(
  workspaceRoot: string,
  tagCommit: string,
  currentCommit: string
): string[] {
  try {
    if (tagCommit === 'unknown') {
      outputChannel.appendLine('⚠️ Cannot check commits since unknown tag');
      return [];
    }

    // Récupérer tous les commits affectant le starter depuis le tag
    const commits = execSync(`git log ${tagCommit}..${currentCommit} --oneline -- apps/starter/`, {
      encoding: 'utf-8',
      cwd: workspaceRoot,
    }).trim();

    if (!commits) return [];

    return commits.split('\n').filter(line => line.trim());
  } catch (error) {
    outputChannel.appendLine(`⚠️ Error getting starter commits: ${error}`);
    return [];
  }
}

function getPublishedTemplateCommit(workspaceRoot: string): string {
  try {
    const templatePackagePath = path.join(workspaceRoot, 'packages/cli/template/package.json');
    const templatePackage = JSON.parse(fs.readFileSync(templatePackagePath, 'utf-8'));

    if (templatePackage.starterSource && templatePackage.starterSource.commit) {
      return templatePackage.starterSource.commit;
    }

    outputChannel.appendLine('⚠️ No starterSource.commit found in template package.json');
    return 'unknown';
  } catch (error) {
    outputChannel.appendLine(`❌ Error reading template package: ${error}`);
    return 'unknown';
  }
}
