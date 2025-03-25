import { join } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  root: './demo',
  resolve: {
    alias: [
      { find: '@', replacement: join(__dirname, './src') },
    ],
  },
  plugins: [react()],
});
