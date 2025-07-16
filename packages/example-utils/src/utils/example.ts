import { internalHelper } from './helper.js';

export function exampleFunction(name: string): string {
  console.log(`Calling exampleFunction with: ${name}`);
  return `Hello, ${name}!`;
}

export function exampleFunctionWithInternalHelper(name: string): string {
  const helperMessage = internalHelper();
  return `${helperMessage} - Hello, ${name}!`;
}
