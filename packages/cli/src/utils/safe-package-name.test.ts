import { describe, expect, it } from 'vitest';

import { safePackageName } from './safe-package-name.js';

describe('safePackageName', () => {
  it('formats the name correctly', () => {
    expect(safePackageName('  Hello World  ')).toBe('hello-world');
    expect(safePackageName('Test CLI')).toBe('test-cli');
    expect(safePackageName('My_App!')).toBe('my_app');
    expect(safePackageName('   ')).toBe('');
    expect(safePackageName('vite-powerflow')).toBe('vite-powerflow');
    expect(safePackageName('Vite.Powerflow')).toBe('vite.powerflow');
  });
});
