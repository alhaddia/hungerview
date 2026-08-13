import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Project Pages URL: https://alhaddia.github.io/hungerview/
export default defineConfig({
  plugins: [react()],
  base: '/hungerview/',
  server: { port: 5173 }
});
