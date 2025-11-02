// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward /api requests to Django backend (Correct for LOCAL development)
      '/api': 'http://localhost:8000'
    }
  },
  // 🎯 ADD THIS SECTION TO EXPLICITLY DEFINE THE OUTPUT
  build: {
    outDir: 'dist', // This is the crucial line you need to explicitly set
    emptyOutDir: true // Good practice to ensure a clean build every time
  }
});



