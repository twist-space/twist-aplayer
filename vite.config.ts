import { join, resolve } from 'node:path';
import process from 'node:process';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const ROOT = process.cwd();
export default defineConfig({
  root: './demo',
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, './src') },
    ],
  },
  build: {
    outDir: join(ROOT, './dist'),
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'main.css';
          }
          return '[name][extname]';
        },
      },
    },
  },
  plugins: [
    react(),
  ],
});
