import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': 'https://chat-application-vz2x.onrender.com',
    },
  },
  plugins: [react()],
});
