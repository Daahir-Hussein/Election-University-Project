import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'https://localhost:7202',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'https://localhost:7202',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
