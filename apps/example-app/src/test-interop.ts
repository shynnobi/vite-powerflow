// Interoperability test: Example-app → All packages
import { exampleFunction } from '@vite-powerflow/example-utils';

console.log('=== Test Example-app → All packages ===');
console.log('example-utils:', exampleFunction('Example-app'));
console.log('✅ All packages work together in Example-app!');
