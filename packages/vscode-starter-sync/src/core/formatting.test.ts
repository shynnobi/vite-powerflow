import { afterAll, beforeEach, describe, expect, test } from 'vitest';

import { CheckResult, PackageLabel } from '../types.js';
import { formatSyncOutput } from './formatting.js';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2025-08-07T16:00:00Z'));
});
afterAll(() => {
  vi.useRealTimers();
});

describe('formatSyncOutput', () => {
  test('should show all packages as synchronized when there are no pending commits or changesets', () => {
    const data = [
      {
        label: PackageLabel.Starter,
        result: {
          status: 'sync',
          message: '',
          commitCount: 0,
          packageVersion: '1.2.0',
          baselineCommit: 'a1b2c3d4e5f6789',
        } as CheckResult,
      },
      {
        label: PackageLabel.Cli,
        result: {
          status: 'sync',
          message: '',
          commitCount: 0,
          packageVersion: '0.8.1',
          baselineCommit: 'd4e5f6g7h8i9012',
        } as CheckResult,
      },
    ];
    expect(formatSyncOutput(data)).toMatchSnapshot();
  });

  test('should warn when there are commits without a corresponding changeset', () => {
    const data = [
      {
        label: PackageLabel.Starter,
        result: {
          status: 'warning',
          message: '',
          commitCount: 3,
          packageVersion: '1.2.0',
          commits: [
            { sha: '1a2b3c4d5e6f789', message: 'feat: add new component system' },
            { sha: '5d6e7f8g9h0i123', message: 'fix: resolve navigation bug' },
            { sha: '9g0h1i2j3k4l567', message: 'docs: update README examples' },
          ],
        } as CheckResult,
      },
      {
        label: PackageLabel.Cli,
        result: {
          status: 'sync',
          message: '',
          commitCount: 0,
          packageVersion: '0.8.1',
          baselineCommit: 'd4e5f6g7h8i9012',
        } as CheckResult,
      },
    ];
    expect(formatSyncOutput(data)).toMatchSnapshot();
  });

  test('should display a pending changeset when commits are present and a changeset is detected', () => {
    const data = [
      {
        label: PackageLabel.Starter,
        result: {
          status: 'pending',
          message: '',
          commitCount: 2,
          packageVersion: '1.2.0',
          changeset: {
            fileName: 'fantastic-dogs-dance.md',
            bumpType: 'minor',
          },
          commits: [
            { sha: '1a2b3c4d5e6f789', message: 'feat: implement new authentication flow' },
            { sha: '5d6e7f8g9h0i123', message: 'fix: handle edge cases in validation' },
          ],
        } as CheckResult,
      },
      {
        label: PackageLabel.Cli,
        result: {
          status: 'warning',
          message: '',
          commitCount: 2,
          packageVersion: '0.8.1',
          commits: [
            { sha: '3j4k5l6m7n8o901', message: 'feat: improve CLI performance' },
            { sha: '7m8n9o0p1q2r345', message: 'fix: handle edge case in parsing' },
          ],
        } as CheckResult,
      },
    ];
    expect(formatSyncOutput(data)).toMatchSnapshot();
  });

  test('should display error messages when check errors occur for one or more packages', () => {
    const data = [
      {
        label: PackageLabel.Starter,
        result: {
          status: 'error',
          message: 'Unable to find baseline commit in git history',
          commitCount: 0,
          packageVersion: '1.2.0',
        } as CheckResult,
      },
      {
        label: PackageLabel.Cli,
        result: {
          status: 'error',
          message: 'Git repository not found or corrupted',
          commitCount: 0,
          packageVersion: '0.8.1',
        } as CheckResult,
      },
    ];
    expect(formatSyncOutput(data)).toMatchSnapshot();
  });

  test('should handle a complex mixed situation with pending changesets and warnings', () => {
    const data = [
      {
        label: PackageLabel.Starter,
        result: {
          status: 'pending',
          message: '',
          commitCount: 1,
          packageVersion: '1.2.0',
          changeset: {
            fileName: 'amazing-cats-jump.md',
            bumpType: 'patch',
          },
          commits: [
            { sha: '1a2b3c4d5e6f789', message: 'fix: critical security vulnerability patch' },
          ],
        } as CheckResult,
      },
      {
        label: PackageLabel.Cli,
        result: {
          status: 'warning',
          message: '',
          commitCount: 8,
          packageVersion: '0.8.1',
          commits: [
            { sha: '1p2q3r4s5t6u789', message: 'feat: add new validation system' },
            { sha: '5s6t7u8v9w0x123', message: 'fix: memory leak in file watcher' },
            { sha: '9v0w1x2y3z4a567', message: 'refactor: simplify config handling' },
            { sha: '3y4z5a6b7c8d901', message: 'test: add comprehensive integration tests' },
            { sha: '7b8c9d0e1f2g345', message: 'docs: update API documentation' },
            { sha: '1e2f3g4h5i6j789', message: 'feat: implement plugin architecture' },
            { sha: '5h6i7j8k9l0m123', message: 'perf: optimize bundling process' },
            { sha: '9k0l1m2n3o4p567', message: 'chore: update all dependencies' },
          ],
        } as CheckResult,
      },
    ];
    expect(formatSyncOutput(data)).toMatchSnapshot();
  });

  test('should display a warning when there are many commits without a changeset (limit case)', () => {
    const data = [
      {
        label: PackageLabel.Starter,
        result: {
          status: 'warning',
          message: '',
          commitCount: 12,
          packageVersion: '1.2.0',
          commits: [
            { sha: '1e2f3g4h5i6j789', message: 'feat: major refactoring of core system' },
            { sha: '5h6i7j8k9l0m123', message: 'feat: add advanced routing capabilities' },
            { sha: '9k0l1m2n3o4p567', message: 'fix: critical security vulnerability' },
            { sha: '3n4o5p6q7r8s901', message: 'fix: performance issues in large datasets' },
            { sha: '7q8r9s0t1u2v345', message: 'feat: implement new authentication flow' },
            { sha: '1t2u3v4w5x6y789', message: 'refactor: modernize codebase structure' },
            { sha: '5w6x7y8z9a0b123', message: 'test: comprehensive test coverage' },
            { sha: '9z0a1b2c3d4e567', message: 'docs: complete API documentation' },
            { sha: '3c4d5e6f7g8h901', message: 'fix: edge cases in error handling' },
            { sha: '7f8g9h0i1j2k345', message: 'feat: add internationalization support' },
            { sha: '1i2j3k4l5m6n789', message: 'chore: update dependencies' },
            { sha: '5l6m7n8o9p0q123', message: 'style: code formatting improvements' },
          ],
        } as CheckResult,
      },
      {
        label: PackageLabel.Cli,
        result: {
          status: 'sync',
          message: '',
          commitCount: 0,
          packageVersion: '0.8.1',
          baselineCommit: 'd4e5f6g7h8i9012',
        } as CheckResult,
      },
    ];
    expect(formatSyncOutput(data)).toMatchSnapshot();
  });

  test('should show a pending changeset when only part of the commits are covered (partial changeset)', () => {
    const data = [
      {
        label: PackageLabel.Starter,
        result: {
          status: 'pending',
          message: '',
          commitCount: 4,
          packageVersion: '1.2.0',
          changeset: {
            fileName: 'strong-garlics-grab.md',
            bumpType: 'minor',
          },
          commits: [
            { sha: '1a2b3c4d5e6f789', message: 'feat: add user management system' },
            { sha: '5d6e7f8g9h0i123', message: 'fix: resolve authentication bug' },
            { sha: '9g0h1i2j3k4l567', message: 'chore: update test configuration' },
            { sha: '3k4l5m6n7o8p901', message: 'docs: update deployment guide' },
          ],
        } as CheckResult,
      },
      {
        label: PackageLabel.Cli,
        result: {
          status: 'pending',
          message: '',
          commitCount: 1,
          packageVersion: '0.8.1',
          changeset: {
            fileName: 'shy-things-stare.md',
            bumpType: 'patch',
          },
          commits: [
            { sha: '7m8n9o0p1q2r345', message: 'fix: handle CLI argument parsing edge case' },
          ],
        } as CheckResult,
      },
    ];
    expect(formatSyncOutput(data)).toMatchSnapshot();
  });

  test('should warn when a package has commits but no version (no packageVersion field)', () => {
    const data = [
      {
        label: PackageLabel.Starter,
        result: {
          status: 'warning',
          message: '',
          commitCount: 2,
          commits: [
            { sha: '1a2b3c4d5e6f789', message: 'feat: initial project setup' },
            { sha: '5d6e7f8g9h0i123', message: 'docs: add initial README' },
          ],
        } as CheckResult,
      },
      {
        label: PackageLabel.Cli,
        result: {
          status: 'sync',
          message: '',
          commitCount: 0,
        } as CheckResult,
      },
    ];
    expect(formatSyncOutput(data)).toMatchSnapshot();
  });

  test('should group packages by the same changeset file for multi-package changesets', () => {
    const data = [
      {
        label: PackageLabel.Starter,
        result: {
          status: 'pending',
          message: '',
          commitCount: 2,
          packageVersion: '1.0.0',
          changeset: {
            fileName: 'auth-system.md',
            bumpType: 'minor',
          },
          commits: [
            { sha: '1a2b3c4d5e6f789', message: 'feat: implement authentication system' },
            { sha: '5d6e7f8g9h0i123', message: 'feat: add user permissions' },
          ],
        } as CheckResult,
      },
      {
        label: PackageLabel.Cli,
        result: {
          status: 'pending',
          message: '',
          commitCount: 1,
          packageVersion: '0.8.1',
          changeset: {
            fileName: 'auth-system.md',
            bumpType: 'patch',
          },
          commits: [{ sha: '3j4k5l6m7n8o901', message: 'fix: CLI auth integration' }],
        } as CheckResult,
      },
    ];
    expect(formatSyncOutput(data)).toMatchSnapshot();
  });

  test('should handle multiple multi-package changesets and group them correctly', () => {
    const data = [
      {
        label: PackageLabel.Starter,
        result: {
          status: 'pending',
          message: '',
          commitCount: 2,
          packageVersion: '1.0.0',
          changeset: {
            fileName: 'auth-system.md',
            bumpType: 'minor',
          },
          commits: [
            { sha: '1a2b3c4d5e6f789', message: 'feat: implement authentication system' },
            { sha: '5d6e7f8g9h0i123', message: 'feat: add user permissions' },
          ],
        } as CheckResult,
      },
      {
        label: PackageLabel.Cli,
        result: {
          status: 'pending',
          message: '',
          commitCount: 3,
          packageVersion: '0.8.1',
          changeset: {
            fileName: 'shared-helpers.md',
            bumpType: 'patch',
          },
          commits: [
            { sha: '3j4k5l6m7n8o901', message: 'fix: CLI helper functions' },
            { sha: '7m8n9o0p1q2r345', message: 'refactor: shared utilities' },
            { sha: '1b2c3d4e5f6g789', message: 'test: add helper tests' },
          ],
        } as CheckResult,
      },
      {
        label: 'Utils' as PackageLabel,
        result: {
          status: 'pending',
          message: '',
          commitCount: 1,
          packageVersion: '0.3.2',
          changeset: {
            fileName: 'auth-system.md',
            bumpType: 'patch',
          },
          commits: [{ sha: '9x0y1z2a3b4c567', message: 'fix: auth utility functions' }],
        } as CheckResult,
      },
      {
        label: 'Types' as PackageLabel,
        result: {
          status: 'pending',
          message: '',
          commitCount: 1,
          packageVersion: '1.1.0',
          changeset: {
            fileName: 'shared-helpers.md',
            bumpType: 'minor',
          },
          commits: [{ sha: '5e6f7g8h9i0j123', message: 'feat: add helper types' }],
        } as CheckResult,
      },
    ];
    expect(formatSyncOutput(data)).toMatchSnapshot();
  });

  test('should prioritize ERROR status over other statuses when present', () => {
    const data = [
      {
        label: PackageLabel.Starter,
        result: {
          status: 'error',
          message: 'Git repository not found',
          commitCount: 0,
          packageVersion: '1.0.0',
        } as CheckResult,
      },
      {
        label: PackageLabel.Cli,
        result: {
          status: 'pending',
          message: '',
          commitCount: 2,
          packageVersion: '0.8.1',
          changeset: {
            fileName: 'awesome-fix.md',
            bumpType: 'patch',
          },
          commits: [
            { sha: '1a2b3c4d5e6f789', message: 'feat: new feature' },
            { sha: '5d6e7f8g9h0i123', message: 'fix: bug fix' },
          ],
        } as CheckResult,
      },
    ];
    expect(formatSyncOutput(data)).toMatchSnapshot();
  });

  test('should prioritize WARNING status over SYNC when no errors are present', () => {
    const data = [
      {
        label: PackageLabel.Starter,
        result: {
          status: 'sync',
          message: '',
          commitCount: 0,
          packageVersion: '1.0.0',
          baselineCommit: 'a1b2c3d4e5f6789',
        } as CheckResult,
      },
      {
        label: PackageLabel.Cli,
        result: {
          status: 'warning',
          message: '',
          commitCount: 3,
          packageVersion: '0.8.1',
          commits: [
            { sha: '1a2b3c4d5e6f789', message: 'feat: needs changeset' },
            { sha: '5d6e7f8g9h0i123', message: 'fix: needs changeset' },
            { sha: '9g0h1i2j3k4l567', message: 'docs: needs changeset' },
          ],
        } as CheckResult,
      },
    ];
    expect(formatSyncOutput(data)).toMatchSnapshot();
  });

  test('should show all packages as synchronized when all statuses are SYNC', () => {
    const data = [
      {
        label: PackageLabel.Starter,
        result: {
          status: 'sync',
          message: '',
          commitCount: 0,
          packageVersion: '1.0.0',
          baselineCommit: 'a1b2c3d4e5f6789',
        } as CheckResult,
      },
      {
        label: PackageLabel.Cli,
        result: {
          status: 'sync',
          message: '',
          commitCount: 0,
          packageVersion: '0.8.1',
          baselineCommit: 'd4e5f6g7h8i9012',
        } as CheckResult,
      },
    ];
    expect(formatSyncOutput(data)).toMatchSnapshot();
  });
});
