/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

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

declare module '*.svg' {
  import type { SFC, SVGProps } from 'react';
  export const ReactComponent: SFC<SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.ico' {
  const src: string;
  export default src;
}

declare module '*.bmp' {
  const src: string;
  export default src;
}
