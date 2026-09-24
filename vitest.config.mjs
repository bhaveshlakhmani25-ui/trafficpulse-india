import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    css: false,
    server: {
      deps: {
        inline: ['@asamuzakjp/css-color', '@csstools/css-calc']
      }
    },
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
