import * as path from 'path';
import * as vscode from 'vscode';

import { readLatestChangeset } from './changesetReader.js';
import { handleSyncError } from './errorHandler.js';
import { getCommitsSince, getCurrentCommit, getFilesChangedSince } from './gitCommands.js';
import { getTemplateBaseline, resolveRefToSha } from './gitStatus.js';
import { readLatestNpmVersion, readPackageInfo } from './packageReader.js';
import { CheckResult, PackageLabel, SyncCheckConfig, SyncCheckError } from './types.js';

export async function checkSyncStatus(
  config: SyncCheckConfig,
  workspaceRoot: string,
  outputChannel: vscode.OutputChannel
): Promise<CheckResult> {
  const baseline = await config.baseline();
  if (!baseline || baseline === 'unknown') {
    return {
      status: 'error',
      message: config.messages.notFound,
      commitCount: 0,
    };
  }

  const currentCommit = getCurrentCommit(workspaceRoot);
  const newCommitsRaw = getCommitsSince(
    workspaceRoot,
    baseline,
    currentCommit,
    config.commitPath,
    outputChannel
  );
  const newCommits = newCommitsRaw.map(line => {
    const [sha, ...msgParts] = line.split(' ');
    return { sha: sha?.substring(0, 7) || '', message: msgParts.join(' ') };
  });

  let packageVersion: string | undefined;
  try {
    if (config.label === PackageLabel.Starter) {
      const templatePackagePath = path.join(workspaceRoot, 'packages/cli/template/package.json');
      const templatePkg = await readPackageInfo(templatePackagePath);
      packageVersion = templatePkg?.version;
    } else if (config.label === PackageLabel.Cli) {
      const cliPackagePath = path.join(workspaceRoot, 'packages/cli/package.json');
      const cliPkg = await readPackageInfo(cliPackagePath);
      packageVersion = cliPkg?.version;
    }
  } catch {}

  if (newCommits.length > 0) {
    if (config.targetPackage) {
      const latestChangeset = await readLatestChangeset(workspaceRoot, config.targetPackage);

      const filesChangedSinceBaseline = getFilesChangedSince(
        workspaceRoot,
        baseline,
        config.commitPath,
        outputChannel
      );

      let anchorForDiff: string | undefined = undefined;
      let coveredCommits: { sha: string; message: string }[] = [];
      let outsideCommits: { sha: string; message: string }[] = [];
      let filesChangedAfterChangeset: string[] = [];
      if (latestChangeset) {
        type ChangesetWithOptionalAnchor = typeof latestChangeset & { anchor?: unknown };
        const { anchor } = latestChangeset as ChangesetWithOptionalAnchor;
        anchorForDiff =
          typeof anchor === 'string' && anchor.length > 0 ? anchor : latestChangeset.lastCommitSha;
        if (anchorForDiff) {
          const coveredRaw = getCommitsSince(
            workspaceRoot,
            baseline,
            anchorForDiff,
            config.commitPath,
            outputChannel
          );
          coveredCommits = coveredRaw.map(line => {
            const [sha, ...msg] = line.split(' ');
            return { sha: sha?.substring(0, 7) || '', message: msg.join(' ') };
          });
          const outsideRaw = getCommitsSince(
            workspaceRoot,
            anchorForDiff,
            currentCommit,
            config.commitPath,
            outputChannel
          );
          outsideCommits = outsideRaw.map(line => {
            const [sha, ...msg] = line.split(' ');
            return { sha: sha?.substring(0, 7) || '', message: msg.join(' ') };
          });
          filesChangedAfterChangeset = getFilesChangedSince(
            workspaceRoot,
            anchorForDiff,
            config.commitPath,
            outputChannel
          );
        }
      }

      if (!latestChangeset) {
        if (filesChangedSinceBaseline.length === 0) {
          return {
            status: 'pending',
            message: config.messages.unreleased,
            commitCount: newCommits.length,
            packageVersion,
            baselineCommit: baseline,
            currentCommit,
            commits: newCommits,
          };
        }
        return {
          status: 'warning',
          message: '',
          commitCount: newCommits.length,
          packageVersion,
          baselineCommit: baseline,
          currentCommit,
          commits: newCommits,
        };
      } else {
      }
      const normalizedAnchor =
        anchorForDiff && /^[0-9a-f]{40}$/i.test(anchorForDiff)
          ? anchorForDiff
          : anchorForDiff
            ? resolveRefToSha(workspaceRoot, anchorForDiff, outputChannel)
            : undefined;
      const filesChangedAfterNormalizedAnchor = normalizedAnchor
        ? getFilesChangedSince(workspaceRoot, normalizedAnchor, config.commitPath, outputChannel)
        : filesChangedAfterChangeset;

      if (filesChangedAfterNormalizedAnchor.length > 0) {
        return {
          status: 'warning',
          message: '',
          commitCount: newCommits.length,
          packageVersion,
          baselineCommit: baseline,
          currentCommit,
          commits: newCommits,
          changeset: { fileName: latestChangeset.fileName, bumpType: latestChangeset.bumpType },
          coveredCommits,
          notCoveredCommits: outsideCommits,
        };
      }

      if (
        anchorForDiff &&
        filesChangedSinceBaseline.length > 0 &&
        filesChangedAfterNormalizedAnchor.length === 0
      ) {
      }

      if (filesChangedSinceBaseline.length === 0) {
        return {
          status: 'pending',
          message: config.messages.unreleased,
          commitCount: newCommits.length,
          packageVersion,
          baselineCommit: baseline,
          currentCommit,
          commits: newCommits,
        };
      }

      return {
        status: 'pending',
        message: `Changeset found: ${latestChangeset.fileName} (${latestChangeset.bumpType})`,
        commitCount: newCommits.length,
        packageVersion,
        baselineCommit: baseline,
        currentCommit,
        commits: newCommits,
        changeset: { fileName: latestChangeset.fileName, bumpType: latestChangeset.bumpType },
        coveredCommits: coveredCommits,
        notCoveredCommits: [],
      };
    }

    return {
      status: 'pending',
      message: config.messages.unreleased,
      commitCount: newCommits.length,
      packageVersion,
      baselineCommit: baseline,
      currentCommit,
      commits: newCommits,
    };
  }
  return {
    status: 'sync',
    message: config.messages.inSync,
    commitCount: 0,
    packageVersion,
    baselineCommit: baseline,
    currentCommit,
  };
}

