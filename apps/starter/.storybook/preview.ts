import React from 'react';
import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react-vite';
import { INITIAL_VIEWPORTS, MINIMAL_VIEWPORTS } from 'storybook/viewport';

import '../src/index.css';

// Custom viewports
const CUSTOM_VIEWPORTS = {
  xs: {
    name: 'xs (320px)',
    styles: {
      width: '320px',
      height: '568px',
    },
  },
  sm: {
    name: 'sm (640px)',
    styles: {
      width: '640px',
      height: '768px',
    },
  },
  md: {
    name: 'md (768px)',
    styles: {
      width: '768px',
      height: '1024px',
    },
  },
  lg: {
    name: 'lg (1024px)',
    styles: {
      width: '1024px',
      height: '768px',
    },
  },
  xl: {
    name: 'xl (1280px)',
    styles: {
      width: '1280px',
      height: '800px',
    },
  },
  '2xl': {
    name: '2xl (1536px)',
    styles: {
      width: '1536px',
      height: '864px',
    },
  },
};

const withTailwindBackground = (Story: React.FC) => {
  return React.createElement(
    'div',
    { className: 'bg-background text-foreground' },
    React.createElement(Story)
  );
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: {
        ...CUSTOM_VIEWPORTS, // Custom Tailwind breakpoints
        ...MINIMAL_VIEWPORTS, // Essential device sizes
        ...INITIAL_VIEWPORTS, // All predefined devices
      },
    },
    // Default configuration
    layout: 'centered',
  },

  decorators: [
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    withTailwindBackground,
  ],

  tags: ['autodocs'],
};

export default preview;
