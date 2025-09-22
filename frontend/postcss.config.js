export default {
  // Exporting the configuration object as the default export

  plugins: {
    // The 'plugins' key holds all the PostCSS plugins to be used

    tailwindcss: {},
    // Adds Tailwind CSS as a PostCSS plugin
    // This enables Tailwind's utility classes to be processed and generated

    autoprefixer: {},
    // Adds Autoprefixer as a PostCSS plugin
    // It automatically adds vendor prefixes (like -webkit-, -moz-) to CSS rules for better cross-browser compatibility
  },
};