export async function checkStarterSync(
  workspaceRoot: string,
  outputChannel: vscode.OutputChannel
): Promise<CheckResult> {
  const config: SyncCheckConfig = {
    label: PackageLabel.Starter,
    baseline: () => Promise.resolve(getTemplateBaseline(workspaceRoot, outputChannel)),
    commitPath: 'apps/starter/',
    targetPackage: '@vite-powerflow/starter',
    messages: {
      notFound: 'Template baseline commit not found in CLI template (package.json).',
      inSync: 'In sync with the latest CLI template baseline.',
      unreleased: 'unreleased change(s).',
      errorPrefix: 'Error during sync check',
    },
  };

  try {
    return await checkSyncStatus(config, workspaceRoot, outputChannel);
  } catch (error) {
    const syncError = error instanceof Error ? error : new Error(String(error));
    return handleSyncError(config, syncError, outputChannel);
  }
}

export async function checkCliSync(
  workspaceRoot: string,
  outputChannel: vscode.OutputChannel
): Promise<CheckResult> {
  try {
    const cliPackagePath = path.join(workspaceRoot, 'packages/cli/package.json');
    const cliPkg = await readPackageInfo(cliPackagePath);

    if (!cliPkg) {
      throw new SyncCheckError('CLI package.json not found.');
    }

    const latestPublishedVersion = readLatestNpmVersion(cliPkg.name, outputChannel);

    if (!latestPublishedVersion) {
      const message = 'Not published on npm yet.';
      return {
        status: 'sync',
        message,
        commitCount: 0,
        packageVersion: cliPkg.version,
        baselineCommit: undefined,
        currentCommit: getCurrentCommit(workspaceRoot),
      };
    }

    const cliNpmTag = `${cliPkg.name}@${latestPublishedVersion}`;
    const baselineSha = resolveRefToSha(workspaceRoot, cliNpmTag, outputChannel) ?? cliNpmTag;

    const config: SyncCheckConfig = {
      label: PackageLabel.Cli,
      baseline: () => Promise.resolve(baselineSha),
      commitPath: 'packages/cli/',
      targetPackage: '@vite-powerflow/create',
      messages: {
        notFound: 'No published CLI tag found on npm.',
        inSync: `All CLI changes since ${cliNpmTag} have been published.`,
        unreleased: 'unreleased CLI changes found.',
        errorPrefix: 'CLI status check failed',
      },
    };

    return await checkSyncStatus(config, workspaceRoot, outputChannel);
  } catch (error) {
    const syncError = error instanceof Error ? error : new Error(String(error));
    return handleSyncError(
      {
        label: PackageLabel.Cli,
        baseline: () => Promise.resolve(''),
        commitPath: '',
        messages: {
          notFound: '',
          inSync: '',
          unreleased: '',
          errorPrefix: 'Error during sync check',
        },
      },
      syncError,
      outputChannel
    );
  }
}
