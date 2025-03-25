import { join } from 'node:path';
import process from 'node:process';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const ROOT = process.cwd();
export default defineConfig({
  resolve: {
    alias: [
      { find: '@', replacement: join(__dirname, './src') },
    ],
  },
  build: {
    outDir: join(ROOT, './dist'),
    lib: {
      name: 'TwistAPlayer',
      entry: join(ROOT, './src/index.ts'),
      formats: ['umd'],
      fileName: format => `twist-aplayer.${format}.js`,
      cssFileName: 'main',
    },
    rollupOptions: {
      external: ['react', 'react-dom', /\.(scss|css)$/],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    copyPublicDir: false,
  },
  plugins: [react()],
  define: {
    'process.env': {},
  },
});
