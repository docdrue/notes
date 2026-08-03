/// <reference types="vitest/config" />
import path from 'path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import checker from 'vite-plugin-checker';
import mkcert from'vite-plugin-mkcert';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: {
      'components': path.resolve(__dirname, './src/components'),
      'containers': path.resolve(__dirname, './src/containers'),
      'hooks': path.resolve(__dirname, './src/hook-store'),
    },
  },
  plugins: [
    react(),
    mkcert(),
    svgr({
      include: '**/*.svg?react',
    }),
    checker({
      eslint: {
        lintCommand: 'eslint src --ext js,jsx --report-unused-disable-directives',
      },
    }),
  ],
})
