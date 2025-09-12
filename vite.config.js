// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // proxy any request starting with /api to the backend
      '/api': {
        target: 'https://backend.jotish.in',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/backend_dev')
      }
    }
  }
});
