import { getExtensionBaseline, getTemplateBaseline } from '../core/gitStatus';
import { PackageLabel } from '../core/types';

// Configuration for standard npm-published packages
export interface NpmPackageConfig {
  label: PackageLabel;
  pkgName: string;
  pkgPath: string;
  commitPath: string;
}

export const MONITORED_NPM_PACKAGES: NpmPackageConfig[] = [
  {
    label: PackageLabel.Cli,
    pkgName: '@vite-powerflow/create',
    pkgPath: 'packages/cli/package.json',
    commitPath: 'packages/cli/',
  },
  {
    label: PackageLabel.Utils,
    pkgName: '@vite-powerflow/utils',
    pkgPath: 'packages/utils/package.json',
    commitPath: 'packages/utils/',
  },
];

// Configuration for special case packages with custom logic/messages
export const SPECIAL_PACKAGE_CONFIGS = {
  starter: {
    label: PackageLabel.Starter,
    baseline: getTemplateBaseline,
    commitPath: 'apps/starter/',
    targetPackage: '@vite-powerflow/starter',
    messages: {
      notFound: 'Template baseline commit not found in CLI template (package.json).',
      inSync: 'In sync with the latest CLI template baseline.',
      unreleased: 'unreleased change(s).',
      errorPrefix: 'Error during sync check',
    },
  },
  extension: {
    label: PackageLabel.Extension,
    baseline: getExtensionBaseline,
    commitPath: 'packages/vite-powerflow-sync/',
    targetPackage: 'vite-powerflow-sync',
    messages: {
      notFound: 'Extension baseline commit not found.',
      inSync: 'Extension in sync with latest commit.',
      unreleased: 'unreleased change(s).',
      errorPrefix: 'Error during extension sync check',
    },
  },
};
