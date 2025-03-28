import { join } from 'node:path';
import process from 'node:process';
import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const ROOT = process.cwd();
export default defineConfig({
  resolve: {
    alias: [
      { find: '@', replacement: join(__dirname, './src') },
    ],
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer(),
      ],
    },
  },
  build: {
    outDir: join(ROOT, './dist'),
    emptyOutDir: false,
    lib: {
      entry: join(ROOT, './src/index.ts'),
      formats: ['es', 'cjs'],
      cssFileName: 'index.min',
      fileName: (format, entryName) => {
        if (format === 'es') {
          return `${entryName}.mjs`;
        }

        return `${entryName}.js`;
      },
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
    copyPublicDir: false,
  },
  plugins: [
    react(),
    dts({ rollupTypes: true }),
  ],
});
