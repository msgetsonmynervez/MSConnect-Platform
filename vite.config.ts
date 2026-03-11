import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// This config tells Vite exactly where to find your code now 
// that we've moved it out of the "client" folder.
export default defineConfig({
  plugins: [react()],
  root: './', // Tells Vite the project starts HERE, not in a subfolder
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true
  }
});
