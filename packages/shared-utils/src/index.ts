/**
 * Shared utilities for Vite Powerflow monorepo
 *
 * This package contains common utilities that are inlined into consuming packages
 * at build time to avoid circular dependencies and simplify the architecture.
 */

export * from './logger.js';
export * from './monorepo.js';
