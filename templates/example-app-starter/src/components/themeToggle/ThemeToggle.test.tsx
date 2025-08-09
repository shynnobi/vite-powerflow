import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, Mock, vi } from 'vitest';

import { ThemeToggle } from './ThemeToggle';

import { useTheme } from '@/context/theme/ThemeContext';

vi.mock('@/context/theme/ThemeContext');

const mockUseTheme = useTheme as unknown as Mock;

describe('ThemeToggle', () => {
  it('should render the toggle button', () => {
    // Given: The theme is light and a mock setTheme function is provided
    mockUseTheme.mockReturnValue({ theme: 'light', setTheme: vi.fn() });
    // When: The ThemeToggle component is rendered
    render(<ThemeToggle />);
    // Then: The toggle button should be present in the document
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should call setTheme with dark when current theme is light', async () => {
    // Given: The theme is light and a mock setTheme function is provided
    const setTheme = vi.fn();
    mockUseTheme.mockReturnValue({ theme: 'light', setTheme });
    render(<ThemeToggle />);
    const user = userEvent.setup();
    // When: The user clicks the toggle button
    await user.click(screen.getByRole('button'));
    // Then: setTheme should be called with "dark"
    expect(setTheme).toHaveBeenCalledWith('dark');
  });

  it('should call setTheme with light when current theme is dark', async () => {
    // Given: The theme is dark and a mock setTheme function is provided
    const setTheme = vi.fn();
    mockUseTheme.mockReturnValue({ theme: 'dark', setTheme });
    render(<ThemeToggle />);
    const user = userEvent.setup();
    // When: The user clicks the toggle button
    await user.click(screen.getByRole('button'));
    // Then: setTheme should be called with "light"
    expect(setTheme).toHaveBeenCalledWith('light');
  });
});
