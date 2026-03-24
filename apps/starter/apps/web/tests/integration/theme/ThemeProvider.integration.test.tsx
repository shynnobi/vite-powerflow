import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { useTheme } from '@/context/theme/ThemeContext';
import { ThemeProvider } from '@/context/theme/ThemeProvider';

function TestComponent() {
  const { theme, setTheme } = useTheme();
  return (
    <>
      <span data-testid="theme-value">{theme}</span>
      <button
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        data-testid="toggle-theme"
      >
        Toggle Theme
      </button>
    </>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    // Given: The localStorage and document className are reset before each test
    window.localStorage.clear();
    document.documentElement.className = '';
  });

  it('should provide the theme context to children', () => {
    // Given: The ThemeProvider is rendered with a TestComponent as child
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Then: The TestComponent should receive a theme value ("light" or "dark") from context
    expect(screen.getByTestId('theme-value').textContent).toMatch(/light|dark/);
  });

  it('should toggle theme and update document class', async () => {
    // Given: The ThemeProvider and TestComponent are rendered
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    const user = userEvent.setup();
    const button = screen.getByTestId('toggle-theme');
    const initialTheme = screen.getByTestId('theme-value').textContent;

    // When: The user clicks the toggle button
    await user.click(button);
    const toggledTheme = screen.getByTestId('theme-value').textContent;

    // Then: The theme value should change and the document class should be updated
    expect(toggledTheme).not.toBe(initialTheme);
    expect(toggledTheme).toBeTruthy();
    expect(document.documentElement.classList.contains(toggledTheme as string)).toBe(true);
  });

  it('should persist theme in localStorage', async () => {
    // Given: The ThemeProvider is rendered with a custom storageKey and TestComponent
    render(
      <ThemeProvider storageKey="test-theme-key">
        <TestComponent />
      </ThemeProvider>
    );
    const user = userEvent.setup();
    const button = screen.getByTestId('toggle-theme');

    // When: The user clicks the toggle button
    await user.click(button);
    const toggledTheme = screen.getByTestId('theme-value').textContent;

    // Then: The toggled theme should be persisted in localStorage under the custom key
    expect(window.localStorage.getItem('test-theme-key')).toBe(toggledTheme);
  });
});
