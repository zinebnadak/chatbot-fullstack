/** @type {import('tailwindcss').Config} */
// This is a TypeScript JSDoc comment that provides type information
// It helps editors with autocomplete and type-checking for Tailwind config

export default {
  // Export the Tailwind CSS configuration object as the default export

  content: ['./index.html', './src/**/*.{js,jsx}'],
  // Specifies the files Tailwind will scan for class names to generate styles
  // It looks at index.html and all JS/JSX files inside src folder (recursively)
  // This is important for "purging" unused CSS and keeping final build small

  darkMode: 'class', // enable class-based dark mode
  // Enables dark mode support controlled via a CSS class (usually 'dark')
  // Instead of relying on system preferences, you manually toggle dark mode by adding/removing the 'dark' class on an element (like <html>)

  theme: {
    extend: {}
    // The 'extend' object is where you customize or add to Tailwind's default theme
    // Empty here, so no customizations added yet
  },

  plugins: []
  // An array for adding extra Tailwind plugins if needed (like forms, typography, etc.)
  // Empty for now, so no additional plugins used
};
