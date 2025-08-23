/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './.storybook/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // Brand colors - using CSS variables from index.css
        primary: {
          DEFAULT: 'var(--brand-primary)',
          alt: 'var(--brand-primary-alt)',
          light: 'var(--brand-primary-light)',
          dark: 'var(--brand-primary-dark)',
        },
      },
      scale: {
        98: '0.98',
        105: '1.05',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
