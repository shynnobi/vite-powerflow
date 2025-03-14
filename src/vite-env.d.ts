/// <reference types="vite/client" />

// Déclaration de types pour les modules qui n'ont pas de types
declare module 'rollup-plugin-visualizer';

// Étendre les types de Vitest
interface ImportMetaEnv {
	readonly VITE_APP_TITLE: string;
	// plus de variables d'environnement...
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
