/// <reference types="vite/client" />

// Type declarations for modules without types
declare module 'rollup-plugin-visualizer';

// Extend Vitest types
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  // more environment variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  localStorage: Storage;
  document: Document;
  matchMedia: (query: string) => MediaQueryList;
}
