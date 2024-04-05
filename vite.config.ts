import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import checker from 'vite-plugin-checker';
import mkcert from'vite-plugin-mkcert';

export default defineConfig({
  resolve: {
    alias: {
      'components': path.resolve(__dirname, './src/components'),
      'containers': path.resolve(__dirname, './src/containers'),
      'hooks': path.resolve(__dirname, './src/hook-store'),
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [
          [
            'babel-plugin-styled-components',
            {
              displayName: true,
              fileName: false
            }
          ]
        ]
      }
    }),
    mkcert(),
    svgr({
      include: '**/*.svg?react',
    }),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
        // lintCommand: 'eslint "./src/**/*.{ts,tsx}"', // base settings
      },
    }),
  ],
})
