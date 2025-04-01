import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Library build configuration
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.tsx'),
      name: 'ReactBlogBoilerplate',
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      // Make sure to exclude the zip files from the build
      external: [
        /\/blog-zips\/.*/,
        'react',
        'react-dom',
        'react-router-dom',
        'react-helmet-async',
        'lucide-react',
        'react-markdown',
        'remark-gfm'
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-router-dom': 'ReactRouterDOM',
          'react-helmet-async': 'ReactHelmetAsync',
          'lucide-react': 'LucideReact',
          'react-markdown': 'ReactMarkdown',
          'remark-gfm': 'remarkGfm'
        }
      }
    }
  }
});