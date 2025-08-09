// Types for package.json structures shared by scripts

export interface StarterSource {
  commit: string;
  syncedAt: string;
}

export interface TemplatePkgJson extends Record<string, unknown> {
  starterSource?: StarterSource;
  scripts?: Record<string, string>;
}

export interface TsConfigJson extends Record<string, unknown> {
  extends?: string;
}
