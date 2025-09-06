/** @type {import('@changesets/types').Config} */
module.exports = {
  // Packages to exclude from npm publishing
  // vite-powerflow-sync is a VS Code extension, not an npm package
  privatePackages: {
    version: true, // Allow versioning
    tag: false, // Don't create git tags
  },

  // Packages that should be versioned but not published to npm
  ignore: ['vite-powerflow-sync'],

  // Update internal dependencies
  updateInternalDependencies: 'patch',

  // Base branch for changesets
  baseBranch: 'main',

  // Changelog configuration
  changelog: [
    '@changesets/changelog-github',
    {
      repo: 'shynnobi/vite-powerflow',
    },
  ],

  // Commit configuration
  commit: false, // We handle commits manually

  // Access configuration
  access: 'public',

  // Link configuration
  link: [],
};
