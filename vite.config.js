import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
      components: path.resolve(__dirname, './src/components'),
      hooks: path.resolve(__dirname, './src/hooks'),
      services: path.resolve(__dirname, './src/services'),
      context: path.resolve(__dirname, './src/context'),
      styles: path.resolve(__dirname, './styles'),
    },
  },
});
