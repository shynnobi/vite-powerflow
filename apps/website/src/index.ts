// Public API for website
export function getWebsiteVersion(): string {
  return '1.0.0';
}

export function greetUser(name: string): string {
  return `Welcome, ${name}, to our Website!`;
}
