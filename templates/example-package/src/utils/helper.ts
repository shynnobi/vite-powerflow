import { exampleFunction } from './example';

// Internal utility for the example-package package

export function internalHelper(): string {
  console.log(exampleFunction);

  return 'Internal helper from example-package';
}
