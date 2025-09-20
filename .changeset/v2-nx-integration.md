---
'@vite-powerflow/create': major
'@vite-powerflow/starter': major
---

anchor: 03894e2d5516ee278c2c16eafbd54a71d487df39
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

### Dual Lint-Staged Configuration System

- **Starter configuration** - Standalone lint-staged config for monorepo compatibility
- **Template system** - Dual config files (`.lintstagedrc.js` + `.lintstagedrc-nx.js`)
- **CLI intelligence** - Automatically selects appropriate config during project generation
- **Generated projects** - Clean Nx configuration without standalone dependencies
- **Release workflow fix** - Resolves `nx ENOENT` errors in CI/CD pipelines

## 🎯 Breaking Changes

- **New Nx configuration files** are required (`nx.json`, `project.json`)
- **Updated Docker requirements** for IPC support (`init: true`, `ipc: host`)
- **Script modifications** for Nx compatibility
- **New dependencies** (@nx/\* packages, nx)
- **Lint-staged configuration** - Generated projects now use Nx-based lint-staged config

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
- **Release workflow stability** - Fixed lint-staged execution in CI/CD

## 🔧 Technical Improvements

### Lint-Staged Architecture

- **Monorepo compatibility** - Starter uses standalone config to avoid Nx dependency issues
- **Template flexibility** - Dual config system allows both standalone and Nx configurations
- **CLI intelligence** - Automatic config selection based on project type
- **Clean generation** - Generated projects have consistent Nx-based tooling
- **CI/CD reliability** - Resolved template execution errors in release workflows

This major release provides a solid foundation for future monorepo expansion. The integration of Nx brings enterprise-grade build optimization and developer experience improvements for new projects created with the CLI, while maintaining compatibility with existing workflows and ensuring reliable CI/CD operations.
