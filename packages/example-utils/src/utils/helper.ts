import { exampleFunction } from './example';

// Internal utility for the example-utils package

export function internalHelper(): string {
  console.log(exampleFunction);

  return 'Internal helper from example-utils';
}
