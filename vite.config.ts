import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Ensure blog content is included in the build
  assetsInclude: ['**/*.md', '**/*.jpg', '**/*.png', '**/*.gif', '**/*.jpeg', '**/*.webp'],
  publicDir: 'public',
  server: {
    fs: {
      // Allow serving files from project root, blog-content, and node_modules
      allow: ['.', 'blog-content', 'node_modules'],
      strict: false
    },
  },
  build: {
    rollupOptions: {
      // Make sure to exclude the zip files from the build
      external: [
        /\/blog-zips\/.*/
      ]
    }
  }
});