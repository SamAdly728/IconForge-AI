import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // This is crucial: It makes process.env.API_KEY available in the browser
      // to satisfy the prompt requirements.
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Polyfill for other process.env usage if necessary
      'process.env': {} 
    },
    build: {
      chunkSizeWarningLimit: 1000, // Increase limit slightly
      rollupOptions: {
        output: {
          manualChunks: {
            // Split heavy dependencies into separate chunks
            'vendor-react': ['react', 'react-dom'],
            'vendor-firebase': ['firebase/app', 'firebase/auth'],
            'vendor-utils': ['jszip', '@google/genai', 'lucide-react']
          }
        }
      }
    }
  };
});