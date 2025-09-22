import { defineConfig } from 'vite';
// Import the 'defineConfig' helper function from Vite
// This helps with type-checking and clearer config definitions

import react from '@vitejs/plugin-react';
// Import the official React plugin for Vite
// This plugin adds support for React Fast Refresh and JSX transformation

export default defineConfig({
  // Export the Vite configuration using defineConfig for better DX (developer experience)

  plugins: [react()]
  // Register the React plugin in Vite's plugin system
  // Enables React support (JSX, hot module replacement) when Vite runs
});

