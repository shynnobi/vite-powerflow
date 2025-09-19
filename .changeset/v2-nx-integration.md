---
'@vite-powerflow/create': major
'@vite-powerflow/starter': major
---

baseline: 08d79e2ca815952ed3a2a9dae101c13570eaeadb

# v2.0.0: Nx Integration + Process Optimization

## 📖 Description

This major release introduces **Nx** as the core build system and optimization engine, enhancing the already robust starter with **enterprise-grade** build optimization and advanced development workflows. The integration brings intelligent caching, affected detection, and parallel execution capabilities that significantly improve build performance and developer experience.

The CLI has been enhanced with dynamic project configuration and improved template synchronization, ensuring seamless project creation with the new Nx architecture.

## 🚀 Major Release - Complete Architecture Evolution

### Nx Integration & Performance Optimization

- **Complete Nx integration** with intelligent caching and daemon process
- **Affected detection** for optimized builds and testing
- **Parallel execution** support for faster CI/CD pipelines
- **Plugin ecosystem** integration (@nx/vite, @nx/eslint, @nx/js)
- **Named inputs and production patterns** for intelligent caching

### New Configuration Architecture

- **`nx.json`** - Main Nx configuration with task runners and plugins
- **`project.json`** - Project-specific targets and dependencies
- **`.nxignore`** - Cache optimization patterns
- **`tsconfig.spec.json`** - Dedicated test TypeScript configuration

### Enhanced Scripts & Workflows

- **`scripts/dev-server.js`** - Standardized development server with Nx
- **`scripts/monitor-processes.sh`** - Process monitoring and zombie detection
- **Updated package.json scripts** - Nx-optimized commands with better organization

### Playwright Docker Optimizations

- **Zombie process prevention** with `init: true`, `ipc: host`, `shm_size: 2gb`
- **Global teardown** (`tests/e2e/global-teardown.ts`) for proper cleanup
- **Optimized configuration** with reduced timeouts and better error handling
- **Enhanced test coverage** reporting and performance

### CLI Enhancements

- **Dynamic project configuration** with placeholder replacement in `vite.config.ts`
- **Enhanced template processing** with `{{projectName}}` placeholder support
- **Improved sync workflow** for Nx-compatible projects
- **Better error handling** during project creation process
- **Consistent script behavior** across all generated projects

## 🎯 Breaking Changes

- **New Nx configuration files** are required (`nx.json`, `project.json`)
- **Updated Docker requirements** for IPC support (`init: true`, `ipc: host`)
- **Script modifications** for Nx compatibility
- **New dependencies** (@nx/\* packages, nx)

## 📦 Dependencies

### Added

- `@nx/eslint` - Nx ESLint integration
- `@nx/eslint-plugin` - Nx ESLint rules
- `@nx/js` - Nx JavaScript support
- `@nx/vite` - Nx Vite integration
- `@nx/web` - Nx web support
- `nx` - Core Nx monorepo tool

## 🧪 Testing & Quality

- All existing tests continue to pass
- New E2E test optimizations for Docker environments
- Enhanced test coverage reporting
- Improved test performance with Nx caching
- Process monitoring tools for development

This major release provides a solid foundation for future monorepo expansion. The integration of Nx brings enterprise-grade build optimization and developer experience improvements for new projects created with the CLI.
