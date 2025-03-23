import { defineConfig } from 'tsup';

export default defineConfig({
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  esbuildOptions: (options) => {
    options.jsx = 'automatic';
  },
});
